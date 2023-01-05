const { response } = require("express");
const { Categoria } = require("../models");

//obtenerCategorias - paginado opcional - total - populate(relacion con el user de mongoogse)
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({ estado: true }),
        Categoria.find({ estado: true })
            .populate("user", "name")
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({ total, categorias });
};

//obtenerCategoria - populate(relacion con el user de mongoogse){}
const obtenerCategoria = async (req, res = response) => {
    const categoria = await Categoria.findById(req.params.id).populate(
        "user",
        "name"
    );
    return res.json({ categoria });
};

const crearCategoria = async (req, res = response) => {
    //Obtenemos el nombre de la categoria del body de la peticion
    const name = req.body.name.toUpperCase();
    //Comprobamos que no existe ya ese nombre en la BD
    const categoriaDB = await Categoria.findOne({ name });

    if (categoriaDB)
        return res
            .status(400)
            .json({ msg: `La categoria ${categoriaDB.name} ya existe` });

    //Generar la data a guardar en la BD
    const data = {
        name: name.toUpperCase(),
        user: req.userAuth._id,
    };

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
};

//actualizarCategoria - valida no existe
const actualizarCategoria = async (req, res = response) => {
    const { estado, user, ...data } = req.body;
    data.name = data.name.toUpperCase();
    data.user = req.userAuth._id;

    const categoriaPut = await Categoria.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
    );
    res.json(categoriaPut);
};

//borrarCategoria estado:false
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    //Se cambia el estado a false
    const categoria = await Categoria.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.json({
        msg: `El estado de la categoria con id :${id} se establecio en FALSE`,
        categoria,
    });
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
};
