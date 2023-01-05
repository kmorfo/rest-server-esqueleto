const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    //Relacion con el User
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    //Relacion con la categoria
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
});

ProductoSchema.methods.toJSON = function () {
    //...object son las demas propiedades
    const { __v, estado, ...object } = this.toObject();
    return object;
};

module.exports = model("Producto", ProductoSchema);
