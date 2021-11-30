import isSnowflake from "./isSnowflake.js"

export default function isIdData(input) {
  return isSnowflake(input) || input === null
}
