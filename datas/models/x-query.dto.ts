export interface XQueryDto {
  filter?: string;
  containsDetail?: boolean;
  enableTracking?: boolean;
  sortBy?: string;
  isAscending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface XQueryResultDto<T = any> {
  items?: Array<T>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalFilteredItems?: number;
  totalItems?: number;
}
