import { createInstance } from "localforage";

export class Library<Entry = unknown> {
  #store: LocalForage;

  constructor(public name: string) {
    this.#store = createInstance({ name });
  }

  write(filename: string, item: Entry) {
    return this.#store.setItem(filename, item);
  }

  async list(): Promise<[key: string, value: Entry][]> {
    const list: [key: string, value: Entry][] = [];
    await this.#store.iterate((value, key) => {
      list.push([key, value as Entry]);
    });
    return list;
  }

  async read(filename: string) {
    const value = await this.#store.getItem<Entry>(filename);
    if (value === null) throw new Error(`File "${filename}" does not exists.`);
    return value;
  }

  async exists(filename: string) {
    const value = await this.#store.getItem(filename);
    return value === null;
  }
}
