import type { Register, SessionRateLimit, SessionContextUsage } from 'claude-code'

const LABELS: Record<string, string> = {
  five_hour: '5시간',
  seven_day: '주간',
  spend_limit: '한도',
}

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
  return parts.length ? `사용량 · ${parts.join(' · ')}` : '사용량 · 첫 응답 후 표시됩니다'
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try {
      const u = await $.session.usage()
      $.ui.status(format(u.rateLimits, u.context))
    } catch {
      $.ui.status(format([]))
    }
    return r
  })

  on('session.measure', ($, e, next) => {
    $.ui.status(format(e.rateLimits, e.context))
    return next(e)
  })
}
