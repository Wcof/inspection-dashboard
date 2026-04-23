export const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatClock = (date: Date) => {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

export const formatDateInput = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export const toNumberFromText = (raw: string | number | undefined) => {
  const parsed = Number.parseFloat(String(raw ?? '').replace(/[^\d.]/g, ''))
  return Number.isNaN(parsed) ? 0 : parsed
}
