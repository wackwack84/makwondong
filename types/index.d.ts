export type UsageLine = string

declare module 'claude-code' {
  interface PluginState {
    'usage-meter': { line: UsageLine }
  }
}
