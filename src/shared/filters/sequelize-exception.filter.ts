import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseError, UniqueConstraintError } from 'sequelize';
import { ForeignKeyConstraintError } from 'sequelize';

@Catch(BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const additionals: any = {};

    if (exception instanceof UniqueConstraintError) {
      additionals.fields = exception.fields;
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.parent.message;
      additionals.code = 'DUPLICATED_ENTRY';
    } else if (exception instanceof ForeignKeyConstraintError) {
      additionals.fields = exception.fields;
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.parent.message;
      additionals.code = 'OTHER_ENTITIES_ARE_STILL_ATTACHED';
    }
    if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) console.log(exception);
    response.status(statusCode).json({
      statusCode,
      message,
      ...additionals,
    });
  }
}

// // NOTE
// /**
//  *
//  * This works with MySQL Version 8.0.5
//  * This also only works when using the custom TypeOrmNamingStrategy in this project
//  */
// @Catch(TypeORMError)
// export class TypeOrmExceptionFilter extends CodedExceptionFilter {
//   catch(exception: TypeORMError, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';
//     const additionals: any = {};

//     if (exception instanceof QueryFailedError) {
//       const driverError = exception.driverError as QueryError;
//       switch (driverError.errno) {
//         case 1062:
//           message = 'Duplciated Entry';
//           statusCode = HttpStatus.BAD_REQUEST;

//           //@ts-ignore
//           const sqlMessage: string = driverError.sqlMessage;

//           const [, value, ixQualified] = sqlMessage.split(
//             /^Duplicate entry \'(.*)\' for key \'(.*)\'$/,
//           );
//           const [entityName, indexName] = ixQualified.split('.');
//           const [, , , ...fields] = indexName.split(/^(.+)_(.+)_/);
//           additionals.entityName = entityName;
//           additionals.fields = fields;
//           additionals.value = value;
//       }
//     } else if (exception instanceof EntityNotFoundError) {
//       return super.catch(
//         new CodedException(
//           'ENTITY_NOT_FOUND',
//           HttpStatus.NOT_FOUND,
//           'Entity not found',
//         ),
//         host,
//       );
//     }

//     if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) console.log(exception);

//     response.status(statusCode).json({
//       statusCode,
//       message,
//       ...additionals,
//     });
//   }
// }
