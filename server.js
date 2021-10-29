const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    console.log('foi chamado o index.html');
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        //aqui faço a tratativa da mensagem que eu quiser
        // console.log(data);
        messages.push(data);

        //o socket tem eventos principais
        //socket.emit: envia msg para o socket daqui => io.on('connection', socket => {

        //socket.on: server para ouvir uma mensagem

        //socket.broadcast.emit: serve para enviar msg para todos os sockets conectados

        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000); 