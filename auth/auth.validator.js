const Joi = require("@hapi/joi");

const LoginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "ru", "ua"] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,16}$"))
        .required(),
});

const valid = async (schema, data) => {
    const { error } = await schema.validate(data);
    if (error) {
        const message = error.details[0].message;
        throw new Error(message);
    }
};

const validateLoginMiddleware = async (req, res, next) => {
    try {
        await valid(LoginSchema, req.body);
        next();
    } catch (e) {
        res.status(400).send(e.message);
        return res.end();
    }
};

module.exports = {
    validateLoginMiddleware,
};
