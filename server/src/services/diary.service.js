import { randomUUID } from 'crypto';
export function makeDiaryService(store){
  return {
    async log({ ts, lat, lon, cough=0, wheeze=0, breath=0, note }){
      const e = { id: randomUUID(), ts: ts || new Date().toISOString(), lat, lon,
        cough:Number(cough), wheeze:Number(wheeze), breath:Number(breath), note };
      await store.insertEntry(e); return { ok:true, id:e.id };
    },
    async list(){ return store.listEntries(); }
  };
}