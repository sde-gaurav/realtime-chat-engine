const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  password: Joi.string().required(),
});

const createChatSchema = Joi.object({
  userId: Joi.string().when('isGroup', {
    is: false,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  isGroup: Joi.boolean().default(false),
  groupName: Joi.string().when('isGroup', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  members: Joi.array().items(Joi.string()).when('isGroup', {
    is: true,
    then: Joi.array().min(2).required(),
    otherwise: Joi.forbidden(),
  }),
});

const sendMessageSchema = Joi.object({
  chatId: Joi.string().required(),
  content: Joi.string().when('type', {
    is: 'text',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  type: Joi.string().valid('text', 'image', 'file').default('text'),
});

module.exports = {
  registerSchema,
  loginSchema,
  createChatSchema,
  sendMessageSchema,
};
