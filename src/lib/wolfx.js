// src/lib/wolfx.js

export const WOLFX_WS_URL = 'wss://ws-api.wolfx.jp/jma_eew';
export const WOLFX_EQLIST_URL = 'https://api.wolfx.jp/jma_eqlist.json';

/**
 * Parses the Wolfx JMA EEW message
 * @param {Object} data
 * @returns {Object|null}
 */
export function parseWolfxMessage(data) {
  if (data.type !== 'jma_eew') return null;

  return {
    id: data.EventID,
    serial: data.Serial,
    title: data.Title,
    announcedTime: data.AnnouncedTime,
    originTime: data.OriginTime,
    hypocenter: data.Hypocenter,
    latitude: data.Latitude,
    longitude: data.Longitude,
    magnitude: data.Magunitude,
    depth: data.Depth,
    maxIntensity: data.MaxIntensity,
    isCancel: data.isCancel,
    isFinal: data.isFinal,
    isWarn: data.isWarn,
    originalText: data.OriginalText,
  };
}

/**
 * Fetches the latest 50 earthquakes from Wolfx
 * @returns {Promise<Array>}
 */
export async function fetchEarthquakeList() {
  try {
    const response = await fetch(WOLFX_EQLIST_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    // Convert object {No1: ..., No2: ...} to array
    const list = Object.keys(data)
      .filter(key => key.startsWith('No'))
      .map(key => {
        const item = data[key];
        return {
          id: item.EventID || key,
          title: item.Title,
          reportTime: item.time,
          originTime: item.time_full,
          hypocenter: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
          depth: item.depth.replace('km', ''),
          magnitude: item.magnitude,
          maxIntensity: item.shindo,
        };
      });
    return list;
  } catch (error) {
    console.error('Error fetching Wolfx earthquake list:', error);
    return [];
  }
}
