const toRad = d => d*Math.PI/180;
export function haversine(a,b){ const R=6371000; const dLat=toRad(b.lat-a.lat), dLon=toRad(b.lon-a.lon);
  const x=Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x)); }
export function downsample(coords, step=200){ const out=[]; let last=null;
  for(const c of coords){ if(!last || haversine(last,c)>=step){ out.push(c); last=c; } }
  return out.length?out:coords.slice(-1); }
