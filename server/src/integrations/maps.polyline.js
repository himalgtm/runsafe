import polyline from '@mapbox/polyline';
export const decodePolyline = enc => polyline.decode(enc).map(([lat,lon])=>({lat,lon}));
