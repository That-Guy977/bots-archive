export default function getSource(path) {
  return path.match(/(?<source>\w+)\/(?<thisFile>\w+).js$/).groups
}
