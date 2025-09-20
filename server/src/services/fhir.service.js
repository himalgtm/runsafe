export function bundleFromEntries(entries){
  return {
    resourceType:'Bundle', type:'collection',
    entry: entries.map(e=>({ resource:{
      resourceType:'Observation', id:e.id, status:'final',
      category:[{ coding:[{ system:'http://terminology.hl7.org/CodeSystem/observation-category', code:'survey'}]}],
      code:{ text:'Symptom diary (cough/wheeze/breath)' },
      effectiveDateTime:e.ts,
      valueString: JSON.stringify({ cough:e.cough, wheeze:e.wheeze, breath:e.breath, note:e.note })
    }}))
  };
}