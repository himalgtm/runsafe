import { bundleFromEntries } from '../services/fhir.service.js';
export function fhirController(store){
  return { export: async (_req,res)=> res.json(bundleFromEntries(await store.listEntries())) };
}