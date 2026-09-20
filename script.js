const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Bot WhatsApp Premium', price: 150000, category: 'Bot WhatsApp', stock: 'Ready', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=900&q=85', description: 'Bot WhatsApp praktis untuk membantu otomatisasi bisnis, layanan pelanggan, dan kebutuhan operasional Anda.' },
  { id: 2, name: 'Website Landing Page', price: 350000, category: 'Website', stock: 'Ready', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85', description: 'Landing page modern yang cepat, responsif, dan siap digunakan untuk mempromosikan bisnis Anda.' },
  { id: 3, name: 'Paket Desain Sosial Media', price: 125000, category: 'Desain', stock: 'Ready', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85', description: 'Kumpulan desain premium untuk membuat tampilan sosial media bisnis lebih konsisten dan profesional.' }
];

const PUBLIC_QR = 'https://hanzzggbanget.github.io/Xyroz/qr_ID1025426624272_04.09.26_1788539734_1788539750304.jpeg';
const DEFAULT_PAYMENTS = [
  { id: 1, name: 'DANA', number: '085177961224', qr: PUBLIC_QR },
  { id: 2, name: 'GoPay', number: '085789963681', qr: PUBLIC_QR }
];

const money = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const by = id => document.getElementById(id);
const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || 'null') || fallback;
let products = read('xyrozProducts', DEFAULT_PRODUCTS);
let payments = read('xyrozPayments', DEFAULT_PAYMENTS);
let selected = null;

// Always use the repository QR when an old localStorage record has an empty QR.
payments = payments.map((payment, index) => ({
  ...payment,
  qr: payment.qr || DEFAULT_PAYMENTS[index]?.qr || PUBLIC_QR
}));

function save() {
  localStorage.setItem('xyrozProducts', JSON.stringify(products));
  localStorage.setItem('xyrozPayments', JSON.stringify(payments));
}

function renderProducts() {
  const grid = by('productGrid');
  if (!grid) return;
  const query = (by('searchInput')?.value || '').toLowerCase();
  const category = by('categoryFilter')?.value || 'all';
  const list = products.filter(product =>
    `${product.name} ${product.category}`.toLowerCase().includes(query) &&
    (category === 'all' || product.category === category)
  );
  grid.innerHTML = list.length ? list.map(product => `
    <article class="product-card">
      <div class="product-image" style="background-image:url('${product.image}')"><span>${product.stock}</span></div>
      <div class="product-info"><small>${product.category}</small><h3>${product.name}</h3><strong>${money(product.price)}</strong><button class="secondary-btn" onclick="selectProduct(${product.id})">Lihat detail →</button></div>
    </article>`).join('') : '<div class="empty-state">Produk tidak ditemukan.</div>';
}

function selectProduct(id) {
  selected = products.find(product => product.id === id);
  if (!selected) return;
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
  by('paymentEmpty')?.classList.add('hidden');
  by('paymentDetails')?.classList.remove('hidden');
  renderPayments();
  by('checkout')?.scrollIntoView({ behavior: 'smooth' });
}

function renderPayments() {
  const wrapper = by('paymentMethods');
  if (!wrapper) return;
  wrapper.innerHTML = payments.map(payment => `
    <div class="payment-method">
      <div><small>${payment.name}</small><strong>${payment.number || 'Scan QR untuk membayar'}</strong></div>
      ${payment.qr ? `<a href="${payment.qr}" target="_blank" rel="noopener"><img src="${payment.qr}" alt="QR ${payment.name}" class="payment-qr"><span>Buka QR</span></a>` : '<div class="qr-placeholder">QR belum tersedia</div>'}
    </div>`).join('');
}

