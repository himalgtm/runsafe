export const defaultProfile = {
  asthma:false, copd:false, pregnant:false, child:false, older:false,
  home: { smoker:false, gas:false, mold:false },
  __active:false,
};

export function loadProfile(){
  try { return JSON.parse(localStorage.getItem("profile")) || defaultProfile; }
  catch { return defaultProfile; }
}
export function saveProfile(p){
  localStorage.setItem("profile", JSON.stringify(p));
}
