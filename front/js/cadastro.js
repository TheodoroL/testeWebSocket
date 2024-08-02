import {socket, auth} from "./socket.js";
import { showContainer } from "./container.js";

/**
 * @type {HTMLFormElement}
 */
const cadastroForm = document.querySelector(`.container[data-name="cadastro"] form`);
const cadastroBtnSubmit = cadastroForm.querySelector(`button[type="submit"]`);

let isCadastroRequestSent = false;

export function cadastroResponse(data) {
    if (!isCadastroRequestSent) {
        return;
    }

    const { success, userId, userName } = data;
    
    isCadastroRequestSent = false;

    if (!success) {
        cadastroBtnSubmit.disabled = false;
        cadastroBtnSubmit.setCustomValidity('Este nome já está em uso.');
        cadastroForm.reportValidity();
    } else {
        showContainer('login');
    }
}

cadastroBtnSubmit.addEventListener("click", event => {
    event.preventDefault();

    if (isCadastroRequestSent || cadastroBtnSubmit.disabled) {
        return;
    }

    /**
     * @type {HTMLInputElement}
     */
    const nome = cadastroForm.querySelector(`input[name="nome"]`);
    /**
     * @type {HTMLInputElement}
     */
    const senha = cadastroForm.querySelector(`input[name="senha"]`);

    if (nome.value.length < 4) {
        nome.setCustomValidity('O nome deve conter no mínimo 4 caracteres.');
    } else {
        nome.setCustomValidity('');
    }

    if (senha.value.length < 6) {
        senha.setCustomValidity('A senha deve conter no mínimo 6 caracteres.');
    } else {
        senha.setCustomValidity('');
    }

    if (!cadastroForm.reportValidity()) {
        return;
    }

    cadastroBtnSubmit.disabled = true;
    isCadastroRequestSent = true;
    
    socket.send(JSON.stringify({
        id: 'efetuar-cadastro',
        nome: nome.value,
        senha: senha.value
    }));
});