import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const fileFilter =
  (regex = /\.(jpg|jpeg|png|gif|JPG|PNG)$/) =>
  (req, file, callback) => {
    if (!file.originalname.match(regex)) {
      return callback(new Error('Media is not supported'), false);
    }
    callback(null, true);
  };

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}-${uuidv4()}${fileExtName}`);
};
