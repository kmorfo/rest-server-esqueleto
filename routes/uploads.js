const { Router } = require("express");
const { check } = require("express-validator");
const {
    cargarArchivo,
    updateImage,
    mostrarImagen,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivoSubir } = require("../middlewares");

/**
 * {{url}}/api/uploads
 */
const router = Router();

//cargar un nuevo archivo
router.post("/", validarArchivoSubir, cargarArchivo);

//Actualizar las imagenes del usuario
router.put(
    "/:coleccion/:id",
    [
        validarArchivoSubir,
        check("id", "No es un ID válido").isMongoId(),
        //Validacion personalizada que controlara que coleccion este entre las permitidas
        check("coleccion").custom((c) =>
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    updateImage
);

router.get(
    "/:coleccion/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        //Validacion personalizada que controlara que coleccion este entre las permitidas
        check("coleccion").custom((c) =>
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    mostrarImagen
);

module.exports = router;
