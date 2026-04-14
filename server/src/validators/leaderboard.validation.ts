import Joi from "joi";


export const postLeaderBoardValidation = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  score: Joi.number().required()
});

export const getLeaderBoardValidation = Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(5)
});

export const idParamValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
});

export const putLeaderBoardValidation = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    score: Joi.number().required()
});