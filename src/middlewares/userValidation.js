const path = require("path");
const bcryptjs = require("bcryptjs");
const db = require("../database/models");
const { check, body } = require("express-validator");
module.exports = {
  validacionesLogin: [
    check("email")
      .notEmpty()
      .withMessage("Escribí tu email")
      .bail()
      .isEmail()
      .withMessage("Escribí el email con el que te registraste"),
    check("password")
      .notEmpty()
      .withMessage("Escribí la contraseña")
      .isLength({ min: 8 })
      .withMessage("La contraseña es inválida"),
      /* .bail()
      .isAlphanumeric()
      .withMessage("La contraseña tiene que contener números y letras"), */
    body("password").custom((value, { req }) => {
      return db.User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (!bcryptjs.compareSync(value, user.Pass)) {
          return Promise.reject();
        }
      }).catch(()=>{return Promise.reject("Email o contraseña inválidos")});
    }),
  ],
  validacionRegistro: [
    check("name").notEmpty().withMessage("Escribir un nombre"),
    check("email")
      .notEmpty()
      .withMessage("Escribir un email")
      .bail()
      .isEmail()
      .withMessage("Escribir un email válido"),
    check("country")
      .notEmpty()
      .withMessage("Elegir un pais")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Elegir un pais"),
    check("password")
      .notEmpty()
      .withMessage("Escribir una contraseña")
      .isLength({ min: 8 })
      .withMessage("La contraseña tiene que ser mínimo de 8 caracteres")
      .bail()
      .isAlphanumeric()
      .withMessage("La contraseña tiene que contener números y letras"),
    check("category").notEmpty().withMessage("El campo no puede quedar vacío, debes elegir una opción"),
  ],
};
