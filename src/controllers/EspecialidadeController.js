const { insertEspecialidade } = require('../models/EspecialidadeModel');

const EspecialidadeController = {
    adicionarEspecialidade: async (req, res) => {
        try {
            const { descEspecialidade } = req.body;

            const especialidadeId = await insertEspecialidade(descEspecialidade);

            return res.json({ message: 'Especialidade inserida com sucesso.', id: especialidadeId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = EspecialidadeController;
