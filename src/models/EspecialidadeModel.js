const conectarBancoDeDados = require('../config/db');

async function insertEspecialidade(descEspecialidade) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resEspecialidade] = await connection.query(
            'INSERT INTO tbl_especialidade (desc_especialidade) VALUES (?)', 
            [descEspecialidade]
        );

        await connection.commit();
        console.log('Especialidade inserida com sucesso.');
        return resEspecialidade.insertId;
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}



module.exports = { insertEspecialidade };
