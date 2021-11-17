import { get, set } from "idb-keyval";
export class IndexDBService {
  async getByName(key) {
    const storedKey = (await get(key)) ?? null;
    return storedKey;
  }
  async get(key) {
    const storedKey = (await get(key)) ?? [];
    return storedKey;
  }
  set(key, obj) {
    set(key, obj);
  }
}
