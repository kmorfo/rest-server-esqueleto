const { Router } = require("express");
const { check } = require("express-validator");
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
} = require("../controllers/categorias");

const { existCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, isAdminRole } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categorias
 */
//Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//Obtener una categoria por id - publico
router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existCategoria),
        validarCampos,
    ],
    obtenerCategoria
);

//Crear categorias - privado - cualquier persona con un token válido
router.post(
    "/",
    [
        validarJWT,
        check("name", "El campo name es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    crearCategoria
);

//Actualizar categoria - privado - cualquier persona con un token válido
router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("name", "El campo name es obligatorio").not().isEmpty(),
        check("id").custom(existCategoria),
        validarCampos,
    ],
    actualizarCategoria
);

//Borrar categoria - privado - admin
router.delete(
    "/:id",
    [
        validarJWT,
        isAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existCategoria),
        validarCampos,
    ],
    borrarCategoria
);

module.exports = router;
