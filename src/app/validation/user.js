import Joi from 'joi';
export default {
    // POST /create
    update: {
        body: {
            params: {
                email:Joi.string().email({ minDomainAtoms: 2 }).required(),
                password: Joi.string().required(),
                // lastName: Joi.string().required()
            }
        }
    },
};