

/**
 * Normalizes text  - removes punctuation, converts to lowercase
 */
export const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ");
};

/**
 * Converts number words to digits (e.g., "one" -> "1")
 */
export const convertNumberWords = (text) => {
  const numberMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
  };

  let result = text;
  Object.keys(numberMap).forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, numberMap[word]);
  });

  return result;
};

/**
 * Extracts search terms from natural language query
 */
export const extractSearchTerms = (query) => {
  const normalized = convertNumberWords(normalizeText(query));

  // Extract bedrooms (handles: 1 bedroom, 1-bedroom, 1 bed, 1br, 1b)
  const bedroomMatch = normalized.match(/(\d+)\s*(bed|bedroom|br|b)(?!ath)/);
  const bedrooms = bedroomMatch ? bedroomMatch[1] : null;

  // Extract price range
  const priceMatch = normalized.match(/(\d+)k?\s*(to|-)?\s*(\d+)?k?/);
  let minPrice = null,
    maxPrice = null;
  if (priceMatch) {
    minPrice = parseInt(priceMatch[1]) * (priceMatch[1].length <= 3 ? 1000 : 1);
    if (priceMatch[3]) {
      maxPrice = parseInt(priceMatch[3]) * (priceMatch[3].length <= 3 ? 1000 : 1);
    }
  }

  // Extract property types
  const types = [
    "apartment",
    "house",
    "villa",
    "studio",
    "townhouse",
    "penthouse",
  ];
  const type = types.find((t) => normalized.includes(t));

  // Extract location (remaining words after removing numbers and types)
  let location = normalized
    .replace(/\d+\s*(bed|bedroom|br|b|k)/g, "")
    .replace(new RegExp(types.join("|"), "g"), "")
    .trim();

  // Extract amenities
  const amenityKeywords = [
    "parking",
    "security",
    "gym",
    "pool",
    "garden",
    "balcony",
  ];
  const amenities = amenityKeywords.filter((a) => normalized.includes(a));

  return { bedrooms, minPrice, maxPrice, type, location, amenities };
};

/**
 * Fuzzy matching function - handles partial matches and typos
 */
export const fuzzyMatch = (text, search, threshold = 0.6) => {
  if (!text || !search) return false;

  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(search);

  // Exact match
  if (normalizedText.includes(normalizedSearch)) return true;

  // Word-by-word match
  const searchWords = normalizedSearch.split(" ").filter((w) => w.length > 2);
  if (searchWords.length === 0) return true;

  const matchedWords = searchWords.filter((word) =>
    normalizedText.includes(word)
  );

  return matchedWords.length / searchWords.length >= threshold;
};

/**
 * Main filtering function for properties
 */
export const filterProperties = (properties, quickQuery, advancedFilters) => {
  if (!quickQuery && Object.keys(advancedFilters).length === 0) {
    return properties;
  }

  let searchTerms = {};

  // Parse quick search query
  if (quickQuery) {
    searchTerms = extractSearchTerms(quickQuery);
  }

  return properties.filter((property) => {
    // QUICK SEARCH PROCESSING
    if (quickQuery) {
      // Check bedrooms
      if (searchTerms.bedrooms) {
        const propBedrooms = String(property.bedrooms).replace("+", "");
        const searchBedrooms = String(searchTerms.bedrooms).replace("+", "");
        if (propBedrooms !== searchBedrooms) {
          return false;
        }
      }

      // Check property type
      if (searchTerms.type && !fuzzyMatch(property.type, searchTerms.type)) {
        return false;
      }

      // Check location
      if (
        searchTerms.location &&
        !fuzzyMatch(property.location, searchTerms.location)
      ) {
        return false;
      }

      // Check price range
      const propPrice = Number(property.price);
      if (searchTerms.minPrice && propPrice < searchTerms.minPrice) {
        return false;
      }
      if (searchTerms.maxPrice && propPrice > searchTerms.maxPrice) {
        return false;
      }

      // Check amenities
      if (searchTerms.amenities && searchTerms.amenities.length > 0) {
        const propAmenities = (property.amenities || []).map((a) =>
          normalizeText(a)
        );
        const hasAmenity = searchTerms.amenities.some((amenity) =>
          propAmenities.some((pa) => pa.includes(amenity))
        );
        if (!hasAmenity) return false;
      }
    }

    // ADVANCED SEARCH PROCESSING
    if (advancedFilters.location && advancedFilters.location !== "") {
      if (!fuzzyMatch(property.location, advancedFilters.location)) {
        return false;
      }
    }

    if (advancedFilters.type && advancedFilters.type !== "") {
      if (!fuzzyMatch(property.type, advancedFilters.type)) {
        return false;
      }
    }

    if (advancedFilters.bedrooms && advancedFilters.bedrooms !== "") {
      const filterBeds = advancedFilters.bedrooms.replace("+", "");
      const propBeds = String(property.bedrooms).replace("+", "");

      if (advancedFilters.bedrooms.includes("+")) {
        if (Number(propBeds) < Number(filterBeds)) return false;
      } else {
        if (propBeds !== filterBeds) return false;
      }
    }

    if (advancedFilters.minPrice && advancedFilters.minPrice !== "") {
      if (Number(property.price) < Number(advancedFilters.minPrice)) {
        return false;
      }
    }

    if (advancedFilters.maxPrice && advancedFilters.maxPrice !== "") {
      if (Number(property.price) > Number(advancedFilters.maxPrice)) {
        return false;
      }
    }

    if (advancedFilters.amenities && advancedFilters.amenities !== "") {
      const filterAmenities = advancedFilters.amenities
        .split(",")
        .map((a) => normalizeText(a.trim()))
        .filter((a) => a);

      const propAmenities = (property.amenities || []).map((a) =>
        normalizeText(a)
      );

      const hasAllAmenities = filterAmenities.every((fa) =>
        propAmenities.some((pa) => pa.includes(fa) || fa.includes(pa))
      );

      if (!hasAllAmenities) return false;
    }

    return true;
  });
};