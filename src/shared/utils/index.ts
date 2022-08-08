import { FindOptions } from 'sequelize';
import { SequelizePaginationDto } from '@app/shared/dtos/sequelize-pagination.dto';

export const RiaUtils = {
  applyPagination: <TAttribute = any>(
    findOptions: FindOptions<TAttribute>,
    paginationDto?: SequelizePaginationDto,
  ) => {
    if (paginationDto && Object.keys(paginationDto).length > 0) {
      const { page, limit } = paginationDto;
      const shiftedPage = page === 0 ? 1 : page;
      const limitValue = limit === 0 ? 1 : limit;
      const offset = (shiftedPage - 1) * limitValue;
      findOptions.limit = isNaN(limit) ? undefined : limitValue;
      findOptions.offset = isNaN(offset) ? undefined : offset;
    }
  },
};

export const parseCookie = (cookie, name) => {
  cookie = ';' + cookie;
  cookie = cookie.split('; ').join(';');
  cookie = cookie.split(' =').join('=');
  cookie = cookie.split(';' + name + '=');
  if (cookie.length < 2) {
    return null;
  } else {
    return decodeURIComponent(cookie[1].split(';')[0]);
  }
};
