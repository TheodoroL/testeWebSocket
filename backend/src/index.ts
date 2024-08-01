import { WebSocketServer, WebSocket } from "ws";
import http from 'node:http'; 

const server =  http.createServer();

const ws = new WebSocketServer({
    server
});

const clientList: Set<WebSocket> = new Set();

ws.on("connection", (socket: WebSocket)=>{
    clientList.add(socket); 
    
    socket.on('message', (pacote: Buffer)=>{
        try {
            const msg: Mensagem = JSON.parse(pacote.toString('utf-8'));
            
            if (msg.id === 'mensagem-enviada') {
                const { autor, mensagem } = msg;
                console.log(autor, mensagem);
            }
        } catch (error) {
            console.error(error);
            socket.close(-1);
        }
    }); 

    socket.on('close',()=>{
        console.log('O caba saiu');
        clientList.delete(socket);
    }); 
}); 

server.listen(8080, ()=>{
    console.log("server run websocket"); 
}); 