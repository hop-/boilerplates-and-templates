export interface ICrud<T> {
  create: (resource: T) => Promise<T>;
  readAll: (limit: number, page: number) => Promise<T[]>;
  readById: (id: string) => Promise<T>;
  updateById: (id: string, resource: T) => Promise<T>;
  deleteById: (id: string) => Promise<T>;
}
