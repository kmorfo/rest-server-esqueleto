const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Rutas de la app
        this.usuariosPath = '/api/usuarios';

        //Conexion con la BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Al iniciar el servidor express se crean las rutas la aplicaciones
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use( this.usuariosPath, require('../routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
