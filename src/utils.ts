export function toEosDate(date: Date): string {
  return date.toISOString().slice(0, -5)
}
