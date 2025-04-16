export interface IGenericPagination<T> {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    items: T[];
  }