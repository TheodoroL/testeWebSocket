import {socket, auth} from "./socket.js";
import { showContainer } from "./container.js";

/**
 * @type {HTMLFormElement}
 */
const loginForm = document.querySelector(`.container[data-name="login"] form`);
const loginBtnSubmit = loginForm.querySelector(`button[type="submit"]`);

let isLoginRequestSent = false;

export function loginResponse(data) {
    if (!isLoginRequestSent) {
        return;
    }

    const { success, userId, userName } = data;

    isLoginRequestSent = false;

    if (!success) {
        loginBtnSubmit.disabled = false;
        loginBtnSubmit.setCustomValidity('Nome e/ou senha inválidos');
        loginForm.reportValidity();
    } else {
        auth.id = userId;
        auth.nome = userName;
        showContainer('chat');
    }
}

loginBtnSubmit.addEventListener("click", event => {
    event.preventDefault();

    if (isLoginRequestSent || loginBtnSubmit.disabled) {
        return;
    }

    /**
     * @type {HTMLInputElement}
     */
    const nome = loginForm.querySelector(`input[name="nome"]`);
    /**
     * @type {HTMLInputElement}
     */
    const senha = loginForm.querySelector(`input[name="senha"]`);

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

    if (!loginForm.reportValidity()) {
        return;
    }

    loginBtnSubmit.disabled = true;
    isLoginRequestSent = true;
    
    socket.send(JSON.stringify({
        id: 'efetuar-login',
        nome: nome.value,
        senha: senha.value
    }));
});