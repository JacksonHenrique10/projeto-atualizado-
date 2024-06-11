const conectarBancoDeDados = require('../config/db');

async function insertLoginProfile(login, senha, pessoaId, perfil) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        const [resPessoa] = await connection.query('SELECT endereco_id FROM tbl_pessoa WHERE id = ?', [pessoaId]);

        if (resPessoa.length === 0) {
            throw new Error('Pessoa não encontrada.');
        }

        const [resLogin] = await connection.query('INSERT INTO tbl_login (login, senha, pessoa_id, status, pessoa_endereco_id) VALUES (?, ?, ?, ?, ?)',
            [login, senha, pessoaId, 1, resPessoa[0].endereco_id]);

        for (let p of perfil) {
            await connection.query('INSERT INTO tbl_perfis (tipo, login_id, login_pessoa_id, login_pessoa_endereco_id) VALUES (?, ?, ?, ?)',
                [p.tipo, resLogin.insertId, pessoaId, resPessoa[0].endereco_id]);
        }

        await connection.commit();
        console.log('Transação de login e perfil concluída com sucesso.');
        return 'Transação de login e perfil concluída com sucesso.';
    } catch (error) {
        if (error.message === 'Pessoa não encontrada.') {
            console.error('Pessoa não encontrada para o ID:', pessoaId);
            throw new Error('Pessoa não encontrada.');
        } else {
            await connection.rollback();
            console.error(error);
            throw error;
        }
    } finally {
        connection.end();
    }
}

async function selectLogin_PessoaId(pessoaId) {
    const connection = await conectarBancoDeDados();
    try {
        const [results] = await connection.query('SELECT * FROM tbl_login WHERE pessoa_id = ?', [pessoaId]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}



async function updateLogin(loginId, login, senha, perfil) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        // Atualiza os dados do login
        await connection.query('UPDATE tbl_login SET login = ?, senha = ? WHERE id = ?', [login, senha, loginId]);

        // Obter os dados da pessoa associada ao login
        const [resLogin] = await connection.query('SELECT pessoa_id, pessoa_endereco_id FROM tbl_login WHERE id = ?', [loginId]);
        const pessoaId = resLogin[0].pessoa_id;
        const pessoaEnderecoId = resLogin[0].pessoa_endereco_id;

        // Remove perfis existentes
        await connection.query('DELETE FROM tbl_perfis WHERE login_id = ?', [loginId]);

        // Adiciona perfis novos
        for (let p of perfil) {
            await connection.query('INSERT INTO tbl_perfis (tipo, login_id, login_pessoa_id, login_pessoa_endereco_id) VALUES (?, ?, ?, ?)', 
                [p.tipo, loginId, pessoaId, pessoaEnderecoId]);
        }

        await connection.commit();
        console.log('Transação de atualização de login e perfil concluída com sucesso.');
        return 'Transação de atualização de login e perfil concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}

async function deleteLogin(loginId) {
    const connection = await conectarBancoDeDados();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM tbl_perfis WHERE login_id = ?', [loginId]);
        await connection.query('DELETE FROM tbl_login WHERE id = ?', [loginId]);

        await connection.commit();
        console.log('Transação de exclusão de login e perfil concluída com sucesso.');
        return 'Transação de exclusão de login e perfil concluída com sucesso.';
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw error;
    } finally {
        connection.end();
    }
}


module.exports = { insertLoginProfile, selectLogin_PessoaId, updateLogin,deleteLogin }
