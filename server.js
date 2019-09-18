// Importa o Express
const express = require('express');

// Importa o path
const path = require('path');

// Cria o App do Express
const app = express();

// Define o protocolo HTTP
const server = require('http').createServer(app);

// Define o protocolo WSS
const io = require('socket.io')(server);

// Define a pasta onde ficarão os arquivos públicos (front end)
app.use(express.static(path.join(__dirname, 'public')));

// Define o local onde ficarão as views
app.set('views', path.join(__dirname, 'public'));

// Define que as views serão HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Quando acessar a raíz, renderizar a view Html
app.use('/', (req, res) => {
    res.render('index.html');
});

// Cria um array com as mensagens
let messages = [];

// Quando um client se conectar
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    // Envia uma mensagem ao socket
    socket.emit('previousMessages', messages);

    // Ao executar a função no Front-end, recebemos no Back-end pra tratar da maneira que quisermos
    socket.on('sendMessage', data => {
        // Envia a informação pro array messages
        messages.push(data);
        
        // Envia para todos os sockets
        socket.broadcast.emit('receivedMessage', data);
    });
});

// Ouvir a porta 3000
server.listen(3000);