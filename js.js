// ---- Estado ----
const PRICE = 2.50;
let credit = 0;
let selectedDrink = null;

// ---- Util ----
const fmt = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const display = document.getElementById('display');
const message = document.getElementById('message');
const tray = document.getElementById('tray');
const selectedText = document.getElementById('selected');

function setMessage(text, tone="info"){
message.textContent = text;
message.style.color = tone === "ok" ? "#9effcb" :
                        tone === "warn" ? "#ffd8a6" : "#cfe";
}
function updateDisplay(){
display.textContent = `R$ ${credit.toFixed(2).replace('.',',')}`;
}

// ---- Seleção de bebida (botões fixos) ----
const buttons = document.querySelectorAll('.drink-btn');
buttons.forEach(btn=>{
btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDrink = btn.dataset.drink;
    selectedText.textContent = `Selecionado: ${selectedDrink}`;
    setMessage(`"${selectedDrink}" selecionado. Precisando de ${fmt(Math.max(0, PRICE - credit))}.`);
});
});

// ---- Drag & Drop de moedas ----
document.querySelectorAll('.coin').forEach(coin=>{
coin.addEventListener('dragstart', e=>{
    e.dataTransfer.setData('text/plain', coin.dataset.val);
});
});

const drop = document.getElementById('drop');
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
    setMessage(`Moeda aceita. Faltam ${fmt(PRICE - credit)}.`);
}
});

// ---- Comprar ----
document.getElementById('buyBtn').addEventListener('click', ()=>{
if(!selectedDrink){
    setMessage('Escolha um refrigerante primeiro.', 'warn');
    return;
}
if(credit < PRICE){
    setMessage(`Crédito insuficiente. Faltam ${fmt(PRICE - credit)}.`, 'warn');
    return;
}
// Libera bebida
tray.textContent = `Refrigerante "${selectedDrink}" liberado!`;
setMessage(`Refrigerante ${selectedDrink} liberado.`, 'ok');

// Troco
const change = +(credit - PRICE).toFixed(2);
if(change > 0){
    setMessage(`Refrigerante ${selectedDrink} liberado. Troco: ${fmt(change)}.`, 'ok');
}

credit = 0;
updateDisplay();
});

// ---- AJAX: lista do Web Service (somente exibe) ----
(async function loadWS(){
const list = document.getElementById('ws-list');
try{
    const resp = await fetch('https://api.jsonbin.io/v3/b/68b9f743d0ea881f4071dd7f');
    if(!resp.ok) throw new Error(resp.statusText);
    const data = await resp.json();
    const items = Array.isArray(data?.record) ? data.record : (data?.record?.items || []);
    list.innerHTML = '';
    (items.length ? items : ['Super Coca','Super Coca Light','Laranjone','Lemonsplash','Água','Água com Gás'])
    .forEach(n=>{
        const li=document.createElement('li'); li.textContent = n; list.appendChild(li);
    });
}catch(e){
    list.innerHTML = '<li style="color:#ffb7b7">Falha ao consultar. Exibindo exemplos.</li>';
    ['Super Coca','Super Coca Light','Laranjone','Lemonsplash','Água','Água com Gás']
    .forEach(n=>{ const li=document.createElement('li'); li.textContent=n; list.appendChild(li); });
}
})();