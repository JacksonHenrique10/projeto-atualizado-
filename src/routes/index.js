const express = require("express");
const router = express.Router();

const PessoaController = require("../controllers/PessoaController");
const LoginController = require("../controllers/LoginController");
const EspecialidadeController = require("../controllers/EspecialidadeController");

// Rota para adicionar uma pessoa
router.post('/pessoa', PessoaController.adicionarPessoa);

// Rota para adicionar um login
router.post('/login', LoginController.adicionarLogin);

// Rota para adicionar uma especialidade
router.post('/especialidade', EspecialidadeController.adicionarEspecialidade);

router.get('/pessoa/:id', PessoaController.buscarPessoa);

router.put('/pessoa/:id', PessoaController.atualizarPessoa);

router.delete('/pessoa/:id', PessoaController.deletarPessoa);

router.get('/login/:pessoaId', LoginController.consultarLogin);

router.put('/login', LoginController.atualizarLogin); 

router.delete('/login/:loginId', LoginController.deletarLogin);

// Outras rotas
// router.get("/", Controller.index)
// router.get("/cadastro", Controller.cadastro)
// router.get("/listar", Controller.listar);
// router.get('/editar/:id', Controller.editar);
// router.post('/editar/usuario', Controller.salvarEdicao);
// router.get('/:id', Controller.selecionar);
// router.delete('/excluir/:id', Controller.deletarUsuario);

// Rota de erro 404
// router.use(function(req, res){
//     res.status(404).render(`pages/pag_erro`, {message:'404 - Página não encontrada'})
// });

module.exports = router;