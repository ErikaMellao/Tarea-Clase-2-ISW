"use strict";
import Joi from "joi";

export const userValidation = Joi.object({
    email: Joi.string()
    .pattern(/^[\w.+-]+@gmail\.com$/)
    .min(10)
    .max(50)
    .required()
    .messages({
        "string.pattern.base": "El email debe tener el formato terminar en @gmail.com",
        "string.min": "El email debe tener minimo 10 carácteres",
        "string.max": "El email debe tener máximo 50 carácteres",
        "string.empty": "El email no puede estar vacio",
        "any.required": "El email es obligatorio",
    }),

    password: Joi.string()
    .pattern(/^[0-9a-zA-Z*&#@]+$/)
    .min(5)
    .max(30)
    .required()
    .messages({
        "string.pattern.base":"La contraseña solo puede contener letras, números y carácteres como * # & @",
        "string.min": "La contraseña debe tener minimo 5 carácteres",
        "string.max": "La contraseña debe tener máximo 30 carácteres",
        "string.empty": "La contraseña no puede estar vacía",
        "any.required": "La contraseña es obligatoria",
    }),

});