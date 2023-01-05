const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
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
});

CategoriaSchema.methods.toJSON = function () {
    //...object son las demas propiedades
    const { __v, estado,...object } = this.toObject();
    return object;
};

module.exports = model("Categoria", CategoriaSchema);
