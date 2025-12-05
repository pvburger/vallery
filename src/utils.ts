// parses folder path from file path
export function getLastPath(inp: string): string {
  const lastSlash = inp.lastIndexOf('/');
  return inp.slice(0, lastSlash + 1);
}
