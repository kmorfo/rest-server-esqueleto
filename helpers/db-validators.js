const Role = require("../models/role");
const User = require("../models/user");

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
    const user = await User.findById( id );
    if (!user)
        throw new Error(`El ID ${id} no existe en la BD.`);
};

module.exports = {
    isValidRole,
    existEmail,
    existUserID
};
