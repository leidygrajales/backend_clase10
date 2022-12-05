const express = require('express')
const path = require("path")
const router_productos = require('./routes/router.productos')
const multer = require('multer');
const upload = multer();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require("socket.io");

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080

const Container = require('./container/container.js')
const archivo = new Container('./src/productos.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(upload.array());

app.use('/api/productos', router_productos)
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')))
app.use(express.static(path.join(__dirname, '../public')))

app.set("views", path.join(__dirname, "../public/views"))
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  res.render('index')
})

//conf de socket 
const messages = []

io.on('connection', socket => {

  //historial del chat cuando el nuevo cliente se conecte 
  socket.emit('messages', messages)

  archivo.getAll().then(products => {
    socket.emit('products', products)
  })

  //escuchamos al cliente
  socket.on('new-message', data => {
    messages.push(data)

    //re enviamos por medio de broadcast los msn a todos los clientrs que esten conectados
    socket.emit('messages', messages)
  })

  socket.on('new-product', data => {
    archivo.save(data).then(_ => {
      archivo.getAll().then(products => {
        //re enviamos por medio de broadcast los products a todos los clientrs que esten conectados
        socket.emit('products', products)
      })
    })
  })
})

httpServer.listen(PORT, () => console.log(`servidor corriendo en el puerto ${PORT}`))
