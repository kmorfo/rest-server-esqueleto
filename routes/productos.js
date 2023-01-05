const { Router } = require("express");
const { check } = require("express-validator");
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require("../controllers/productos");

const { existProducto,existCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, isAdminRole } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/productos
 */
//Obtener todas las productos - publico
router.get("/", obtenerProductos);

//Obtener una producto por id - publico
router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existProducto),
        validarCampos,
    ],
    obtenerProducto
);

//Crear productos - privado - cualquier persona con un token válido
router.post(
    "/",
    [
        validarJWT,
        check("categoria", "No es un ID válido").isMongoId(),
        check("categoria").custom(existCategoria),
        check("name", "El campo name es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    crearProducto
);

//Actualizar producto - privado - cualquier persona con un token válido
router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("name", "El campo name es obligatorio").not().isEmpty(),
        check("id").custom(existProducto),
        check("categoria", "No es un ID válido").isMongoId(),
        check("categoria").custom(existCategoria),
        validarCampos,
    ],
    actualizarProducto
);

//Borrar producto - privado - admin
router.delete(
    "/:id",
    [
        validarJWT,
        isAdminRole,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existProducto),
        validarCampos,
    ],
    borrarProducto
);

module.exports = router;
