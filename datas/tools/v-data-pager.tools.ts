import {
    XBaseDataPagerQuery,
    XBaseDataPagerQueryResult,
  } from 'x-framework-core';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { XQueryDto, XQueryResultDto } from '../models/x-query.dto';
  
  export function toXQuery(
    q: XBaseDataPagerQuery,
    containsDetail = true,
    enableTracking = false,
    sortBy = 'id',
    isAscending = true
  ) {
    return {
      filter: q.filter,
      containsDetail,
      enableTracking,
      sortBy,
      isAscending,
      page: q.pageNumber,
      pageSize: q.rowsInPage,
    } as XQueryDto;
  }
  
  export function applyToDataPagerQueryResult<T>(
    result: Observable<XQueryResultDto<T>>
  ) {
    return result.pipe(
      map((queryResult) => {
        return {
          count: queryResult.totalItems || 0,
          items: queryResult.items || [],
        } as XBaseDataPagerQueryResult<T>;
      })
    );
  }
  