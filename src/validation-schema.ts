import Joi from '@hapi/joi'

const schema = Joi.object().keys({
  channel: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  show: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  synopsis: Joi.string().allow(''),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  season: Joi.number(),
  episode: Joi.number(),
  numberOfEpisodes: Joi.number(),
  genre: Joi.string(),
  frequency: Joi.string(),
})

export default schema
