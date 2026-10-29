const initialProducts = [
  {name:"Nasi Goreng",category:"Makanan",price:10000,sold:38,stock:18},
  {name:"Mie Ayam",category:"Makanan",price:8000,sold:23,stock:12},
  {name:"Nasi Uduk",category:"Makanan",price:7000,sold:23,stock:16},
  {name:"Air Mineral",category:"Minuman",price:4000,sold:34,stock:8},
  {name:"Es Teh Manis",category:"Minuman",price:3000,sold:42,stock:6},
  {name:"Jus Jeruk",category:"Minuman",price:6000,sold:19,stock:14},
  {name:"Roti Coklat",category:"Snack",price:5000,sold:28,stock:20},
  {name:"Pisang Goreng",category:"Snack",price:4000,sold:21,stock:5},
  {name:"Ayam Geprek",category:"Makanan",price:12000,sold:17,stock:11},
  {name:"Keripik Singkong",category:"Snack",price:3000,sold:16,stock:25}
];
let products = initialProducts.map(p=>({...p}));
let showAll = false;
const rupiah = n => "Rp" + Math.round(n).toLocaleString("id-ID");
const revenue = p => p.price*p.sold;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function categoryClass(category){return "cat-"+category.toLowerCase()}
function renderProducts(){
  const q=($("#productSearch")?.value||"").toLowerCase();
  const category=$("#categoryFilter")?.value||"Semua";
  const sort=$("#sortProducts")?.value||"sold";
  let list=products.filter(p=>p.name.toLowerCase().includes(q)&&(category==="Semua"||p.category===category));
  list.sort(sort==="revenue"?(a,b)=>revenue(b)-revenue(a):sort==="name"?(a,b)=>a.name.localeCompare(b.name):(a,b)=>b.sold-a.sold);
  const shown=showAll?list:list.slice(0,5);
  $("#productRows").innerHTML=shown.map(p=>`<tr><td>${escapeHTML(p.name)}</td><td><span class="category-badge ${categoryClass(p.category)}">${p.category.toUpperCase()}</span></td><td>${p.sold}</td><td>${rupiah(revenue(p))}</td></tr>`).join("")||'<tr><td colspan="4">Produk tidak ditemukan.</td></tr>';
  $("#productCount").textContent=`Menampilkan ${shown.length} dari ${list.length} produk`;
  $("#showMore").textContent=showAll?"Tampilkan lebih sedikit ↑":"Tampilkan semua ↓";
  $("#totalProducts").textContent=products.length;
  const q2=($("#allProductSearch")?.value||"").toLowerCase();
  $("#allProductRows").innerHTML=products.filter(p=>p.name.toLowerCase().includes(q2)).map(p=>`<tr><td>${escapeHTML(p.name)}</td><td><span class="category-badge ${categoryClass(p.category)}">${p.category}</span></td><td>${rupiah(p.price)}</td><td>${p.sold}</td><td>${rupiah(revenue(p))}</td><td><span class="stock-badge ${p.stock<=8?"stock-low":"stock-ok"}">${p.stock<=8?"Stok menipis":"Tersedia"} · ${p.stock}</span></td></tr>`).join("")||'<tr><td colspan="6">Produk tidak ditemukan.</td></tr>';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const labels=["Sab, 17","Min, 18","Sen, 19","Sel, 20","Rab, 21","Kam, 22","Jum, 23"];
const daily=[220000,162000,198000,220000,194000,153000,263000];
const chartDefaults={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>rupiah(c.raw)}}},scales:{x:{grid:{display:false},ticks:{color:"#8993a4",font:{family:"Inter",size:10}},border:{display:false}},y:{beginAtZero:true,grid:{color:"#edf0f4",drawTicks:false},border:{display:false},ticks:{color:"#8993a4",font:{family:"Inter",size:10},callback:v=>v===0?"0":(v/1000)+"rb",maxTicksLimit:6}}}};
const revenueChart=new Chart($("#revenueChart"),{type:"bar",data:{labels,datasets:[{data:daily,backgroundColor:"#3478e5",hoverBackgroundColor:"#2467d4",borderRadius:4,borderSkipped:false,maxBarThickness:38}]},options:chartDefaults});
const categoryChart=new Chart($("#categoryChart"),{type:"doughnut",data:{labels:["Makanan","Minuman","Snack"],datasets:[{data:[85,105,64],backgroundColor:["#3478e5","#80bd35","#b45add"],borderWidth:0,hoverOffset:5,spacing:2}]},options:{responsive:true,maintainAspectRatio:false,cutout:"68%",plugins:{legend:{display:false}}}});
new Chart($("#reportChart"),{type:"bar",data:{labels,datasets:[{label:"Omzet",data:daily,backgroundColor:"#3478e5",borderRadius:5,borderSkipped:false,maxBarThickness:48}]},options:chartDefaults});
renderProducts();
$$(".nav-link").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b===btn));
  $$(".page").forEach(p=>p.classList.remove("active-page"));
  $("#"+btn.dataset.page+"Page").classList.add("active-page");
  $("#crumb").textContent=btn.textContent.trim();
  $("#sidebar").classList.remove("open");
}));
$("#productSearch").addEventListener("input",renderProducts);
$("#allProductSearch").addEventListener("input",renderProducts);
$("#sortProducts").addEventListener("change",renderProducts);
$("#categoryFilter").addEventListener("change",()=>{
  const category=$("#categoryFilter").value;
  const filtered=category==="Semua"?products:products.filter(p=>p.category===category);
  const total=filtered.reduce((s,p)=>s+revenue(p),0);
  $("#revenue").textContent=rupiah(category==="Semua"?1410000:total);
  $("#itemsSold").textContent=filtered.reduce((s,p)=>s+p.sold,0);
  $("#transactions").textContent=category==="Semua"?"21":Math.max(3,Math.round(filtered.length*2.1));
  renderProducts();
});
$("#dateFilter").addEventListener("change",e=>toast("Tanggal laporan dipilih: "+e.target.value+" (data contoh)"));
$("#showMore").addEventListener("click",()=>{showAll=!showAll;renderProducts()});
$("#seeAll").addEventListener("click",()=>{$('[data-page="produk"]').click()});
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#promoButton").addEventListener("click",()=>toast("Form tambah promo akan tersedia pada pengembangan berikutnya."));
const dialog=$("#productDialog");
$("#addProduct").addEventListener("click",()=>dialog.showModal());
$("#closeDialog").addEventListener("click",()=>dialog.close());
$("#cancelDialog").addEventListener("click",()=>dialog.close());
$("#productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#newName").value.trim(),category=$("#newCategory").value,price=Number($("#newPrice").value),stock=Number($("#newStock").value);
  if(!name||price<=0||stock<0)return;
  products.push({name,category,price,sold:0,stock});
  renderProducts();dialog.close();e.target.reset();$("#newStock").value=20;
  toast("Produk "+name+" berhasil ditambahkan.");
});
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();$(".brand strong").textContent=$("#canteenName").value;toast("Pengaturan berhasil disimpan.")});
$("#themeSelect").addEventListener("change",e=>{document.body.classList.toggle("dark-mode",e.target.value==="dark");setTimeout(()=>{revenueChart.resize();categoryChart.resize()},80)});
$("#exportCsv").addEventListener("click",()=>{
  const rows=[["Produk","Kategori","Harga","Terjual","Omzet","Stok"],...products.map(p=>[p.name,p.category,p.price,p.sold,revenue(p),p.stock])];
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="laporan-kantin.csv";a.click();URL.revokeObjectURL(url);
  toast("Laporan CSV berhasil diekspor.");
});
