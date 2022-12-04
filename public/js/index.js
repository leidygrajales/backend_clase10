// comunicacion del lado del cliente
const socket = io();

// 3. armamos la funcion render
function render(data) {
  const html = data.map(item => {
    return (`<div> <strong> ${item.author} </strong > / <strong> ${item.now} </strong >: <em> ${item.text} </em> </div > `)
  }).join(' ')

  document.getElementById('message').innerHTML = html
}

function alerMsj(data) {
  // renderizamos la data en el div de la plantilla HTML
  document.getElementById('nameMsj').insertAdjacentHTML('beforeend', `
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

  const mensaje = {
    author: authorName,
    now: now,
    text: textMsn
  }

  document.getElementById('text').value = ''

  //enviamos la data al server
  socket.emit('new-message', mensaje)
  return false
}

//2.eventos para enviar (emit ) y recibir con (on) mensajes
socket.on('message', data => {
  render(data)

  if (data.length > 0) {
    alerMsj(data)
  }
})