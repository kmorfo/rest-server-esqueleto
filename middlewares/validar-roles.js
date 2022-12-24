const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
    //Comprobamos que tenemos los datos del usuario
    if (!req.usuarioAuth)
        return res
            .status(500)
            .json({ msg: "Se quiere verificar el rol sin validar el token" });
    //Obtenemos los datos del usuario
    const { role, name } = req.usuarioAuth;

    if (role != "ADMIN_ROLE")
        return res.status(401).json({
            msg: `${name} no es administrador - No tiene permiso para realizar la acción.`,
        });

    next();
};

/**
 * Comprueba que el usuario que tenemos previamente en req tiene uno de los roles que se enviaron por parametros
 * @param  {...any} roles 
 * @returns 
 */
const hasRole = (...roles) => {
    return (req, res, next) => {
        //Comprobamos que tenemos los datos del usuario
        if (!req.usuarioAuth)
            return res.status(500).json({
                msg: "Se quiere verificar el rol sin validar el token",
            });
        //Obtenemos los datos del usuario
        const { role, name } = req.usuarioAuth;

        //se comprueba que el usuario tiene uno de los roles requeridos
        if (!roles.includes(role))
            return res.status(401).json({
                msg: `El usuario${name} debe tener uno de los siguientes roles: ${roles}`,
            });

        next();
    };
};

module.exports = { isAdminRole, hasRole };
