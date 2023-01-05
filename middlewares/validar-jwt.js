const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validarJWT = async (req = request, res = response, next) => {
    //Obtenemos el valor a validar
    const token = req.header("x-token");
    if (!token)
        return res.status(401).json({ msg: "No hay token en la petición" });

    //Validamos el token, si no es valido se ejecuta el catch
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);

        //Obtener los datos del usuario que corresponde con el uid
        const userAuth = await User.findById(uid);

        //Comprobamos que el usuario existe
        if (!userAuth)
            return res.status(401).json({
                msg: "Token no válido. - Usuario no existe",
            });


        //Se comprueba que el usuario esta activo
        if (!userAuth.estado)
            return res.status(401).json({
                msg: "Token no válido. - Usuario no activo",
            });

        //Si queremos obtener los datos del usuario auth desde el controlador
        req.userAuth = userAuth;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no válido.",
        });
    }
};
module.exports = { validarJWT };
