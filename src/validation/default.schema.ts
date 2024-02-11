import joi from 'joi';

/**
 * Default file validation schema
 * */
const file = joi.object({
  name: joi
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9_\-]+$/)
    .message('Invalid name format')
    .required(),
  payload: joi.object().required(),
});

const defaultSchemas = {
  file,
};

export default defaultSchemas;
