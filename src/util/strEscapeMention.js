export default function strEscapeMention(str) {
  return str.match(/(?<=^<(?:@[&!]?|#))\d{17,19}(?=>$)/)?.[0] ?? str
}
