export const loadPlaces = () => {
  try { return JSON.parse(localStorage.getItem("places")) || []; }
  catch { return []; }
};
export const savePlaces = (arr) => localStorage.setItem("places", JSON.stringify(arr));
