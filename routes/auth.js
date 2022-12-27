const { Router } = require("express");
const { check } = require("express-validator");
const { login, renewToken,googleSignIn } = require("../controllers/auth");
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
router.post(
    "/google",
    [
        check("id_token", "El id_token es necesario").not().isEmpty(),
        validarCampos,
    ],
    googleSignIn
);
//Renovar el JWT validarJWT 
router.get('/renew',validarJWT,renewToken);

module.exports = router;
