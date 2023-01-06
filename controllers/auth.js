const { Router, response, json } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        //Si el usuario no existe lo creamos en la BD
        if (!user) {
            const data = {
                name,
                email,
                password: ":P",
                img,
                google: true,
                role: "USER_ROLE",
            };
            user = new User(data);
            await user.save();
        }
        //Si el usuario ya existe podriamos querer actualizar los datos necesarios

        //Si el usuario tiene un estado en la BD en false se deniega el acceso
        if (!user.estado)
            return res
                .status(401)
                .json({ msg: "Hable con el adminsitrador, usuario bloqueado" });

        //Generamos un JWT propio
        const token = await generarJWT(user.id);

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({
            msg: "El token no se pudo verificar",
        });
    }
};

module.exports = { login, renewToken, googleSignIn };
