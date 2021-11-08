import isSnowflake from "./isSnowflake.js"

export default function isIdData(data) {
  return isSnowflake(data) || data === null
}
