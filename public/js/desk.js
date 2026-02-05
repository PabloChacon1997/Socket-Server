const deskHeader = document.querySelector('h1');
const lblPending = document.querySelector('#lbl-pending');
const noMoreAlert = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParms = new URLSearchParams(window.location.search)

if (!searchParms.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Escritorio es requerido')
}

const deskNumber = searchParms.get('escritorio');
let workingTicket = null;


deskHeader.innerText = deskNumber;


function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none');
  } else {
    noMoreAlert.classList.toggle('d-none');
  }
  lblPending.innerHTML = currentCount;
}

async function loadInitialCount() {
  const pending = await fetch('/api/ticket/pending').then(resp => resp.json()); 
  checkTicketCount(pending.length);
}

async function getTicket() {
  await finishTicket()
  const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`).then(resp => resp.json())
  if (status === 'error') {
    lblCurrentTicket.innerHTML = message;
    return;
  }

  workingTicket = ticket
  lblCurrentTicket.innerText = ticket.number;
}

async function finishTicket() {
  if(!workingTicket) return;
  const {status, message} = await fetch(`/api/ticket/done/${workingTicket.id}`, {
    method: 'PUT'
  }).then(resp => resp.json())
  if (status === 'ok') {
    workingTicket = null;
    lblCurrentTicket.innerText = 'Nadie';
  }
}


function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = ( event ) => {
    const numberTickets = JSON.parse(event.data);
    if (numberTickets.type !== 'on-ticket-count-change') return;
    checkTicketCount(numberTickets.payload)
  };

  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };




}


btnDraw.addEventListener('click',getTicket )
btnDone.addEventListener('click',finishTicket )
loadInitialCount()
connectToWebSockets();
