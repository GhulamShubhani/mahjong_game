import Joi from "joi";

export const startGameValidation = Joi.object({});

export const placeBetValidation = Joi.object({
  gameId: Joi.string().hex().length(24).required(),
  betType: Joi.string().trim().uppercase().valid("HIGHER", "LOWER").required()
});

export const gameIdParamValidation = Joi.object({
  gameId: Joi.string().hex().length(24).required()
});
