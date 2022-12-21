const { Router } = require("express");
const { check } = require("express-validator");

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
} = require("../controllers/users");

const {
    isValidRole,
    existEmail,
    existUserID,
} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", usuariosGet);
//Al enviar parametros requeridos en el put se le nombra para poder obtenerlos facilmente en el controlador
//la ruta put / no sera válida, ya que es necesario enviar parametros
//ruta,[middleware], controller, en caso de que no tenga middleware el 2 arg es el controlador
router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existUserID),
        check("role").custom(isValidRole), //De esta forma se tendria que enviar un rol valido
        validarCampos,
    ],
    usuariosPut
);

router.post(
    "/",
    [
        check("email", "El email no es valido").isEmail(),
        check("email").custom(existEmail),
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check(
            "password",
            "El password debe de contener mas de 6 caracteres"
        ).isLength({ min: 6 }),
        // check("role", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]), //Valida en duro
        //Valida contra la colección Roles de la BD
        check("role").custom(isValidRole),
        validarCampos,
    ],
    usuariosPost
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existUserID),
        validarCampos,
    ],
    usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
