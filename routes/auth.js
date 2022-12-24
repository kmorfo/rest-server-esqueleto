const { Router } = require("express");
const { check } = require("express-validator");
const { login, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt.js");

const router = Router();

router.post(
    "/login",
    [
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    login
);
//Renovar el JWT validarJWT 
router.get('/renew',validarJWT,renewToken);

module.exports = router;
