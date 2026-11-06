// Global Orders Array to store incoming orders
let orderList = [
  {
    id: 'GH-202611-01',
    customer: 'Budi Santoso',
    phone: '08123456789',
    deadline: '2026-11-15',
    status: 'Sedang Diproses',
    itemsDesc: 'Dewasa (Lengan Pendek) x 12 Pcs',
    total: 660000,
    dp: 300000,
    sisa: 360000,
    image: ''
  }
];

let dataKas = [
  { tgl: '06/11/2026', tipe: 'Pemasukan', desc: 'DP Order Budi Santoso', nominal: 300000 },
  { tgl: '06/11/2026', tipe: 'Pengeluaran', desc: 'Beli Bahan DTF & Tinta', nominal: 120000 }
];

let chartInstance = null;
let currentUploadedImage = '';

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initKasTable();
  initChart();
  calcSablonTotal();
  calcPrintTotal();
  renderOrderGrid();
  updateDashboardSummary();
});

// Password Visibility Toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');

  if (pass === 'Indonesia123') {
    err.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    switchTab('order-sablon');
  } else {
    err.classList.remove('hidden');
  }
}

function logout() {
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

// Dark / Light Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const label = document.getElementById('theme-label');

  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    label.innerText = 'Theme';
  } else {
    html.classList.add('dark');
    label.innerText = 'Theme';
  }
}

// Sidebar Hide / Show Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  sidebar.classList.toggle('sidebar-hidden');
}

// Navigation Tabs Switcher
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => {
    el.classList.remove('bg-red-600', 'text-white');
    el.classList.add('text-gray-300');
  });

  document.getElementById(`tab-${tabId}`).classList.remove('hidden');
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) {
    activeNav.classList.add('bg-red-600', 'text-white');
    activeNav.classList.remove('text-gray-300');
  }

  if(tabId === 'order-masuk') {
    renderOrderGrid();
  }
  if(tabId === 'grafik' && chartInstance) {
    chartInstance.resize();
  }
}

// Reset Form Sablon kembali bersih
function resetSablonForm() {
  document.getElementById('sablon-customer').value = '';
  document.getElementById('sablon-phone').value = '';
  document.getElementById('sablon-deadline').value = '';
  document.getElementById('dewasa-pendek-qty').value = '0';
  document.getElementById('dewasa-panjang-qty').value = '0';
  document.getElementById('anak-pendek-qty').value = '0';
  document.getElementById('anak-panjang-qty').value = '0';
  document.getElementById('sablon-jahit').value = '0';
  document.getElementById('sablon-dp').value = '0';
  document.getElementById('sablon-note').value = '';
  document.getElementById('sablon-file').value = '';
  
  const preview = document.getElementById('sablon-img-preview');
  preview.src = '';
  preview.classList.add('hidden');
  document.getElementById('sablon-img-placeholder').classList.remove('hidden');
  currentUploadedImage = '';

  calcSablonTotal();
}

