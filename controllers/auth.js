const { Router } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
    //Extraemos los datos del body que nos envio el usuario
    const { email, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await User.findOne({ email });

        if (!usuario)
            return res
                .status(400)
                .json({ msg: "Usuario/Pass no validos - email" });
        //Verificar si el usuario esta activo
        if (!usuario.estado)
            return res
                .status(400)
                .json({ msg: "Usuario/Pass no validos - estado:false" });
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword)
            return res
                .status(400)
                .json({ msg: "Usuario/Pass no validos - pass" });

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({ usuario, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hable con el adminsitrador" });
    }
};

//Renovar el Token
const renewToken = async (req, res = response) => {
    try {
        const usuarioAuth = req.usuarioAuth;

        //Generamos un nuevo JWT a partir del UID del usuario
        const token = await generarJWT(usuarioAuth.id);

        // console.log("Obtenidos los datos del usuario", usuarioAuth.email);

        res.status(200).json({
            usuarioAuth,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

module.exports = { login, renewToken };
