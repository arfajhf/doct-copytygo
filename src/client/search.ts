export type SearchEntry = { title: string; route: string; text: string };
export function searchEntries(
  entries: SearchEntry[],
  query: string,
): SearchEntry[] {
  const terms = query
    .trim()
    .toLocaleLowerCase("en")
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return [];
  return entries
    .map((entry) => {
      const title = entry.title.toLocaleLowerCase("en"),
        body = entry.text.toLocaleLowerCase("en");
      const score = terms.every(
        (term) => title.includes(term) || body.includes(term),
      )
        ? (title === query.trim().toLocaleLowerCase("en") ? 50 : 0) +
          terms.reduce(
            (sum, term) =>
              sum +
              (title.includes(term) ? 10 : 0) +
              (body.includes(term) ? 1 : 0),
            0,
          )
        : 0;
      return { entry, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 18)
    .map((row) => row.entry);
}
