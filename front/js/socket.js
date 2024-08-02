import { loginResponse } from "./login.js";
import { cadastroResponse } from "./cadastro.js";
import { mensagemRecebida } from "./chat.js";
import { showContainer } from "./container.js";

export const auth = {
    isAuthed: false,
    nome: "",
    id: 0
}

export const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Conexão estabelecida.");
    showContainer("login");
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.id === 'login-response') {
        loginResponse(message);
    } else if (message.id === 'cadastro-response') {
        cadastroResponse(message);
    } else if (message.id === 'mensagem-recebida') {
        mensagemRecebida(message);
    } else if (message.id === 'lista-de-membros') {
        if (auth.id === 0) {
            return;
        }

        const memberList = document.querySelector(`.container[data-name=chat] .member-list .members`);
        memberList.innerHTML = '';
        
        for (const member of message.members) {
            const span = document.createElement("span");
            span.className = "member";
            span.textContent = member;
            memberList.append(span);
        }
    }
};

socket.onerror = (error) => {
    console.error("Erro na conexão WebSocket:", error);
};

socket.onclose = () => {
    console.log("Conexão fechada.");
};