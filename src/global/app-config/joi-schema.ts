import Joi from 'joi';

export const JoiSchema = Joi.object({
  server: Joi.object({
    port: Joi.number().positive().greater(1024).required(),
    apiPrefix: Joi.string().required(),
    swagger: Joi.object({
      title: Joi.string().optional(),
      version: Joi.string().required(),
      description: Joi.string().optional(),
      tag: Joi.string().optional(),
      api: Joi.string().optional(),
    }).optional(),
  }),
  sequelizeOptions: Joi.object({
    database: Joi.string().required(),
    dialect: Joi.string()
      .allow('mysql', 'postgres', 'sqlite', 'mariadb', 'mssql')
      .required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    autoLoadModels: Joi.boolean().required(),
    synchronize: Joi.boolean().required(),
    pool: Joi.object({
      min: Joi.number().min(1).optional(),
      max: Joi.number().max(10).optional(),
    }).optional(),
  }),
});
