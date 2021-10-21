export default function isSnowflake(str) {
  return typeof str === 'string' && /^\d{17,19}$/.test(str)
}
