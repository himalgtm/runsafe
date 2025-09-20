import { makeDiaryService } from '../services/diary.service.js';
export function diaryController(store){
  const svc = makeDiaryService(store);
  return {
    log: async (req,res)=> res.json(await svc.log(req.body||{})),
    list: async (_req,res)=> res.json({ entries: await svc.list() })
  };
}
