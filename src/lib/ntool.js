// src/lib/ntool.js

export const NTOOL_API_URL = 'https://dev.narikakun.net/webapi/earthquake/post_data.json';

/**
 * Fetches the latest earthquake information from nTool API
 * @returns {Promise<Object|null>}
 */
export async function fetchLatestEarthquake() {
  try {
    const response = await fetch(NTOOL_API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return parseNToolData(data);
  } catch (error) {
    console.error('Error fetching nTool data:', error);
    return null;
  }
}

/**
 * Parses nTool API response
 * @param {Object} data
 * @returns {Object|null}
 */
export function parseNToolData(data) {
  if (!data || !data.Body) return null;

  const body = data.Body;
  const head = data.Head;

  return {
    id: head.EventID,
    title: head.Title,
    reportTime: head.ReportDateTime,
    originTime: body.Earthquake?.OriginTime || null,
    hypocenter: body.Earthquake?.Hypocenter?.Name || '不明',
    latitude: body.Earthquake?.Hypocenter?.Latitude || null,
    longitude: body.Earthquake?.Hypocenter?.Longitude || null,
    depth: body.Earthquake?.Hypocenter?.Depth || null,
    magnitude: body.Earthquake?.Magnitude || null,
    maxIntensity: body.Intensity?.Observation?.MaxInt || null,
    infoKind: head.InfoKind,
    headline: head.Headline,
  };
}
