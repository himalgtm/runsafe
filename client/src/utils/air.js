// Quick AQI scaler (heuristic over EPA breakpoints)
export function quickAQI(pm25, o3, no2){
  return Math.max(
    scale(pm25, [0,12,35.4,55.4,150.4,250.4,500.4], [0,50,100,150,200,300,500]),
    scale(o3,   [0,54,70,85,105,200,500],           [0,50,100,150,200,300,500]),
    scale(no2,  [0,53,100,360,649,1249,2049],       [0,50,100,150,200,300,500]),
  );
}
function scale(v, brk, out){
  for (let i=1;i<brk.length;i++){
    if (v<=brk[i]){
      const [a,b] = [brk[i-1], brk[i]];
      const [A,B] = [out[i-1], out[i]];
      return A + (B-A)*((v-a)/(b-a));
    }
  }
  return out[out.length-1];
}

// Personalized status
export function classifyAQI(aqi, profile){
  let bands = [50,100,150,200,300,500];
  if (profile?.asthma || profile?.copd || profile?.pregnant || profile?.child || profile?.older){
    bands = [40,80,120,160,220,500]; // tightened
  }
  const labels = ["Good","Moderate","Caution","Unhealthy","Very Unhealthy","Hazardous"];
  const idx = bands.findIndex(b=>aqi<=b);
  return labels[idx===-1?labels.length-1:idx];
}

// One-line rationale
export function rationaleOneLine(aqi, pol, smoke=false){
  const entries = [["PM2.5",pol.pm25],["O3",pol.o3],["NO2",pol.no2]].sort((a,b)=>b[1]-a[1]);
  const top = entries[0]?.[0] || "PM2.5";
  if (smoke) return `Smoke present; ${top} elevated—consider indoor activity.`;
  if (aqi<=50) return "Air is clean; enjoy outdoor activity.";
  if (aqi<=100) return `${top} mildly elevated; light outdoor activity is fine.`;
  if (aqi<=150) return `${top} elevated; sensitive groups should shorten or go easy.`;
  return `${top} high; move indoors or reschedule.`;
}

// Compute 2–3 best windows over next N hours
export function bestWindows(series, hours=12){
  if (!series?.length) return [];
  // simple: take 2 best single-hour slots; label HH format rolling
  const now = new Date();
  const items = series.map((v,i)=>({ i, v, date: new Date(now.getTime()+i*3600e3)}))
    .sort((a,b)=>a.v-b.v)
    .slice(0,3)
    .sort((a,b)=>a.i-b.i);
  return items.map(x=>({
    label: x.date.toLocaleTimeString([], {hour:"numeric"}),
    median: x.v,
  }));
}
