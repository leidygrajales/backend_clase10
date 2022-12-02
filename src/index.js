const express = require('express')
const path = require("path")
const router_productos = require('./routes/router.productos')
const multer = require('multer');
const upload = multer();
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)

const PORT = 8080

const Container = require('./container/container.js')
const archivo = new Container('./src/productos.json')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(upload.array());

app.use('/api/productos', router_productos)
app.use(express.static(`${__dirname}/public`))

app.set("views", path.join(__dirname, "../public/views"))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/products', async (req, res) => {
    const products = await archivo.getAll()
    const empty = products.length === 0

    res.render('products', { empty, products })
})

const messages = [
    { author: 'pablo', text: 'hola, que tal?' },
    { author: 'marcelo', text: 'muy bien y vos' },
    { author: 'belen', text: 'hola!!' }
]

//conf de socket 
io.on('connection', socket => {
    console.log('nuevo cliente conectado');

    //historial del chat cuando el nuevo cliente se conecte 
    socket.emit('message', messages)

    //escuchamos al cliente
    socket.on('new-message', data => {
        messages.push(data)

        //re enviamos por medio de broadcast los msn a todos los clientrs que esten conectados
        io.sockets.emit('message', messages)

    })
})

app.listen(PORT, () => console.log(`servidor corriendo en el puerto ${PORT}`))
