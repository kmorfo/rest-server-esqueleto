const { validationResult } = require("express-validator");

//Se comprueban los posibles errores contra las validaciones inpuestas en las rutas
const validarCampos = (req, res, next) => {
    //Se comprueba el resultado de las validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.mapped() });

    next();
};

module.exports = { validarCampos };
