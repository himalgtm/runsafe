import fetch from 'node-fetch';
import { ENV } from '../config/env.js';
const must = (v, n) => { if(!v) throw new Error(`Missing ${n}`); return v; };
export function mongoStore(){
  const base = must(ENV.ATLAS_DATA_API_URL,'ATLAS_DATA_API_URL');
  const key = must(ENV.ATLAS_DATA_API_KEY,'ATLAS_DATA_API_KEY');
  const headers = { 'Content-Type':'application/json', 'api-key': key };
  const call = async (action, body) => {
    const r = await fetch(`${base}/action/${action}`, { method:'POST', headers, body: JSON.stringify({
      dataSource: ENV.ATLAS_CLUSTER_NAME, database: ENV.ATLAS_DATABASE, collection: ENV.ATLAS_COLLECTION, ...body
    })});
    if(!r.ok) throw new Error(`Atlas ${action} failed: ${r.status}`); return r.json();
  };
  return {
    async insertEntry(e){ await call('insertOne', { document: e }); },
    async listEntries(){ const x = await call('find', { sort:{ ts:1 }, limit:1000 }); return x.documents||[]; }
  };
}
