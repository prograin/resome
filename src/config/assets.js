import release from "../generated/release.json";
export const version = release.version;
export function assetUrl(value) {
  if (!value) return value;
  const [url, hash] = value.replace(/^\.\/assets\//, "/assets/").split("#", 2);
  const versioned = /[?&]v=/.test(url)
    ? url.replace(/([?&])v=[^&]*/, `$1v=${version}`)
    : `${url}${url.includes("?") ? "&" : "?"}v=${version}`;
  return hash === undefined ? versioned : `${versioned}#${hash}`;
}
