class Pessoa {
    constructor({ cpf, nome, data_nasc, genero, email }) {
        this.cpf = cpf;
        this.nome = nome;
        this.data_nasc = data_nasc;
        this.genero = genero;
        this.email = email;
    }

    get Cpf() { return this.cpf }
    set Cpf(value) { this.cpf = value }

    get Nome() { return this.nome }
    set Nome(value) { this.nome = value }

    get DataNasc() { return this.data_nasc }
    set DataNasc(value) { this.data_nasc = value }

    get Genero() { return this.genero }
    set Genero(value) { this.genero = value }

    get Email() { return this.email }
    set Email(value) { this.email = value }

    validarCampos() {

        return (
            this.cpf &&
            this.nome &&
            this.data_nasc &&
            this.genero &&
            this.email
        );
    }

    validaCpf() {
        const cpf = this.cpf.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos
    
        // Verifica se o CPF tem 11 dígitos
        if (cpf.length !== 11) {
            return false;
        }
    
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
    
        // Calcula o primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        let digit1 = remainder === 10 || remainder === 11 ? 0 : remainder;
    
        // Verifica se o primeiro dígito verificador está correto
        if (digit1 !== parseInt(cpf.charAt(9))) {
            return false;
        }
    
        // Calcula o segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        let digit2 = remainder === 10 || remainder === 11 ? 0 : remainder;
    
        // Verifica se o segundo dígito verificador está correto
        if (digit2 !== parseInt(cpf.charAt(10))) {
            return false;
        }
    
        // CPF válido
        return true;
    }
}

module.exports = Pessoa;