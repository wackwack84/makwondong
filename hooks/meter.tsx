import { atom, read, update } from 'claude-code'
import type { Register, SessionRateLimit, SessionContextUsage } from 'claude-code'

const LABELS: Record<string, string> = {
  five_hour: '5시간',
  seven_day: '주간',
  spend_limit: '한도',
}

const PLACEHOLDER = '사용량 · 첫 응답 후 표시됩니다'
const line = atom({ plugin: 'usage-meter', key: 'line' } as const, PLACEHOLDER)

function resetIn(iso?: string): string {
  if (!iso) return ''
  const ms = Date.parse(iso) - Date.now()
  if (!(ms > 0)) return ''
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h >= 24 ? ` (${Math.floor(h / 24)}일 후 리셋)` : h > 0 ? ` (${h}시간 ${m}분 후 리셋)` : ` (${m}분 후 리셋)`
}

export function format(rateLimits: SessionRateLimit[], context?: SessionContextUsage): string {
  const parts = rateLimits.map(r => `${LABELS[r.kind] ?? r.kind} ${r.percentUsed}%${resetIn(r.resetsAt)}`)
  if (context?.percent !== undefined) parts.push(`컨텍스트 ${context.percent}%`)
  return parts.length ? `사용량 · ${parts.join(' · ')}` : PLACEHOLDER
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try {
      const u = await $.session.usage()
      const text = format(u.rateLimits, u.context)
      await update($, line, () => text)
      $.ui.status(text)
    } catch {
      $.ui.status(PLACEHOLDER)
    }
    return r
  })

  on('session.measure', async ($, e, next) => {
    const text = format(e.rateLimits, e.context)
    await update($, line, () => text)
    $.ui.status(text)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const text = await read($, line)
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text key="usage" dimColor>{text}</Text>
      </Box>
    )
  })
}
