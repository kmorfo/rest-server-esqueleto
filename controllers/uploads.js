const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { User, Producto } = require("../models");

//Importación y config para trabajar con cloudDinary
const cloudDinary = require("cloudinary").v2;
cloudDinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req, res = response) => {
    try {
        //Si queremos que se cree la carpeta destino en caso de que no exista se habilita en la config del server createParentPath: true,
        // const filename = await subirArchivo(req.files, ["txt", "md"],'textos');
        //Imagenes, podriamos enviar las extensiones validas [] y la subcarpeta donde se almacenara
        const filename = await subirArchivo(req.files, undefined, "imgs");
        res.json({ filename });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const updateImage = async (req, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await User.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el usuario con el id${id}` });

            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el producto con el id${id}` });

            break;
        default:
            return res.status(500).json({ msg: "No se incluyó la colección" });
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(
                __dirname,
                "../uploads",
                coleccion,
                modelo.img
            );
            if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
        }
    } catch (err) {
        res.status(400).json({ error });
    }

    //En caso de no enviar el archivo se controla la excepcion
    try {
        modelo.img = await subirArchivo(req.files, undefined, coleccion);
        await modelo.save();

        res.json({ modelo });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const mostrarImagen = async (req, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await User.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el usuario con el id${id}` });

            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el producto con el id${id}` });

            break;
        default:
            return res.status(500).json({ msg: "No se incluyó la colección" });
    }

    try {
        //Obtenemos la direccion de la imagen
        if (modelo.img) {
            const pathImagen = path.join(
                __dirname,
                "../uploads",
                coleccion,
                modelo.img
            );
            if (fs.existsSync(pathImagen)) return res.sendFile(pathImagen);
        }
    } catch (err) {
        res.status(400).json({ error });
    }

    const pathImagen = path.join(__dirname, "../assets", "no-image.jpg");
    res.sendFile(pathImagen);
};

/**
 * Funciones para trabajar con las imagenes de CloudDinary
 */
const updateImageCloudDinary = async (req, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;
    switch (coleccion) {
        case "usuarios":
            modelo = await User.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el usuario con el id${id}` });

            break;
        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo)
                return res
                    .status(400)
                    .json({ msg: `No existe el producto con el id${id}` });

            break;
        default:
            return res.status(500).json({ msg: "No se incluyó la colección" });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        //Obtenemos el nombre de la imagen, sin la ruta ni extension
        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");
        cloudDinary.uploader.destroy(public_id);//Se borra
    }

    //Obtenemos el path temporal del archivo para subirlo
    const { tempFilePath } = req.files.archivo;
    //Subimos el archivo a CloudDinary
    const { secure_url } = await cloudDinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json({ modelo });
};

module.exports = {
    cargarArchivo,
    updateImage,
    mostrarImagen,
    updateImageCloudDinary,
};
