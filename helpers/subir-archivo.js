const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
    files,
    extensionesValidas = ["png", "jpg", "jpeg", "gif", "svg"],
    carpeta = ""
) => {
    return new Promise((resolve, reject) => {
        //Obtenemos el archivo de la misma forma si admitieramos varios archivos
        //los podriamos procesar igual en un bucle uno a uno
        const { archivo } = files;

        //Obtenemos la extensión
        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validamos la extensión
        if (!extensionesValidas.includes(extension))
            return reject(
                `La extension ${extension} no es valida - ${extensionesValidas}`
            );

        //Creamos un nombre unico atraves de uuid
        const nombreTemp = uuidv4() + "." + extension;

        //Creamos el path donde se subira el archivo
        uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) return reject(err);

            resolve(nombreTemp);
        });
    });
};

module.exports = { subirArchivo };
