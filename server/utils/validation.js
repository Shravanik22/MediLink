const Joi = require('joi');

const validateMedicine = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2),
        genericName: Joi.string().required(),
        price: Joi.number().required().min(0),
        stockQuantity: Joi.number().required().min(0),
        category: Joi.string(),
        expiryDate: Joi.date(),
        prescriptionRequired: Joi.boolean(),
    });

    return schema.validate(data);
};

module.exports = { validateMedicine };
