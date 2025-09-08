const PRICE = 2.50;
let credit = 0;
let selectedDrink = null;

const fmtBRL = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const display  = $('#display');
const message  = $('#message');
const tray     = $('#tray');
const selectedText = $('#selected');

function setMessage(text, tone="info"){
  message.textContent = text;
  message.style.color = tone === "ok" ? "#9effcb" :
                        tone === "warn" ? "#ffd8a6" : "#cfe";
}

function updateDisplay(){
   display.textContent = `R$ ${credit.toFixed(2).replace('.',',')}`;
}

const buttons = $$('.drink-btn');
buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDrink = btn.dataset.drink;
    selectedText.textContent = `Selecionado: ${selectedDrink}`;
    setMessage(`"${selectedDrink}" selecionado. Faltam ${fmtBRL(Math.max(0, PRICE - credit))}.`);
  });
});

$$('.coin').forEach(coin=>{
  coin.addEventListener('dragstart', e=>{
    e.dataTransfer.setData('text/plain', coin.dataset.val);
  });
  coin.addEventListener('click', ()=>{
    const val = parseFloat(coin.dataset.val);
    credit = +(credit + val).toFixed(2);
    updateDisplay();
    if(credit >= PRICE){
      setMessage('Crédito suficiente. Clique em "Liberar Bebida".', 'ok');
    } else {
      setMessage(`Moeda aceita. Faltam ${fmtBRL(PRICE - credit)}.`);
    }
  });
});

const drop = $('#drop');
['dragenter','dragover'].forEach(evt=>{
  drop.addEventListener(evt, e=>{
    e.preventDefault();
    drop.classList.add('over');
  });
});
['dragleave','drop'].forEach(evt=>{
  drop.addEventListener(evt, e=>{
    drop.classList.remove('over');
  });
});

drop.addEventListener('drop', e=>{
  e.preventDefault();
  const val = parseFloat(e.dataTransfer.getData('text/plain')||'0');
  if(!val) return;
  credit = +(credit + val).toFixed(2);
  updateDisplay();
  if(credit >= PRICE){
    setMessage('Crédito suficiente. Clique em "Liberar Bebida".', 'ok');
  }else{
    setMessage(`Moeda aceita. Faltam ${fmtBRL(PRICE - credit)}.`);
  }
});

$('#buyBtn').addEventListener('click', ()=>{
  if(!selectedDrink){ setMessage('Escolha um refrigerante primeiro.', 'warn'); return; }
  if(credit < PRICE){ setMessage(`Crédito insuficiente. Faltam ${fmtBRL(PRICE - credit)}.`, 'warn'); return; }

  tray.textContent = `Refrigerante "${selectedDrink}" liberado!`;
  const change = +(credit - PRICE).toFixed(2);
  if(change > 0){
    setMessage(`Refrigerante ${selectedDrink} liberado. Troco: ${fmtBRL(change)}.`, 'ok');
  }else{
    setMessage(`Refrigerante ${selectedDrink} liberado.`, 'ok');
  }
  credit = 0;
  updateDisplay();
});
