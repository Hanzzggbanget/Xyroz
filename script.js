const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Bot WhatsApp Premium', price: 150000, category: 'Bot WhatsApp', stock: 'Ready', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=85', description: 'Bot WhatsApp praktis untuk membantu otomatisasi bisnis, layanan pelanggan, dan kebutuhan operasional Anda.' },
  { id: 2, name: 'Website Landing Page', price: 350000, category: 'Website', stock: 'Ready', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85', description: 'Landing page modern yang cepat, responsif, dan siap digunakan untuk mempromosikan bisnis Anda.' },
  { id: 3, name: 'Paket Desain Sosial Media', price: 125000, category: 'Desain', stock: 'Ready', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85', description: 'Kumpulan desain premium untuk membuat tampilan sosial media bisnis lebih konsisten dan profesional.' }
];

const PUBLIC_QR = 'https://hanzzggbanget.github.io/Xyroz/qr_ID1025426624272_04.09.26_1788539734_1788539750304.jpeg';
const DEFAULT_PAYMENTS = [
  { id: 1, name: 'DANA', number: '0812345678912', accountName: 'Nama pengguna DANA', qr: PUBLIC_QR },
  { id: 2, name: 'GoPay', number: '085789963681', accountName: 'Nama pengguna GoPay', qr: PUBLIC_QR }
];

const money = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const by = id => document.getElementById(id);
const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || 'null') || fallback;
let products = read('xyrozProducts', DEFAULT_PRODUCTS);
let payments = read('xyrozPayments', DEFAULT_PAYMENTS);
let selected = null;
payments = payments.map((payment, index) => ({ ...DEFAULT_PAYMENTS[index], ...payment, qr: payment.qr || DEFAULT_QR }));
function save() { localStorage.setItem('xyrozProducts', JSON.stringify(products)); localStorage.setItem('xyrozPayments', JSON.stringify(payments)); }
function renderProducts() {
  const grid = by('productGrid'); if (!grid) return;
  const query = (by('searchInput')?.value || '').toLowerCase(), category = by('categoryFilter')?.value || 'all';
  const list = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query) && (category === 'all' || p.category === category));
  grid.innerHTML = list.length ? list.map(p => `<article class="product-card"><div class="product-image" style="background-image:url('${p.image}')"><span>${p.stock}</span></div><div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><strong>${money(p.price)}</strong><button class="secondary-btn" onclick="selectProduct(${p.id})">Lihat detail →</button></div></article>`).join('') : '<div class="empty-state">Produk tidak ditemukan.</div>';
}
function selectProduct(id) {
  selected = products.find(p => p.id === id); if (!selected) return;
  if (by('detailCategory')) by('detailCategory').textContent = selected.category;
  if (by('detailName')) by('detailName').textContent = selected.name;
  if (by('detailPrice')) by('detailPrice').textContent = money(selected.price);
  if (by('detailDescription')) by('detailDescription').textContent = selected.description;
  if (by('detailStock')) by('detailStock').textContent = selected.stock;
  if (by('detailImage')) by('detailImage').style.backgroundImage = `url('${selected.image}')`;
  if (by('selectedProductDisplay')) by('selectedProductDisplay').value = selected.name;
  if (by('orderProductName')) by('orderProductName').value = selected.name;
  if (by('orderProductPrice')) by('orderProductPrice').value = money(selected.price);
  if (by('paymentProductName')) by('paymentProductName').textContent = selected.name;
  if (by('paymentProductPrice')) by('paymentProductPrice').textContent = money(selected.price);
  by('paymentEmpty')?.classList.add('hidden'); by('paymentDetails')?.classList.remove('hidden'); renderPayments(); by('checkout')?.scrollIntoView({ behavior: 'smooth' });
}
function renderPayments() {
  const wrapper = by('paymentMethods'); if (!wrapper) return;
  wrapper.innerHTML = payments.map(p => `<div class="payment-method"><div><small>${p.name}</small><strong>${p.number || 'Scan QR untuk membayar'}</strong><span class="payment-account-name">${p.accountName || ''}</span></div>${p.qr ? `<a href="${p.qr}" target="_blank" rel="noopener"><img src="${p.qr}" alt="QR ${p.name}" class="payment-qr"><span>Buka QR</span></a>` : '<div class="qr-placeholder">QR belum tersedia</div>'}</div>`).join('');
}
function setupStore() {
  if (!by('productGrid')) return;
  const categories = [...new Set(products.map(p => p.category))];
  if (by('categoryFilter')) by('categoryFilter').innerHTML = '<option value="all">Semua kategori</option>' + categories.map(c => `<option>${c}</option>`).join('');
  renderProducts(); by('searchInput')?.addEventListener('input', renderProducts); by('categoryFilter')?.addEventListener('change', renderProducts); by('selectProductBtn')?.addEventListener('click', () => selected && selectProduct(selected.id));
  by('orderForm')?.addEventListener('submit', e => { e.preventDefault(); if (!selected) return alert('Silakan pilih produk terlebih dahulu.'); const msg = `Halo Xyroz, saya ingin membeli:%0AProduk: ${selected.name}%0AHarga: ${money(selected.price)}%0ANama: ${by('customerName')?.value || '-'}%0ANomor WhatsApp: ${by('customerPhone')?.value || '-'}%0ACatatan: ${by('customerNote')?.value || '-'}`; window.location.href = `https://wa.me/6285177356154?text=${msg}`; });
}
function resetProductForm() { ['productId','productName','productPrice','productCategory','productImage','productDescription'].forEach(id => { if (by(id)) by(id).value = ''; }); if (by('productStock')) by('productStock').value = 'Ready'; by('cancelEditBtn')?.classList.add('hidden'); if (by('formTitle')) by('formTitle').textContent = 'Tambah produk'; }
function renderOwner() {
  const list = by('ownerProductList'); if (!list) return;
  if (by('totalProducts')) by('totalProducts').textContent = products.length; if (by('totalCategories')) by('totalCategories').textContent = new Set(products.map(p => p.category)).size;
  list.innerHTML = products.map(p => `<tr><td><strong>${p.name}</strong></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button class="table-btn" onclick="editProduct(${p.id})">Edit</button><button class="table-btn danger" onclick="deleteProduct(${p.id})">Hapus</button></td></tr>`).join('');
  const paymentList = by('paymentOwnerList'); if (paymentList) paymentList.innerHTML = payments.map(p => `<div class="owner-payment"><strong>${p.name}</strong><br>Nomor: ${p.number || '-'}<br>Nama pengguna: ${p.accountName || '-'} <button class="table-btn danger" onclick="deletePayment(${p.id})">Hapus</button></div>`).join('');
}
function setupOwner() {
  const login = by('loginForm'); if (!login) return;
  login.onsubmit = e => { e.preventDefault(); if (by('ownerPassword').value !== 'xyroz2026') return alert('Password salah.'); by('loginPanel')?.classList.add('hidden'); by('ownerDashboard')?.classList.remove('hidden'); renderOwner(); };
  // Add the account-name field even on older owner.html versions.
  const paymentForm = by('paymentForm');
  if (paymentForm && !by('paymentAccountName')) { const label = document.createElement('label'); label.innerHTML = 'Nama pengguna DANA/GoPay<input id="paymentAccountName" type="text" placeholder="Contoh: Budi Santoso" required>'; const submit = paymentForm.querySelector('button[type="submit"]'); paymentForm.insertBefore(label, submit || null); }
  by('productForm')?.addEventListener('submit', e => { e.preventDefault(); const id = Number(by('productId').value); const item = { id: id || Date.now(), name: by('productName').value, price: Number(by('productPrice').value), category: by('productCategory').value, stock: by('productStock').value, image: by('productImage').value, description: by('productDescription').value }; products = id ? products.map(p => p.id === id ? item : p) : [...products, item]; save(); resetProductForm(); renderOwner(); alert('Produk berhasil disimpan.'); });
  paymentForm?.addEventListener('submit', e => { e.preventDefault(); const file = by('paymentQrFile')?.files?.[0]; if (!file) return alert('Pilih foto QR terlebih dahulu.'); const reader = new FileReader(); reader.onload = () => { payments.push({ id: Date.now(), name: by('paymentName').value, number: by('paymentNumber').value, accountName: by('paymentAccountName').value, qr: reader.result }); save(); e.target.reset(); renderOwner(); alert('Metode pembayaran tersimpan.'); }; reader.readAsDataURL(file); });
}
window.selectProduct = selectProduct; window.deleteProduct = id => { if (confirm('Hapus produk ini?')) { products = products.filter(p => p.id !== id); save(); renderOwner(); } }; window.deletePayment = id => { if (confirm('Hapus metode ini?')) { payments = payments.filter(p => p.id !== id); save(); renderOwner(); } }; window.editProduct = id => { const p = products.find(x => x.id === id); if (!p) return; ['productId','productName','productPrice','productCategory','productStock','productImage','productDescription'].forEach((key, i) => { if (by(key)) by(key).value = [p.id,p.name,p.price,p.category,p.stock,p.image,p.description][i]; }); by('formTitle').textContent = 'Edit produk'; by('cancelEditBtn')?.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); };
by('cancelEditBtn')?.addEventListener('click', resetProductForm); setupStore(); setupOwner();
