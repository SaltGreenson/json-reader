import joi from 'joi';

/**
 * Get file validation schema
 * */
const get = joi.object({
  name: joi.string().min(1).max(50).required(),
});

const fileSchema = {
  get,
};

export default fileSchema;
