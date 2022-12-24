const jwt = require("jsonwebtoken");

/**
 * Función para crear un token a partir del uid del usuario enviado por parametros
 * @param {string} uid
 * @returns Promise con el token creado
 */
const generarJWT = (uid = "") => {
    return new Promise((resolve, response) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.JWT_KEY,
            { expiresIn: "4h" },
            (error, token) => {
                if (error) {
                    console.log(error);
                    PromiseRejectionEvent("No se pudo generar el token");
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const checkJWT = (token = "") => {
    //Validamos que el token existe y es valido
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);

        return[true,uid];
    } catch (error) {
        return [false,null];
    }
};


module.exports = { generarJWT,checkJWT };
