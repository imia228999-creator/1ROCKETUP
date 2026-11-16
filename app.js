const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }
const products = [
 {id:1,name:"Ледяная звезда",icon:"❄️",rarity:"rare",label:"Редкий",desc:"Северная коллекция"},
 {id:2,name:"Синий кристалл",icon:"💎",rarity:"epic",label:"Эпический",desc:"Кристальная серия"},
 {id:3,name:"Космический кот",icon:"🐱",rarity:"legend",label:"Легендарный",desc:"Галактическая серия"},
 {id:4,name:"Неоновая комета",icon:"☄️",rarity:"rare",label:"Редкий",desc:"Космическая серия"},
 {id:5,name:"Облачный талисман",icon:"☁️",rarity:"epic",label:"Эпический",desc:"Небесная коллекция"},
 {id:6,name:"Золотой спутник",icon:"🪐",rarity:"legend",label:"Легендарный",desc:"Орбитальная серия"}
];
let inventory = [];
let activeFilter = "all";
const $ = s => document.querySelector(s);
function itemCard(p, owned=false){return `<article class="item"><div class="item-art">${p.icon}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="item-foot"><span class="rarity">${p.label}</span>${owned?'<span class="rarity">В коллекции</span>':`<button class="add" data-add="${p.id}">Добавить</button>`}</div></article>`}
function render(){
 $("#featured").innerHTML=products.slice(0,4).map(p=>itemCard(p)).join("");
 const q=($("#search")?.value||"").toLowerCase();
 $("#catalogItems").innerHTML=products.filter(p=>(activeFilter==="all"||p.rarity===activeFilter)&&p.name.toLowerCase().includes(q)).map(p=>itemCard(p)).join("");
 $("#inventoryItems").innerHTML=inventory.map(p=>itemCard(p,true)).join("");
 $("#itemCount").textContent=inventory.length; $("#profileCount").textContent=inventory.length;
 $("#emptyInventory").style.display=inventory.length?"none":"block";
}
function showTab(tab){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===tab));
 document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 if(tab==="profile") showProfile();
 window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
 const tab=e.target.closest("[data-tab]"); if(tab) showTab(tab.dataset.tab);
 const add=e.target.closest("[data-add]"); if(add){const p=products.find(x=>x.id===Number(add.dataset.add));if(p&&!inventory.some(x=>x.id===p.id)){inventory.push(p);render();if(tg?.showToast)tg.showToast("Предмет добавлен в инвентарь");}}
 const filter=e.target.closest("[data-filter]");if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("selected",b===filter));render();}
});
$("#search").addEventListener("input",render);
$("#combineBtn").addEventListener("click",()=>{$("#upgradeResult").textContent=inventory.length>=2?"Демо готово: предметы можно объединить в будущей версии.":"Добавь минимум два предмета из каталога, чтобы попробовать демо.";});
$("#vipBtn").addEventListener("click",()=>$("#vipStatus").textContent="VIP-раздел демонстрационный. Статус будет настраиваться администратором.");
function showProfile(){
 const u=tg?.initDataUnsafe?.user;
 if(u){$("#userName").textContent=[u.first_name,u.last_name].filter(Boolean).join(" ");$("#userInfo").textContent="@"+(u.username||"telegram_user");$("#avatar").textContent=(u.first_name||"R").slice(0,1).toUpperCase();$("#profileBtn").textContent="Профиль";}
}
$("#profileBtn").addEventListener("click",()=>showTab("profile"));
render(); showProfile();
