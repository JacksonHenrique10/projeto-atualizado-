const { insertLoginProfile, selectLogin_PessoaId, updateLogin,deleteLogin } = require('../models/LoginModel');

const LoginController = {

    adicionarLogin: async (req, res) => {
        try {
            const { pessoaId, login, senha, perfil } = req.body;
            console.log("Valor de pessoaId:", pessoaId);

            const result = await insertLoginProfile(login, senha, pessoaId, perfil);

            return res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    },

    consultarLogin: async (req, res) => {
        try {
            const { pessoaId } = req.params;
            const result = await selectLogin_PessoaId(pessoaId);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    },
    atualizarLogin: async (req, res) => {
        try {
            const { loginId, login, senha, perfil } = req.body;
            console.log("Valor de loginId:", loginId);

            const result = await updateLogin(loginId, login, senha, perfil);

            return res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    },
    deletarLogin: async (req, res) => {
        try {
            const { loginId } = req.params; // Alterado para req.params para pegar o parâmetro da URL
            console.log("Valor de loginId:", loginId);

            const result = await deleteLogin(loginId);

            return res.json(result);
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    }
}


module.exports = LoginController;