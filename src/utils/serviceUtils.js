// Simple fuzzy match for phrases like “1 bedroom” ≈ “one-bedroom”
export function fuzzyMatch(property, query) {
  const normalize = (str) =>
    str.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

  const q = normalize(query);
  const text =
    normalize(property.title) +
    " " +
    normalize(property.location) +
    " " +
    normalize(property.description || "");

  return text.includes(q);
}

export function filterProperties(properties, filters) {
  return properties.filter((p) => {
    return (
      (!filters.location ||
        p.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.type ||
        p.type.toLowerCase().includes(filters.type.toLowerCase())) &&
      (!filters.price || parseInt(p.price) <= parseInt(filters.price)) &&
      (!filters.bedrooms ||
        parseInt(p.bedrooms) === parseInt(filters.bedrooms))
    );
  });
}