function setupStore() {
  if (!by('productGrid')) return;
  const categories = [...new Set(products.map(product => product.category))];
  if (by('categoryFilter')) by('categoryFilter').innerHTML = '<option value="all">Semua kategori</option>' + categories.map(category => `<option>${category}</option>`).join('');
  renderProducts();
  by('searchInput')?.addEventListener('input', renderProducts);
  by('categoryFilter')?.addEventListener('change', renderProducts);
  by('selectProductBtn')?.addEventListener('click', () => selected && selectProduct(selected.id));
  by('orderForm')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!selected) return alert('Silakan pilih produk terlebih dahulu.');
    const message = `Halo Xyroz, saya ingin membeli:%0AProduk: ${selected.name}%0AHarga: ${money(selected.price)}%0ANama: ${by('customerName')?.value || '-'}%0ANomor WhatsApp: ${by('customerPhone')?.value || '-'}%0ACatatan: ${by('customerNote')?.value || '-'}`;
    window.location.href = `https://wa.me/6285177356154?text=${message}`;
  });
}

function resetProductForm() {
  ['productId','productName','productPrice','productCategory','productImage','productDescription'].forEach(id => { if (by(id)) by(id).value = ''; });
  if (by('productStock')) by('productStock').value = 'Ready';
  by('cancelEditBtn')?.classList.add('hidden');
  if (by('formTitle')) by('formTitle').textContent = 'Tambah Produk';
}

function renderOwner() {
  const list = by('ownerProductList');
  if (!list) return;
  if (by('totalProducts')) by('totalProducts').textContent = products.length;
  if (by('totalCategories')) by('totalCategories').textContent = new Set(products.map(product => product.category)).size;
  list.innerHTML = products.map(product => `<tr><td><strong>${product.name}</strong></td><td>${product.category}</td><td>${money(product.price)}</td><td>${product.stock}</td><td><button class="table-btn" onclick="editProduct(${product.id})">Edit</button><button class="table-btn danger" onclick="deleteProduct(${product.id})">Hapus</button></td></tr>`).join('');
  const paymentList = by('paymentOwnerList');
  if (paymentList) paymentList.innerHTML = payments.map(payment => `<div class="owner-payment"><strong>${payment.name}</strong> ${payment.number || ''}<button class="table-btn danger" onclick="deletePayment(${payment.id})">Hapus</button></div>`).join('');
}

function setupOwner() {
  const login = by('loginForm');
  if (!login) return;
  login.onsubmit = event => {
    event.preventDefault();
    if (by('ownerPassword').value !== 'xyroz2026') return alert('Password salah.');
    by('loginPanel')?.classList.add('hidden');
    by('ownerDashboard')?.classList.remove('hidden');
    renderOwner();
  };
  by('productForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const id = Number(by('productId').value);
    const item = { id: id || Date.now(), name: by('productName').value, price: Number(by('productPrice').value), category: by('productCategory').value, stock: by('productStock').value, image: by('productImage').value, description: by('productDescription').value };
    products = id ? products.map(product => product.id === id ? item : product) : [...products, item];
    save(); resetProductForm(); renderOwner(); alert('Produk berhasil disimpan.');
  });
  by('paymentForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const file = by('paymentQrFile')?.files?.[0];
    if (!file) return alert('Pilih foto QR terlebih dahulu.');
    const reader = new FileReader();
    reader.onload = () => { payments.push({ id: Date.now(), name: by('paymentName').value, number: by('paymentNumber').value, qr: reader.result }); save(); event.target.reset(); renderOwner(); alert('QR tersimpan di browser owner. Untuk pelanggan, QR repository digunakan otomatis.'); };
    reader.readAsDataURL(file);
  });
}

window.selectProduct = selectProduct;
window.deleteProduct = id => { if (confirm('Hapus produk ini?')) { products = products.filter(product => product.id !== id); save(); renderOwner(); } };
window.deletePayment = id => { if (confirm('Hapus metode ini?')) { payments = payments.filter(payment => payment.id !== id); save(); renderOwner(); } };
window.editProduct = id => { const product = products.find(item => item.id === id); if (!product) return; ['productId','productName','productPrice','productCategory','productStock','productImage','productDescription'].forEach((key, index) => { if (by(key)) by(key).value = [product.id, product.name, product.price, product.category, product.stock, product.image, product.description][index]; }); by('formTitle').textContent = 'Edit Produk'; by('cancelEditBtn')?.classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
by('cancelEditBtn')?.addEventListener('click', resetProductForm);
setupStore();
setupOwner();
