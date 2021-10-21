export default function isToken(str) {
  return typeof str === 'string' && /^[\w-]{24}\.[\w-]{6}\.[\w-]{27}$/.test(str)
}
