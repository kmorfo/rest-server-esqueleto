const { Router } = require("express");
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
} = require("../controllers/users");

const router = Router();

router.get("/", usuariosGet);
//Al enviar parametros requeridos en el put se le nombra para poder obtenerlos facilmente en el controlador
//la ruta put / no sera válida, ya que es necesario enviar parametros
router.put("/:id", usuariosPut);
router.post("/", usuariosPost);
router.delete("/", usuariosDelete);
router.patch("/", usuariosPatch);

module.exports = router;
