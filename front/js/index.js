import {showContainer} from "./container.js";

const chat = document.querySelector("#chat");
const texto = document.querySelector("#texto");
const user = document.querySelector("#user");
const button = document.querySelector("#enviar");

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
    console.log("Conexão estabelecida.");
    button.addEventListener("click", () => {
        const userName = user.value.trim();
        const message = texto.value.trim();

        if (userName === "") {
            alert("Por favor, insira seu nome.");
            return;
        }

        if (message !== "") {
            const formattedMessage = `${userName}: ${message}`;
            socket.send(JSON.stringify({
                id: 'mensagem-enviada',
                autor: 0,
                mensagem: formattedMessage
            }));
            texto.value = ""; 
        }
    });
};

socket.onmessage = (event) => {
    const message = event.data;
    chat.innerHTML += `<p>${message}</p>`;
};

socket.onerror = (error) => {
    console.error("Erro na conexão WebSocket:", error);
};

socket.onclose = () => {
    console.log("Conexão fechada.");
};