import { WebSocketServer, WebSocket } from "ws";
import http from 'node:http'; 
import { database } from "./controladores/database.js";

const server =  http.createServer();

const ws = new WebSocketServer({
    server
});

type ClientData = {
    id: number,
    nome: string
};

const clientList: Map<WebSocket, ClientData> = new Map();

ws.on("connection", (socket: WebSocket)=>{
    socket.on('message', async (pacote: Buffer)=>{
        try {
            const msg: Mensagem = JSON.parse(pacote.toString('utf-8'));
            
            if (msg.id === 'enviar-mensagem') {
                const { autor, message } = msg;

                if (message.length < 1) {
                    return;
                }
                
                const data = database.select("users", { id: autor });

                if (data === undefined) {
                    return;
                }

                clientList.forEach((clientData, socket) => {
                    socket.send(JSON.stringify({
                        id: 'mensagem-recebida',
                        author: data.nome,
                        message,
                        isYou: clientData.id === autor
                    }));
                });

            } else if (msg.id === 'efetuar-login') {
                const { nome, senha } = msg;
                const data = database.select("users", { nome, senha });

                if (data === undefined) {
                    socket.send(JSON.stringify(
                        {
                            id: 'login-response',
                            success: false
                        }
                    ));
                } else {
                    clientList.set(socket, {
                        id: data.id,
                        nome: data.nome
                    });
                    socket.send(JSON.stringify({
                        id: 'login-response',
                        success: true,
                        userId: data.id,
                        userName: data.nome
                    }));

                    const memberList = [...clientList.values()].map(m => m.nome);

                    clientList.forEach((clientData, socket) => {
                        socket.send(JSON.stringify({
                            id: 'mensagem-recebida',
                            isSystem: true,
                            message: `${data.nome} entrou no chat.`,
                            isYou: false
                        }));
                        socket.send(JSON.stringify({
                            id: 'lista-de-membros',
                            members: memberList
                        }));
                    });
                }
            }  else if (msg.id === 'efetuar-cadastro') {
                const { nome, senha } = msg;
                const data = database.select("users", { nome });

                if (data !== undefined) {
                    socket.send(JSON.stringify(
                        {
                            id: 'cadastro-response',
                            success: false
                        }
                    ));
                } else {
                    const userId = database.totalRows("users") + 1;

                    await database.insert("users", {
                        id: userId,
                        nome,
                        senha
                    });

                    socket.send(JSON.stringify({
                        id: 'cadastro-response',
                        success: true,
                        userId: userId,
                        userName: nome
                    }));
                }
            }
        } catch (error) {
            console.error(error);
            socket.close(-1);
        }
    }); 

    socket.on('close',()=>{
        console.log('O caba saiu');

        if (clientList.has(socket)) {
            const clientData = clientList.get(socket) as ClientData;

            const data = database.select("users", { id: clientData.id });

            if (data === undefined) {
                return;
            }
            
            clientList.delete(socket);

            const memberList = [...clientList.values()].map(m => m.nome);

            clientList.forEach((clientData, socket) => {
                socket.send(JSON.stringify({
                    id: 'mensagem-recebida',
                    isSystem: true,
                    message: `${data.nome} saiu do chat.`,
                    isYou: false
                }));
                socket.send(JSON.stringify({
                    id: 'lista-de-membros',
                    members: memberList
                }));
            });
        }
    }); 
}); 

server.listen(8080, ()=>{
    console.log("server run websocket"); 
});