const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");
const { existEmail } = require("../helpers/db-validators");

const usuariosGet = async (req, res = response) => {
    //Obtenemos los parametros enviados del get, en este caso son opcionales
    //Tambien se puede desectructurar los que necesitemos descartando el resto y permitiendo aplicar valores por defecto
    // const query = req.query;
    // const { nombre = "No name", id = "no id" } = req.query;

    const { limite = 5, desde = 0 } = req.query;

    //Obtiene todos los usuarios
    // const usuarios = await User.find();

    //Limitar los resultados
    // const usuarios = await User.find({ estado: true })
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    //Total de registros de la coleccion
    // const total = await User.countDocuments({ estado: true });

    //Para que se realicen las peticiones de forma sincrona sin esperar que termine la una para realizar la otra
    //Se desectructura la respuesta de las promesas en las variables indicadas
    const [total, usuarios] = await Promise.all([
        User.countDocuments({ estado: true }),
        User.find({ estado: true }).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({ total, usuarios });
};

const usuariosPut = async (req, res = response) => {
    //Extraemos la información enviada por el usuario
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //TODO: Valizar contra BD
    if (password) {
        //Cifrar la contraseña
        const salt = bcryptjs.genSaltSync(); //Se puede indicar el valor deseado, 10 default
        resto.password = bcryptjs.hashSync(password, salt);
    }

    //Se actualizan los datos del usuario
    const usuario = await User.findByIdAndUpdate(id, resto);
    usuario.save();

    res.json(usuario);
};

const usuariosPost = async (req, res = response) => {
    //Obtenemos la información del body utilizando la desectructuracion
    const { name, email, password, role } = req.body;
    //Se crea un nuevo usuario a partir de la informacion recibida
    const user = new User({ name, email, password, role });

    //Cifrar la contraseña
    const salt = bcryptjs.genSaltSync(); //Se puede indicar el valor deseado, 10 default
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en la BD
    user.save();

    res.json({ msg: "post API - Controlador", user });
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    //Lo borramos fisicamente se perderia la integridad referencial si no se hace un cascade
    // const usuario = await User.findByIdAndDelete(id);
    // res.json({ msg: `El usuario con id :${id}se borro correctamente` });

    //Se cambia el estado a false
    const usuario = await User.findByIdAndUpdate(id, { estado: false });
    res.json({
        msg: `El estado del usuario con id :${id}se establecio en FALSE`,
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({ msg: "Patch API - Controlador" });
};
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
};