// Calculation Sablon
function calcSablonTotal() {
  const dPendekQty = parseInt(document.getElementById('dewasa-pendek-qty').value) || 0;
  const dPendekHarga = parseInt(document.getElementById('dewasa-pendek-harga').value) || 0;
  const dPendekTotal = dPendekQty * dPendekHarga;

  const dPanjangQty = parseInt(document.getElementById('dewasa-panjang-qty').value) || 0;
  const dPanjangHarga = parseInt(document.getElementById('dewasa-panjang-harga').value) || 0;
  const dPanjangTotal = dPanjangQty * dPanjangHarga;

  const aPendekQty = parseInt(document.getElementById('anak-pendek-qty').value) || 0;
  const aPendekHarga = parseInt(document.getElementById('anak-pendek-harga').value) || 0;
  const aPendekTotal = aPendekQty * aPendekHarga;

  const aPanjangQty = parseInt(document.getElementById('anak-panjang-qty').value) || 0;
  const aPanjangHarga = parseInt(document.getElementById('anak-panjang-harga').value) || 0;
  const aPanjangTotal = aPanjangQty * aPanjangHarga;

  const jahitPerPcs = parseInt(document.getElementById('sablon-jahit').value) || 0;
  const totalQty = dPendekQty + dPanjangQty + aPendekQty + aPanjangQty;
  const jahitTotal = totalQty * jahitPerPcs;

  const dp = parseInt(document.getElementById('sablon-dp').value) || 0;
  const kaosSubtotal = dPendekTotal + dPanjangTotal + aPendekTotal + aPanjangTotal;
  const grandTotal = kaosSubtotal + jahitTotal;
  const sisa = grandTotal - dp;

  document.getElementById('summary-kaos-subtotal').innerText = `Rp ${kaosSubtotal.toLocaleString('id-ID')}`;
  document.getElementById('summary-jahit-total').innerText = `Rp ${jahitTotal.toLocaleString('id-ID')}`;
  document.getElementById('summary-dp-val').innerText = `Rp ${dp.toLocaleString('id-ID')}`;
  document.getElementById('summary-sisa-val').innerText = `Rp ${(sisa > 0 ? sisa : 0).toLocaleString('id-ID')}`;
  document.getElementById('sablon-total-val').innerText = `Rp ${grandTotal.toLocaleString('id-ID')}`;
}

// Calculation Print Digital
function calcPrintTotal() {
  const qty = parseInt(document.getElementById('print-qty').value) || 0;
  const harga = parseInt(document.getElementById('print-harga').value) || 0;
  const dp = parseInt(document.getElementById('print-dp').value) || 0;
  const total = qty * harga;
  const sisa = total - dp;

  document.getElementById('print-summary-qty').innerText = qty;
  document.getElementById('print-summary-dp').innerText = `Rp ${dp.toLocaleString('id-ID')}`;
  document.getElementById('print-summary-sisa').innerText = `Rp ${(sisa > 0 ? sisa : 0).toLocaleString('id-ID')}`;
  document.getElementById('print-total-val').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Image Preview Handler
function previewImage(event, targetId) {
  const file = event.target.files[0];
  const preview = document.getElementById(targetId);
  const placeholderId = targetId === 'sablon-img-preview' ? 'sablon-img-placeholder' : 'print-img-placeholder';
  const placeholder = document.getElementById(placeholderId);

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentUploadedImage = e.target.result;
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      if(placeholder) placeholder.classList.add('hidden');
    }
    reader.readAsDataURL(file);
  }
}

