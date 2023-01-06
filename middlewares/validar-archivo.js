const { response } = require("express");

const validarArchivoSubir = (req, res = response, next) => {
    //Comprueba si tenemos archivos en la peticion
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo)
        return res.status(400).json({ msg: "No hay archivos que subir - archivo" });

    next();
};

module.exports = {
    validarArchivoSubir,
};
