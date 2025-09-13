const API_URL = 'https://api.jsonbin.io/v3/b/68b9f743d0ea881f4071dd7f';
const DEFAULT_PRICE = 2.50;

let credit = 0;
let selectedDrink = null;

const fmtBRL = v => Number(v||0).toLocaleString('pt-BR',{ style:'currency', currency:'BRL' });
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const display      = $('#display');
const message      = $('#message');
const tray         = $('#tray');
const selectedText = $('#selected');
const shelfEl      = $('#shelf');
const buttonsEl    = $('#buttons');

function setMessage(text, tone="info"){
  message.textContent = text;
  message.className = "msg " + tone;
}
function updateDisplay(){ 
  display.textContent = fmtBRL(credit); 
}
function addCredit(val){
  if(!val) return;
  credit = +(credit + val).toFixed(2);
  updateDisplay();
  if(selectedDrink){
    if(credit >= selectedDrink.price) setMessage('Crédito suficiente. Clique em "Liberar Bebida".','ok');
    else setMessage(`Moeda aceita. Faltam ${fmtBRL(selectedDrink.price - credit)}.`,'info');
  }else setMessage('Crédito adicionado. Selecione uma bebida.','info');
}

function sanitizeNameToFile(name){
  return `img/${String(name)
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .toLowerCase().replace(/\s+/g,'_')
    .replace(/[^a-z0-9_-]/g,'')
  }.png`;
}
function createShelfImage(name){
  const img = document.createElement('img');
  img.className = 'shelf-item';
  img.alt = name;
  img.dataset.drink = name;
  img.src = sanitizeNameToFile(name);
  img.onerror = () => { img.onerror = null; img.src = 'img/generico.png'; };
  return img;
}

function selectDrink(drink){
  selectedDrink = drink;
  $$('#buttons .drink-btn').forEach(b => b.classList.toggle('selected', b.dataset.drink === drink.name));
  selectedText.textContent = `Selecionado: ${drink.name} • ${fmtBRL(drink.price)}`;
  const falta = Math.max(0, drink.price - credit);
  setMessage(`"${drink.name}" selecionado. ${falta>0 ? `Faltam ${fmtBRL(falta)}.` : 'Pronto para liberar.'}`, falta>0?'info':'ok');
}

function renderEmpty(reasonText = 'Não foi possível conectar à base de dados.'){
  buttonsEl.innerHTML = '';
  shelfEl.innerHTML   = '';
  const liError = document.createElement('li');
  liError.textContent = reasonText;
  console.warn('[Máquina] Sem dados de bebidas.', reasonText);
}

function renderUI(drinks){
  buttonsEl.innerHTML = '';
  drinks.forEach(d=>{
    const btn = document.createElement('button');
    btn.className = 'drink-btn';
    btn.dataset.drink = d.name;

    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = fmtBRL(d.price);

    const label = document.createTextNode(`🥤 ${d.name}`);

    btn.appendChild(pill);
    btn.appendChild(label);

    btn.addEventListener('click', ()=> selectDrink(d));
    buttonsEl.appendChild(btn);
  });

  shelfEl.innerHTML = '';
  drinks.forEach(d=>{
    const img = createShelfImage(d.name);
    img.addEventListener('click', ()=> selectDrink(d));
    shelfEl.appendChild(img);
  });
}

function normalizeData(data){
  const arr = data?.record?.bebidas ?? data?.bebidas;
  if (!Array.isArray(arr)) return [];
  return arr.map(item=>{
    const name  = (item?.sabor ?? '').toString().trim();
    const price = Number(item?.preco);
    if (!name) return null;
    return { name, price: Number.isFinite(price) ? price : DEFAULT_PRICE };
  }).filter(Boolean);
}

$$('.coin').forEach(coin=>{
  coin.addEventListener('dragstart', e=>{
    e.dataTransfer.setData('text/plain', coin.dataset.val);
  });
  coin.addEventListener('click', ()=>{
    addCredit(parseFloat(coin.dataset.val));
  });
});

const drop = $('#drop');

['dragenter','dragover'].forEach(evt=>{
  drop.addEventListener(evt, e=>{ e.preventDefault(); drop.classList.add('over'); });
});

['dragleave','drop'].forEach(evt=>{
  drop.addEventListener(evt, ()=> drop.classList.remove('over'));
});

drop.addEventListener('drop', e=>{
  e.preventDefault();
  addCredit(parseFloat(e.dataTransfer.getData('text/plain')||'0'));
});

$('#buyBtn').addEventListener('click', ()=>{
  if(!selectedDrink){ 
    setMessage('Escolha um refrigerante primeiro.','warn'); 
    return; 
  }
  const price = selectedDrink.price ?? DEFAULT_PRICE;
  if(credit < price){ 
    setMessage(`Crédito insuficiente. Faltam ${fmtBRL(price - credit)}.`,'warn'); 
    return; 
  }
  tray.textContent = `Refrigerante "${selectedDrink.name}" liberado!`;
  const change = +(credit - price).toFixed(2);
  setMessage(`Refrigerante ${selectedDrink.name} liberado.${change>0?` Troco: ${fmtBRL(change)}.`:''}`,'ok');
  credit = 0; updateDisplay();
});

(async function init(){
  updateDisplay();
  try{
    const resp = await fetch(API_URL, { cache:'no-store' });
    if(!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    const drinks = normalizeData(data);
    if(drinks.length){ renderUI(drinks); }
    else { renderEmpty('A base de dados retornou vazia.'); }
  }catch(e){
    renderEmpty('Não foi possível conectar à base de dados.');
  }
})();
