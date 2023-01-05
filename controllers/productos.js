const { response } = require("express");
const { Producto } = require("../models");

//obtenerProductos - paginado opcional - total - populate(relacion con el user de mongoogse)
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate("user", "name")
            .populate("categoria", "name")
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({ total, productos });
};

//obtenerProducto - populate(relacion con el user de mongoogse){}
const obtenerProducto = async (req, res = response) => {
    const producto = await Producto.findById(req.params.id)
    .populate("user", "name")
    .populate("categoria", "name");
    
    return res.json({ producto });
};

const crearProducto = async (req, res = response) => {
    //Obtenemos los datos del producto del body de la peticion
    const { name, precio, categoria, descripcion, disponible } = req.body;

    // console.log(name, precio, categoria, descripcion, disponible);

    //Comprobamos que no existe ya ese nombre en la BD
    const productoDB = await Producto.findOne({ name });

    if (productoDB)
        return res
            .status(400)
            .json({ msg: `La producto ${productoDB.name} ya existe` });

    //Generar la data a guardar en la BD
    const data = {
        name: name.toUpperCase(),
        user: req.userAuth._id,
        precio,
        categoria,
        descripcion,
        disponible,
    };

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
};

//actualizarProducto - valida no existe
const actualizarProducto = async (req, res = response) => {
    const { estado, user, ...data } = req.body;
    data.name = data.name.toUpperCase();
    data.user = req.userAuth._id;

    const productoPut = await Producto.findByIdAndUpdate(req.params.id, data, {
        new: true,
    });
    res.json(productoPut);
};

//borrarProducto estado:false
const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    //Se cambia el estado a false
    const producto = await Producto.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.json({
        msg: `El estado de la producto con id :${id} se establecio en FALSE`,
        producto,
    });
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
};
