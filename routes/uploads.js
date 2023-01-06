const { Router } = require("express");
const { check } = require("express-validator");
const {
    cargarArchivo,
    updateImage,
    mostrarImagen,
    updateImageCloudDinary
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

/**
 * Rutas para trabajar con las imagenes de CloudDinary
 * NOTA -> se agrega a la ruta cd/ antes de los parametros /api/uploads/cd/coleccion/id
 */
router.put(
    "/cd/:coleccion/:id",
    [
        validarArchivoSubir,
        check("id", "No es un ID válido").isMongoId(),
        //Validacion personalizada que controlara que coleccion este entre las permitidas
        check("coleccion").custom((c) =>
            coleccionesPermitidas(c, ["usuarios", "productos"])
        ),
        validarCampos,
    ],
    updateImageCloudDinary
);


module.exports = router;
