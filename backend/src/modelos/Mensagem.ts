type MensagemEnviada = {
    id: 'mensagem-enviada',
    autor: number,
    mensagem: string
};

type EfetuarCadastro = {
    id: 'efetuar-cadastro',
    nome:string, 
    senha: string 
};

type EfetuarLogin = {
    id: 'efetuar-login', 
    nome: string, 
    senha: string
};

type Mensagem = MensagemEnviada | EfetuarCadastro | EfetuarLogin;