import defaultSchemas from './default.schema';
import { validateBySchema } from '../middleware';
import fileSchemas from './file.schema';

const validator = {
  file: {
    write: validateBySchema(defaultSchemas.file),
    get: validateBySchema(fileSchemas.get, 'query'),
  },
};

export default validator;
