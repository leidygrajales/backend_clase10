// comunicacion del lado del cliente
const socket = io();

// 3. armamos la funcion render
function renderMessages(data) {
  const htmlMessages = data.map(item => {
    return (`
      <tr>
        <td scope="row">${item.author}</td>
        <td scope="row">${item.text}</td>
        <td scope="row"><small>${item.now}</small></td>
      </tr>
    `)
  }).join(' ')

  document.getElementById('message-list').innerHTML = htmlMessages
}

const renderProducts = (data) => {
  const htmlProducts = data.map(product => `
    <tr class="align-middle">
      <td scope="row">${product.id}</td>
      <td scope="row">${product.title}</td>
      <td scope="row">${product.price}</td>
      <td scope="row">
        <img src="${product.thumbnail}" width=50 />
      </td>
    </tr>
  `).join(' ')

  document.getElementById('product-list').innerHTML = htmlProducts
}

function alerMsj(data) {
  // renderizamos la data en el div de la plantilla HTML
  document.getElementById('toastmsg').insertAdjacentHTML('beforeend', `
            <div id="newMessageToast${data.length}" name="newMessageToast${data.length}" class="toast bottom-0 end-0 text-bg-primary border-0"
              role="alert"
              aria-live="assertive"
              aria-atomic="true">
              <div class="d-flex">
                <div class="toast-body">
                  Nuevo mensaje de:  ${data[data.length - 1].author}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
              </div>
            </div>
            `)

  new bootstrap.Toast($(`#newMessageToast${data.length}`), {
    animation: true,
    autohide: true,
    delay: 2000
  }).show()
}

//4.  funcion que se ejecuta cuando doy al btn enviar
function addMessage() {
  const authorName = document.getElementById('author').value
  const today = new Date();
  const now = today.toLocaleString();
  const textMsn = document.getElementById('text').value

  document.getElementById('text').value = ''
  const mensaje = {
    author: authorName,
    now: now,
    text: textMsn
  }

  //enviamos la data al server
  socket.emit('new-message', mensaje)
  return false
}

const addProduct = () => {
  const title = document.getElementById('title').value
  const price = document.getElementById('price').value
  const thumbnail = document.getElementById('thumbnail').value

  document.getElementById('title').value = ''
  document.getElementById('price').value = ''
  document.getElementById('thumbnail').value = ''

  const product = {
    title,
    price,
    thumbnail
  }

  socket.emit('new-product', product)
  return false
}

//2.eventos para enviar (emit ) y recibir con (on) mensajes
socket.on('messages', data => {
  renderMessages(data)

  if (data.length > 0) {
    alerMsj(data)
  }
})

socket.on('products', data => {
  renderProducts(data)
})