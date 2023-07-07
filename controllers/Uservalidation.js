import joi from "joi";
export const registerValidation = (data) => {
    const registerSchema = joi.object({
        firstName: joi.string().trim().min(4).max(30).required(),
        lastName: joi.string().trim().min(4).max(30).required(),
        userName: joi.string().trim().min(4).max(30).required(),
        email: joi.string().trim().email({ tlds: { allow: false } }).min(5).max(40).required(),
        phone: joi.string().trim().length(10).pattern(/^[0-9]+$/).required(),
        password: joi.string().trim().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirmPassword:joi.ref('password')
    })
    return registerSchema.validate(data);
}

export const loginValidation=(data)=>{
    const loginSchema=joi.object({
        email: joi.string().trim().min(4).max(30).required(),
        password: joi.string().trim().min(5).max(40).required()
    })
    return loginSchema.validate(data);
}



















