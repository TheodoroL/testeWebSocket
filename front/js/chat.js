import { auth, socket } from "./socket.js";

const messageList = document.querySelector(`.container[data-name=chat] .chat .messages`);
const chatFooter = document.querySelector(`.container[data-name=chat] .chat .footer`);
const chatBtnSendMessage = chatFooter.querySelector('button[id="enviar"]');
const chatInputMessage = chatFooter.querySelector('input[name="texto"]');

export function mensagemRecebida(data) {
    const { message, author, isYou, isSystem } = data;

    const messageContainer = document.createElement("div");
    messageContainer.className = `message-container ${isYou ? 'you' : isSystem ? 'system' : ''}`;

    const messageElement = document.createElement("div");
    messageElement.className = "message";

    messageContainer.append(messageElement);

    if (!isYou && !isSystem) {
        const authorElement = document.createElement("span");
        authorElement.className = "author";
        authorElement.textContent = author;

        messageElement.append(authorElement);
    }

    const textElement = document.createElement("span");
    textElement.className = "text";
    textElement.textContent = message;

    messageContainer.dataset.timestamp = Date.now();

    messageElement.append(textElement);
    messageList.append(messageContainer);

    messageList.scrollTop = messageList.scrollHeight;

    if (messageList.childElementCount > 50) {
        const children = Array.from(messageList.children);

        children.sort((a, b) => {
            const timestampA = Number(a.dataset.timestamp);
            const timestampB = Number(b.dataset.timestamp);
            return timestampA - timestampB;
        });

        for (let i=0; i<10; i++) {
            children.shift().remove();
        }
    }
}

const sendMessage = () => {
    if (auth.id === 0) {
        showContainer("login");
        return;
    }

    const message = chatInputMessage.value
    chatInputMessage.value = "";

    socket.send(JSON.stringify({
        id: 'enviar-mensagem',
        autor: auth.id,
        message
    }));
}

chatBtnSendMessage.addEventListener("click", () => {
    sendMessage();
});

chatInputMessage.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
})