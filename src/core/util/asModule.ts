export default function asModule(path: string): string | null {
  return path.endsWith(".js") ? path.slice(0, -3) : null;
}
