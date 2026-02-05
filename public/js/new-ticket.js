

const currentTicketLbl = document.querySelector('span');
const createTcketBtn = document.querySelector('button');

async function getLastTicket() {
  const lastTicket = await fetch('/api/ticket/last').then(res => res.json());
  currentTicketLbl.innerText = lastTicket;
}

async function createTicket() {
  const newTicket = await fetch('/api/ticket', {
    method: 'POST'
  }).then(resp => resp.json());

  currentTicketLbl.innerText = newTicket.number;
}

createTcketBtn.addEventListener('click', createTicket)

getLastTicket()
