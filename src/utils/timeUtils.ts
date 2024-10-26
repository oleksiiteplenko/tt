export const timeOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
} as const;

export function formatDate(date: Date): string {
  return date.toLocaleString(undefined, timeOptions);
}

const units = [
    { label: 'd', value: 86400 },  // 1 day = 86400 seconds
    { label: 'h', value: 3600 },   // 1 hour = 3600 seconds
    { label: 'm', value: 60 },     // 1 minute = 60 seconds
    { label: 's', value: 1 }       // 1 second = 1 second
];
export function formatDuration(seconds: number) {
  let remainingSeconds = seconds;
  const parts = [];

  // Loop through each unit and calculate the value
  for (const unit of units) {
      const quotient = Math.floor(remainingSeconds / unit.value);
      if (quotient > 0) {
          parts.push(`${quotient}${unit.label}`);
          remainingSeconds -= quotient * unit.value;
      }
  }

  // Join the non-zero parts together, e.g., "1h 15m"
  return parts.join(' ');
}

const regex = /(\d+)([hms])/g;
const timeUnits: { [key: string]: number } = {
  h: 3600,   // 1 hour = 3600 seconds
  m: 60,     // 1 minute = 60 seconds
  s: 1       // 1 second = 1 second
};
export function timeStringToSeconds(timeStr: string): number {
  let seconds = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(timeStr)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    seconds += value * timeUnits[unit];
  }

  return seconds;
}
