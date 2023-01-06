const { Categoria, Role, User, Producto } = require("../models");

const isValidRole = async (role = "") => {
    const roleExist = await Role.findOne({ role });
    if (!roleExist)
        throw new Error(`El rol ${role} no está registrado en la BD`);
};

const existEmail = async (email = "") => {
    //Verificar si el correo ya existe
    const userEmail = await User.findOne({ email });
    if (userEmail)
        throw new Error(`El email ${email} ya está registrado en la BD`);
};

const existUserID = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error(`El ID ${id} no existe en la BD.`);
};

const existCategoria = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) throw new Error(`El ID ${id} no existe en la BD.`);
    if (!categoria.estado)
        throw new Error(`La categoria con id: ${id} tiene estado false.`);
};

const existProducto = async (id) => {
    const producto = await Producto.findById(id);
    if (!producto) throw new Error(`El ID ${id} no existe en la BD.`);
    if (!producto.estado)
        throw new Error(`El producto con id: ${id} tiene estado false.`);
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    if (!colecciones.includes(coleccion))
        throw new Error(
            `La colección ${coleccion} no esta permitida o no existe - ${colecciones}`
        );

    return true;
};

module.exports = {
    isValidRole,
    existEmail,
    existUserID,
    existCategoria,
    existProducto,
    coleccionesPermitidas,
};
