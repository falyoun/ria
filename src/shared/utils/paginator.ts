import { FindOptions } from 'sequelize';
import { SequelizePaginationDto } from '../dtos';

export const applyPagination = <TAttribute = any>(
  findOptions: FindOptions<TAttribute>,
  paginationDto?: SequelizePaginationDto,
) => {
  if (paginationDto && Object.keys(paginationDto).length > 0) {
    const { page, limit } = paginationDto;
    const shiftedPage = page === 0 ? 1 : page;
    const limitValue = limit === 0 ? 1 : limit;
    const offset = (shiftedPage - 1) * limitValue;
    console.log({ offset, limitValue });
    findOptions.limit = isNaN(limit) ? undefined : limitValue;
    findOptions.offset = isNaN(offset) ? undefined : offset;
  }
};