// Process Sablon Order to Save & Nota
function prosesOrderSablon() {
  const customer = document.getElementById('sablon-customer').value || 'Pelanggan Umum';
  const phone = document.getElementById('sablon-phone').value || '-';
  const deadline = document.getElementById('sablon-deadline').value || '-';
  const status = document.getElementById('sablon-status').value;

  const items = [];
  const dPendekQty = parseInt(document.getElementById('dewasa-pendek-qty').value) || 0;
  const dPendekHarga = parseInt(document.getElementById('dewasa-pendek-harga').value) || 0;
  if(dPendekQty > 0) items.push({ desc: 'Dewasa (Lengan Pendek)', qty: dPendekQty, harga: dPendekHarga, total: dPendekQty * dPendekHarga });

  const dPanjangQty = parseInt(document.getElementById('dewasa-panjang-qty').value) || 0;
  const dPanjangHarga = parseInt(document.getElementById('dewasa-panjang-harga').value) || 0;
  if(dPanjangQty > 0) items.push({ desc: 'Dewasa (Lengan Panjang)', qty: dPanjangQty, harga: dPanjangHarga, total: dPanjangQty * dPanjangHarga });

  const aPendekQty = parseInt(document.getElementById('anak-pendek-qty').value) || 0;
  const aPendekHarga = parseInt(document.getElementById('anak-pendek-harga').value) || 0;
  if(aPendekQty > 0) items.push({ desc: 'Anak (Lengan Pendek)', qty: aPendekQty, harga: aPendekHarga, total: aPendekQty * aPendekHarga });

  const aPanjangQty = parseInt(document.getElementById('anak-panjang-qty').value) || 0;
  const aPanjangHarga = parseInt(document.getElementById('anak-panjang-harga').value) || 0;
  if(aPanjangQty > 0) items.push({ desc: 'Anak (Lengan Panjang)', qty: aPanjangQty, harga: aPanjangHarga, total: aPanjangQty * aPanjangHarga });

  const jahitPerPcs = parseInt(document.getElementById('sablon-jahit').value) || 0;
  const dp = parseInt(document.getElementById('sablon-dp').value) || 0;

  if(items.length === 0) {
    alert('Harap isi jumlah pesanan minimal 1 item!');
    return;
  }

  const totalQty = dPendekQty + dPanjangQty + aPendekQty + aPanjangQty;
  const jahitTotal = totalQty * jahitPerPcs;
  const kaosSubtotal = (dPendekQty * dPendekHarga) + (dPanjangQty * dPanjangHarga) + (aPendekQty * aPendekHarga) + (aPanjangQty * aPanjangHarga);
  const grandTotal = kaosSubtotal + jahitTotal;

  const orderId = 'GH-' + Math.floor(100000 + Math.random() * 900000);

  // Push to order list
  orderList.unshift({
    id: orderId,
    customer: customer,
    phone: phone,
    deadline: deadline,
    status: status,
    itemsDesc: `${totalQty} Pcs Kaos`,
    total: grandTotal,
    dp: dp,
    sisa: grandTotal - dp,
    image: currentUploadedImage
  });

  renderOrderGrid();
  updateDashboardSummary();
  openNotaModal(orderId, customer, deadline, items, kaosSubtotal, jahitTotal, dp, grandTotal, currentUploadedImage);

  // RESET FORM DASBOARD KEMBALI SEPERTI SEMULA
  resetSablonForm();
}

function prosesPrintDigital() {
  const customer = document.getElementById('print-customer').value || 'Pelanggan Umum';
  const jenis = document.getElementById('print-jenis').value;
  const uk = document.getElementById('print-ukuran').value;
  const qty = parseInt(document.getElementById('print-qty').value) || 0;
  const harga = parseInt(document.getElementById('print-harga').value) || 0;
  const dp = parseInt(document.getElementById('print-dp').value) || 0;
  const total = qty * harga;

  const items = [{
    desc: `Cetak ${jenis} (${uk})`,
    qty: qty,
    harga: harga,
    total: total
  }];

  const orderId = 'GH-' + Math.floor(100000 + Math.random() * 900000);
  
  orderList.unshift({
    id: orderId,
    customer: customer,
    phone: '-',
    deadline: '-',
    status: 'Sedang Diproses',
    itemsDesc: `${jenis} (${uk}) x ${qty}`,
    total: total,
    dp: dp,
    sisa: total - dp,
    image: currentUploadedImage
  });

  renderOrderGrid();
  updateDashboardSummary();
  openNotaModal(orderId, customer, '-', items, total, 0, dp, total, currentUploadedImage);
}

