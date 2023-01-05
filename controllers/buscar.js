const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Categoria, Producto } = require("../models");
const coleccionesPermitidas = ["usuarios", "productos", "categorias", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
    const isMongoID = ObjectId.isValid(termino); //True si es un id mongo
    if (isMongoID) {
        const user = await User.findById(termino);
        return res.json({
            results: [user ?? "Usuario no encontrado"],
        });
    }

    //Indicamos que no sea case sensitive con regex y q aparezca el temrino, no hace falta que sea completo
    const regex = new RegExp(termino, "i");

    //User.count en vez de find devuelve el conteo de los resultados
    const users = await User.find({
        //Dentro del OR tambien podemos poner varias condiciones name: regex estado:true
        $or: [{ name: regex }, { email: regex }],
        $and: [{ estado: true }],
    });

    return res.json({
        results: [users],
    });
};

const buscarCategorias = async (termino = "", res = response) => {
    const isMongoID = ObjectId.isValid(termino); //True si es un id mongo
    if (isMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: [categoria ?? "categoria no encontrada"],
        });
    }

    //Indicamos que no sea case sensitive con regex y q aparezca el temrino, no hace falta que sea completo
    const regex = new RegExp(termino, "i");

    const categorias = await Categoria.find( {name: regex,estado:true} );

    return res.json({
        results: [categorias],
    });
};

const buscarProductos = async (termino = "", res = response) => {
    const isMongoID = ObjectId.isValid(termino); //True si es un id mongo
    if (isMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','name');
        return res.json({
            results: [producto ?? "Producto no encontrado"],
        });
    }
    const regex = new RegExp(termino, "i");

    const productos = await Producto.find( {name: regex,estado:true} ).populate('categoria','name');

    return res.json({
        results: [productos],
    });
};

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    //Comprobamos que la coleccion requerida por el usuario es permitida
    if (!coleccionesPermitidas.includes(coleccion))
        return res.status(400).json({
            msg: `Las colecciones permidas son ${coleccionesPermitidas}`,
        });

    switch (coleccion) {
        case "usuarios":
            buscarUsuarios(termino, res);
            break;
        case "productos":
            buscarProductos(termino, res);
            break;
        case "categorias":
            buscarCategorias(termino, res);
            break;
        default:
            return res.status(500).json({
                msg: `Coleccion no incluida en las busquedas`,
            });
    }
};

module.exports = {
    buscar,
};
