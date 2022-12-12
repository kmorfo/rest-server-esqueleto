const { response } = require("express");

const usuariosGet = (req, res = response) => {
    //Obtenemos los parametros enviados del get, en este caso son opcionales
    //Tambien se puede desectructurar los que necesitemos descartando el resto y permitiendo aplicar valores por defecto
    // const query = req.query;
    const { nombre = "No name", id = "no id" } = req.query;
    res.json({ msg: "get API - Controladorss", nombre, id });
};
const usuariosPut = (req, res = response) => {
    //Extraemos la información enviada por el usuario
    const id = req.params.id;
    res.json({ msg: "put API - Controlador", id });
};
const usuariosPost = (req, res = response) => {
    //Obtenemos la información del body desectructurando la que necesitemos
    const { nombre, edad } = req.body;

    res.json({ msg: "post API - Controlador", nombre, edad });
};

const usuariosPatch = (req, res = response) => {
    res.json({ msg: "Patch API - Controlador" });
};

const usuariosDelete = (req, res = response) => {
    res.json({ msg: "Delete API - Controlador" });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
};
