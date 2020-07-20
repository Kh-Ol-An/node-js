const Joi = require("@hapi/joi");

const CreateUserSchema = Joi.object({
    name: Joi.string().min(2).max(20).alphanum().required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "ru", "ua"] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,16}$"))
        .required(),
});

const UpdateUserSchema = Joi.object({
    name: Joi.string().min(2).max(20).alphanum(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "ru", "ua"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,16}$")),
});

const valid = async (schema, data) => {
    const { error } = await schema.validate(data);
    if (error) {
        const message = error.details[0].message;
        throw new Error(message);
    }
};

const validateCreateUserMiddleware = async (req, res, next) => {
    try {
        await valid(CreateUserSchema, req.body);
        next();
    } catch (e) {
        res.status(400).send(e.message);
        return res.end();
    }
};

const validateUpdateUserMiddleware = async (req, res, next) => {
    try {
        await valid(UpdateUserSchema, req.body);
        next();
    } catch (e) {
        res.status(400).send(e.message);
        return res.end();
    }
};

module.exports = {
    validateCreateUserMiddleware,
    validateUpdateUserMiddleware,
};
