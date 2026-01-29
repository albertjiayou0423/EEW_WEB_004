// src/lib/p2p.js

export const P2P_TSUNAMI_API_URL = 'https://api.p2pquake.net/v2/jma/tsunami';

/**
 * Fetches the latest tsunami information from p2p API
 * @returns {Promise<Array|null>}
 */
export async function fetchTsunamiInfo() {
  try {
    const response = await fetch(`${P2P_TSUNAMI_API_URL}?limit=1`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return parseP2PTsunamiData(data);
  } catch (error) {
    console.error('Error fetching p2p tsunami data:', error);
    return null;
  }
}

/**
 * Parses p2p Tsunami API response
 * @param {Array} data
 * @returns {Object|null}
 */
export function parseP2PTsunamiData(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const latest = data[0];
  return {
    id: latest.id,
    time: latest.time,
    cancelled: latest.cancelled,
    issue: latest.issue,
    areas: latest.areas || [],
  };
}
