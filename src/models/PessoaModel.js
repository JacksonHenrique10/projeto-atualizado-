const conectarBancoDeDados = require('../config/db');

async function insertFuncionario(cliente, endereco, telefones, funcionario) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resEnd] = await connection.query('INSERT INTO tbl_endereco (logradouro, bairro, estado, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?)',
            [endereco.logradouro, endereco.bairro, endereco.estado, endereco.numero, endereco.complemento, endereco.cep]);
        const [resPessoa] = await connection.query('INSERT INTO tbl_pessoa (cpf, nome, data_nasc, genero, email, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, resEnd.insertId]);
        const [resFunc] = await connection.query('INSERT INTO tbl_funcionario (data_admissao, crm, pessoa_id, pessoa_endereco_id) VALUES (?, ?, ?, ?)',
            [funcionario.data_admissao, funcionario.crm, resPessoa.insertId, resEnd.insertId]);

        for (let tel of telefones) {
            const [resTel] = await connection.query('INSERT INTO tbl_telefone (numero) VALUES (?)', [tel.numero]);
            await connection.query('INSERT INTO tbl_pessoa_has_tbl_telefone (pessoa_id, telefone_id, pessoa_tbl_endereco_id) VALUES (?, ?, ?)',
                [resPessoa.insertId, resTel.insertId, resEnd.insertId]);
        }

        await connection.commit();
        console.log('Transação concluída com sucesso.');
        return 'Transação concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}

async function insertPaciente(cliente, endereco, telefones, paciente) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resEnd] = await connection.query('INSERT INTO tbl_endereco (logradouro, bairro, estado, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?)',
            [endereco.logradouro, endereco.bairro, endereco.estado, endereco.numero, endereco.complemento, endereco.cep]);
        const [resPessoa] = await connection.query('INSERT INTO tbl_pessoa (cpf, nome, data_nasc, genero, email, endereco_id) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, resEnd.insertId]);
        const [resPac] = await connection.query('INSERT INTO tbl_paciente (pessoa_id) VALUES (?)', [resPessoa.insertId]);

        for (let tel of telefones) {
            const [resTel] = await connection.query('INSERT INTO tbl_telefone (numero) VALUES (?)', [tel.numero]);
            await connection.query('INSERT INTO tbl_pessoa_has_tbl_telefone (pessoa_id, telefone_id, pessoa_tbl_endereco_id) VALUES (?, ?, ?)',
                [resPessoa.insertId, resTel.insertId, resEnd.insertId]);
        }

        await connection.commit();
        console.log('Transação concluída com sucesso.');
        return 'Transação concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}

async function selectPessoaId(pessoaId) {
    const connection = await conectarBancoDeDados();
    try {
        const [results] = await connection.query('SELECT * FROM tbl_pessoa WHERE id = ?', [pessoaId]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}

async function updatePessoa(id, cliente) {
    const connection = await conectarBancoDeDados();
    try {
        const [result] = await connection.query(
            'UPDATE tbl_pessoa SET cpf = ?, nome = ?, data_nasc = ?, genero = ?, email = ? WHERE id = ?',
            [cliente.cpf, cliente.nome, cliente.data_nasc, cliente.genero, cliente.email, id]
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}



async function deletePessoa(id) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        // Deletar perfis relacionados
        await connection.query(
            'DELETE FROM tbl_perfis WHERE login_id IN (SELECT id FROM tbl_login WHERE pessoa_id = ?)',
            [id]
        );

        // Deletar logins relacionados
        await connection.query(
            'DELETE FROM tbl_login WHERE pessoa_id = ?',
            [id]
        );

        // Deletar telefones relacionados
        await connection.query(
            'DELETE FROM tbl_pessoa_has_tbl_telefone WHERE pessoa_id = ?',
            [id]
        );

        // Deletar funcionário relacionado, se existir
        await connection.query(
            'DELETE FROM tbl_funcionario WHERE pessoa_id = ?',
            [id]
        );

        // Deletar paciente relacionado, se existir
        await connection.query(
            'DELETE FROM tbl_paciente WHERE pessoa_id = ?',
            [id]
        );

        // Buscar endereço associado à pessoa
        const [pessoa] = await connection.query(
            'SELECT endereco_id FROM tbl_pessoa WHERE id = ?',
            [id]
        );

        // Verificar se a pessoa existe
        if (pessoa.length === 0) {
            throw new Error('Pessoa não encontrada.');
        }

        // Deletar a pessoa
        await connection.query(
            'DELETE FROM tbl_pessoa WHERE id = ?',
            [id]
        );

        // Deletar o endereço relacionado
        const enderecoId = pessoa[0].endereco_id;
        await connection.query(
            'DELETE FROM tbl_endereco WHERE id = ?',
            [enderecoId]
        );

        await connection.commit();
        return { message: "Pessoa deletada com sucesso" };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}

module.exports = { insertFuncionario, insertPaciente, selectPessoaId, updatePessoa, deletePessoa };




