const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "USER_ROLE"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

//Se sobrescribe el metodo toJSON de respuesta al usuario al registrarse
//De este modo podemos personalizar la respuesta, asi como quitar elementos que no deseemos que se envien
UserSchema.methods.toJSON = function () {
    //...object son las demas propiedades
    const { __v, password, ...object } = this.toObject();
    return object;
};

module.exports = model("User", UserSchema);