// Open Nota Modal & Populate Data
function openNotaModal(orderId, customer, deadline, items, subtotal, jahitTotal, dp, grandTotal, imgData) {
  const dateStr = new Date().toLocaleDateString('id-ID');

  document.getElementById('nota-customer').innerText = customer;
  document.getElementById('nota-date').innerText = dateStr;
  document.getElementById('nota-id').innerText = orderId;
  document.getElementById('nota-deadline').innerText = deadline;

  const tbody = document.getElementById('nota-items-body');
  tbody.innerHTML = '';

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td contenteditable="true" class="py-1 px-1 font-medium border-b border-gray-100 focus:outline-none">${item.desc}</td>
      <td contenteditable="true" class="py-1 px-1 text-center border-b border-gray-100 focus:outline-none">${item.qty}</td>
      <td contenteditable="true" class="py-1 px-1 text-right border-b border-gray-100 focus:outline-none">Rp ${item.harga.toLocaleString('id-ID')}</td>
      <td contenteditable="true" class="py-1 px-1 text-right font-semibold border-b border-gray-100 focus:outline-none">Rp ${item.total.toLocaleString('id-ID')}</td>
    `;
    tbody.appendChild(tr);
  });

  // Handle Image in Nota
  const imgContainer = document.getElementById('nota-image-container');
  const previewImg = document.getElementById('nota-preview-img');
  if(imgData) {
    previewImg.src = imgData;
    imgContainer.classList.remove('hidden');
  } else {
    imgContainer.classList.add('hidden');
  }

  const sisa = grandTotal - dp;

  document.getElementById('nota-subtotal').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
  document.getElementById('nota-jahit').innerText = `Rp ${jahitTotal.toLocaleString('id-ID')}`;
  document.getElementById('nota-dp').innerText = `Rp ${dp.toLocaleString('id-ID')}`;
  document.getElementById('nota-sisa').innerText = `Rp ${(sisa > 0 ? sisa : 0).toLocaleString('id-ID')}`;
  document.getElementById('nota-grand-total').innerText = `Rp ${grandTotal.toLocaleString('id-ID')}`;

  document.getElementById('nota-modal').classList.remove('hidden');
}

function closeNotaModal() {
  document.getElementById('nota-modal').classList.add('hidden');
}

// Update Totals on Main Dashboard Widgets
function updateDashboardSummary() {
  let totalOmset = 0;
  let totalDP = 0;
  let totalSisa = 0;

  orderList.forEach(ord => {
    totalOmset += ord.total;
    totalDP += ord.dp;
    totalSisa += (ord.sisa > 0 ? ord.sisa : 0);
  });

  document.getElementById('dash-total-omset').innerText = `Rp ${totalOmset.toLocaleString('id-ID')}`;
  document.getElementById('dash-total-dp').innerText = `Rp ${totalDP.toLocaleString('id-ID')}`;
  document.getElementById('dash-total-sisa').innerText = `Rp ${totalSisa.toLocaleString('id-ID')}`;
  document.getElementById('dash-total-orders').innerText = `${orderList.length} Order`;
}

// Render Grid of Incoming Orders
function renderOrderGrid() {
  const container = document.getElementById('order-grid-container');
  container.innerHTML = '';
  document.getElementById('total-order-count').innerText = orderList.length;
  document.getElementById('badge-order-masuk').innerText = orderList.length;

  orderList.forEach((order, index) => {
    const isSelesai = order.status === 'Selesai';
    const card = document.createElement('div');
    card.className = "bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-red-500/50 transition-colors";
    
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono text-gray-400">${order.id}</span>
          <select onchange="updateOrderStatus(${index}, this.value)" class="text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${isSelesai ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}">
            <option value="Sedang Diproses" ${!isSelesai ? 'selected' : ''}>Sedang Diproses</option>
            <option value="Selesai" ${isSelesai ? 'selected' : ''}>Selesai</option>
          </select>
        </div>
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-base font-bold text-white mb-1">${order.customer}</h3>
          <button onclick="openEditModal(${index})" class="text-xs text-gray-400 hover:text-red-400 p-1 rounded bg-gray-800/80 border border-gray-700">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-xs text-gray-400 mb-2 flex items-center gap-1"><i data-lucide="phone" class="w-3.5 h-3.5"></i> ${order.phone}</p>
        <p class="text-xs text-gray-300 bg-gray-950 p-2.5 rounded-xl border border-gray-800 mb-2">${order.itemsDesc}</p>
        <div class="text-xs text-gray-400 flex items-center justify-between">
          <span>Deadline: <strong class="text-red-400">${order.deadline}</strong></span>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-3 flex items-center justify-between text-xs">
        <div>
          <span class="text-gray-500 block">Total:</span>
          <span class="font-bold text-white">Rp ${order.total.toLocaleString('id-ID')}</span>
        </div>
        <div class="text-right">
          <span class="text-gray-500 block">Sisa:</span>
          <span class="font-bold text-red-400">Rp ${order.sisa.toLocaleString('id-ID')}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function updateOrderStatus(index, newStatus) {
  orderList[index].status = newStatus;
  renderOrderGrid();
  updateDashboardSummary();
}

// Edit Order Modal Functions
function openEditModal(index) {
  const ord = orderList[index];
  document.getElementById('edit-order-index').value = index;
  document.getElementById('edit-customer').value = ord.customer;
  document.getElementById('edit-phone').value = ord.phone;
  document.getElementById('edit-deadline').value = ord.deadline;
  document.getElementById('edit-status').value = ord.status;
  document.getElementById('edit-total').value = ord.total;
  document.getElementById('edit-dp').value = ord.dp;
  document.getElementById('edit-items-desc').value = ord.itemsDesc;

  document.getElementById('edit-order-modal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-order-modal').classList.add('hidden');
}

function saveEditOrder() {
  const index = parseInt(document.getElementById('edit-order-index').value);
  if (isNaN(index)) return;

  const total = parseInt(document.getElementById('edit-total').value) || 0;
  const dp = parseInt(document.getElementById('edit-dp').value) || 0;

  orderList[index].customer = document.getElementById('edit-customer').value;
  orderList[index].phone = document.getElementById('edit-phone').value;
  orderList[index].deadline = document.getElementById('edit-deadline').value;
  orderList[index].status = document.getElementById('edit-status').value;
  orderList[index].total = total;
  orderList[index].dp = dp;
  orderList[index].sisa = total - dp;
  orderList[index].itemsDesc = document.getElementById('edit-items-desc').value;

  closeEditModal();
  renderOrderGrid();
  updateDashboardSummary();
}

// Kas Harian Handlers
function tambahKas() {
  const tipe = document.getElementById('kas-tipe').value;
  const desc = document.getElementById('kas-desc').value || 'Tanpa Keterangan';
  const nominal = parseInt(document.getElementById('kas-nominal').value) || 0;
  const tgl = new Date().toLocaleDateString('id-ID');

  if(nominal <= 0) return alert('Nominal harus lebih dari 0');

  dataKas.unshift({ tgl, tipe, desc, nominal });
  initKasTable();

  document.getElementById('kas-desc').value = '';
  document.getElementById('kas-nominal').value = '';
}

function initKasTable() {
  const tbody = document.getElementById('kas-table-body');
  tbody.innerHTML = '';

  let saldo = 0;
  dataKas.forEach(item => {
    if(item.tipe === 'Pemasukan') saldo += item.nominal;
    else saldo -= item.nominal;

    const isMasuk = item.tipe === 'Pemasukan';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-3 text-gray-400 font-mono text-xs">${item.tgl}</td>
      <td class="px-4 py-3 font-semibold ${isMasuk ? 'text-emerald-400' : 'text-red-400'}">${item.tipe}</td>
      <td class="px-4 py-3 text-gray-200">${item.desc}</td>
      <td class="px-4 py-3 text-right font-semibold ${isMasuk ? 'text-emerald-400' : 'text-red-400'}">
        ${isMasuk ? '+' : '-'} Rp ${item.nominal.toLocaleString('id-ID')}
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('kas-saldo').innerText = `Rp ${saldo.toLocaleString('id-ID')}`;
}

// Chart Setup
function initChart() {
  const ctx = document.getElementById('chartBulanan').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Omset Bulanan (Rp)',
        data: [4200000, 5800000, 6500000, 7100000, 8900000, 10500000, 9200000, 11000000, 9800000, 12500000, 10800000, 13000000],
        backgroundColor: '#dc2626',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            color: '#9ca3af',
            callback: function(value) {
              return (value / 1000) + 'k';
            }
          },
          grid: { color: '#1f2937' }
        },
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#1f2937' }
        }
      }
    }
  });
}
