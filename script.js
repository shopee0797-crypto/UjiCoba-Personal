// --- Background Otomatis Hero Section ---
const heroBanner = document.querySelector('.hero-banner');
const bgImages = [
  'https://freakins.com/cdn/shop/files/DSC04638.jpg?v=1750064840',
  'https://i.pinimg.com/736x/06/d1/17/06d1175171292ddf7313b8fc02cafea4.jpg',
  'https://i.pinimg.com/736x/1f/1d/5f/1f1d5f3d14e4cf764e91e020ce88d553.jpg'
];
let currentIndex = 0;

function changeBackground() {
  if (heroBanner) {
    heroBanner.style.backgroundImage = `url('${bgImages[currentIndex]}')`;
    heroBanner.style.backgroundSize = "cover";
    heroBanner.style.backgroundPosition = "center";
    currentIndex = (currentIndex + 1) % bgImages.length;
  }
}
setInterval(changeBackground, 4000);
changeBackground();

// --- Navigasi aktif ---
const navLinks = document.querySelectorAll('.button-group .nav-link');
const currentPage = window.location.pathname;
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && currentPage.includes(href)) {
    link.classList.add('active');
  }
});

// --- Deteksi halaman & data ---
let dataDipakai = [];
if (currentPage.includes("produk.html")) {
  dataDipakai = typeof produkData !== "undefined" ? produkData : [];
} else if (currentPage.includes("wanita.html")) {
  dataDipakai = typeof produkWanita !== "undefined" ? produkWanita : [];
} else if (currentPage.includes("pria.html")) {
  dataDipakai = typeof produkPria !== "undefined" ? produkPria : [];
} else if (currentPage.includes("sepatu.html")) {
  dataDipakai = typeof produkSepatu !== "undefined" ? produkSepatu : [];
} else if (currentPage.includes("flash-sale.html")) {
  dataDipakai = typeof produkFlashSale !== "undefined" ? produkFlashSale : [];
} else {
  console.warn("Halaman tidak dikenali atau data tidak tersedia.");
}

// --- Tambah ke Keranjang ---
function tambahKeKeranjang(produk) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjang.push(produk);
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  updateJumlahKeranjang();
  tampilkanNotifikasi(`${produk.nama} berhasil ditambahkan ke keranjang`);
}

function tampilkanNotifikasi(pesan) {
  const notif = document.getElementById("notifikasi");
  if (!notif) return;
  notif.textContent = pesan;
  notif.classList.add("muncul");
  setTimeout(() => notif.classList.remove("muncul"), 2500);
}

// --- Modal Beli ---
function showModal(links) {
  const modal = document.getElementById("productModal");
  const linkArea = document.getElementById("modalLinks");
  if (!modal || !linkArea) return;

  linkArea.innerHTML = "";
  const marketplaces = {
    shopee: "Shopee",
    tokopedia: "Tokopedia",
    zara: "ZARA",
    uniqlo: "UNIQLO",
    hnm: "H&M"
  };

  Object.keys(marketplaces).forEach(key => {
    if (links[key]) {
      const a = document.createElement('a');
      a.href = links[key];
      a.target = "_blank";
      a.textContent = `Beli di ${marketplaces[key]}`;
      linkArea.appendChild(a);
    }
  });

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.style.display = "none";
}

// --- Render Produk ---
const produkList = document.getElementById("produkList");
function tampilkanProduk(data) {
  if (!produkList) return;
  produkList.innerHTML = "";

  data.forEach((produk) => {
    if (currentPage.includes("flash-sale.html") && !produk.diskon) return;

    const item = document.createElement("div");
    item.className = "produk-item";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";

    const image = document.createElement("img");
    image.src = produk.gambar;
    image.alt = produk.nama;
    image.addEventListener("click", () => {
      window.location.href = `detail-produk.html?id=${produk.id}`;
    });
    imageWrapper.appendChild(image);

    if (produk.diskon) {
      const badge = document.createElement("span");
      badge.className = "badge-diskon";
      badge.textContent = `-${produk.diskon}%`;
      imageWrapper.appendChild(badge);
    }

    item.appendChild(imageWrapper);

    const title = document.createElement("p");
    title.textContent = produk.nama;
    title.addEventListener("click", () => {
      window.location.href = `detail-produk.html?id=${produk.id}`;
    });
    item.appendChild(title);

    const price = document.createElement("p");
    price.textContent = produk.harga;
    item.appendChild(price);

    const tombolGroup = document.createElement("div");
    tombolGroup.className = "button-group";

    const beliBtn = document.createElement("button");
    beliBtn.textContent = "Beli Sekarang";
    beliBtn.onclick = () => showModal(produk.links);
    tombolGroup.appendChild(beliBtn);

    const keranjangBtn = document.createElement("button");
    keranjangBtn.textContent = "Tambah ke Keranjang";
    keranjangBtn.onclick = () => tambahKeKeranjang(produk);
    tombolGroup.appendChild(keranjangBtn);

    item.appendChild(tombolGroup);
    produkList.appendChild(item);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (dataDipakai.length > 0) {
    tampilkanProduk(dataDipakai);
    updateJumlahKeranjang();
  }
});

// --- Filter Kategori ---
const tombolFilter = document.querySelectorAll(".filter-kategori button");
if (tombolFilter.length > 0) {
  tombolFilter.forEach(button => {
    button.addEventListener("click", () => {
      tombolFilter.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const kategori = button.getAttribute("data-kategori");
      const dataTampil = kategori === "Semua"
        ? dataDipakai
        : dataDipakai.filter(produk => produk.kategori === kategori);

      tampilkanProduk(dataTampil);
    });
  });
}

// --- Badge Keranjang ---
function updateJumlahKeranjang() {
  const keranjangLink = document.querySelector('a[href="keranjang.html"]');
  if (!keranjangLink) return;
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  keranjangLink.textContent = keranjang.length > 0 ? `Keranjang [${keranjang.length}]` : "Keranjang";
}
