export default function isPrimitive(strc) {
  return !strc || ['boolean', 'string', 'number', 'bigint'].includes(typeof strc)
}
