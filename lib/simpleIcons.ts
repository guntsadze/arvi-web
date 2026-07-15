/**
 * Simple Icons slug normalization — lowercase, strip everything that isn't
 * a-z/0-9. E.g. "Mercedes-Benz" -> "mercedesbenz", "Alfa Romeo" ->
 * "alfaromeo", "Land Rover" -> "landrover". Deliberately not a hand-kept
 * allowlist: real 404s for brands Simple Icons doesn't carry are handled
 * per-tile via the <img>'s onError fallback instead.
 */
export function simpleIconsSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function simpleIconsUrl(name: string): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${simpleIconsSlug(name)}.svg`;
}
