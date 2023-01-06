const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Rutas de la app
        this.paths = {
            auth:        "/api/auth",
            buscar:      "/api/buscar",
            categorias:  "/api/categorias",
            productos:   "/api/productos",
            usuarios:    "/api/usuarios",
            uploads:     "/api/uploads",
        };
        // this.usuariosPath = '/api/usuarios';
        // this.authPath     = '/api/auth';

        //Conexion con la BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Al iniciar el servidor express se crean las rutas la aplicaciones
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static("public"));

        //Fileuploads
        this.app.use(
            fileUpload({
                useTempFiles:     true,
                tempFileDir:      "/tmp/",
                createParentPath: true,
            })
        );
    }

    routes() {
        this.app.use(this.paths.auth,      require("../routes/auth"));
        this.app.use(this.paths.buscar,    require("../routes/buscar"));
        this.app.use(this.paths.categorias,require("../routes/categorias"));
        this.app.use(this.paths.productos, require("../routes/productos"));
        this.app.use(this.paths.usuarios,  require("../routes/users"));
        this.app.use(this.paths.uploads,   require("../routes/uploads"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
