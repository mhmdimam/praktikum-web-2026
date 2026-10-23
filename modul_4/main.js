// File: main.js
// Integrasi Logika Data dan Render ke Elemen DOM

// Mengubah const menjadi let agar array dapat dimanipulasi
let projects = [
 {
 id: 1,
 title: "Sistem Inventaris Keuangan",
 category: "Web App",
 budget: 2500000,
 completed: true
 },
 {
 id: 2,
 title: "Sistem Kasir Digital POS",
 category: "Desktop App",
 budget: 5000000,
 completed: true
 },
 {
 id: 3,
 title: "Landing Page Profil Perusahaan",
 category: "Web App",
 budget: 1500000,
 completed: false
 },
 {
 id: 4,
 title: "Aplikasi Presensi GPS Mobile",
 category: "Mobile App",
 budget: 4500000,
 completed: false
 }
];

// State untuk filter & search agar bisa bekerja secara terpadu
let activeCategory = "Semua";
let searchQuery = "";

const formatRupiah = (angka) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 maximumFractionDigits: 0
 }).format(angka);
};

const updateStats = (dataList) => {
 const totalProjects = dataList.length;
 const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
 const completedCount = dataList.filter(item => item.completed).length;
 document.getElementById("stat-total-projects").textContent = totalProjects;
 document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
 document.getElementById("stat-completed-projects").textContent = completedCount;
};

//Menerapkan filter kategori dan pencarian real-time secara bersamaan
const applyFilters = () => {
 let filteredList = projects;

 // Filter berdasarkan Kategori
 if (activeCategory !== "Semua") {
    filteredList = filteredList.filter(p => p.category === activeCategory);
 }

 // Filter berdasarkan Pencarian teks (Live Search)
 if (searchQuery) {
    filteredList = filteredList.filter(p => p.title.toLowerCase().includes(searchQuery));
 }

 renderProjects(filteredList);
 // Selalu update statistik berdasarkan data global proyek
 updateStats(projects); 
};

// Fungsi aksi untuk ubah status proyek
const toggleStatus = (id) => {
 projects = projects.map(p => p.id === id ? { ...p, completed: !p.completed } : p);
 applyFilters();
};

// Fungsi aksi untuk hapus proyek
const deleteProject = (id) => {
 projects = projects.filter(p => p.id !== id);
 applyFilters();
};

const renderProjects = (filteredList) => {
 const container = document.getElementById("project-list");
 if (!container) return;
 if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang sesuai.</p>";
    return;
 }
 
 const htmlString = filteredList.map(proj => {
 const badgeClass = proj.completed ? "badge-success" : "badge-pending";
 const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
 
 // Penambahan 2 tombol interaktif
 return `
 <div class="project-card">
    <div class="project-info">
        <span class="project-category">${proj.category}</span>
        <h4>${proj.title}</h4>
        <p class="project-budget">${formatRupiah(proj.budget)}</p>
    </div>
    <div class="card-actions">
        <span class="badge ${badgeClass}">${statusText}</span>
        <div class="action-buttons">
            <button class="btn-action btn-toggle" onclick="toggleStatus(${proj.id})">Ubah Status</button>
            <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus</button>
        </div>
    </div>
 </div>
 `;
 }).join("");
 container.innerHTML = htmlString;
};

document.addEventListener("DOMContentLoaded", () => {
 applyFilters(); 

 // Event listener filter Kategori
 const filterButtons = document.querySelectorAll(".btn-filter");
 filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterButtons.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        
        activeCategory = e.target.getAttribute("data-category");
        applyFilters();
    });
 });

 // Event listener live search
 const searchInput = document.getElementById("search-input");
 searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
 });

 // Event listener fitur form handling & validation
 const projectForm = document.getElementById("project-form");
 projectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("input-title").value.trim();
    const category = document.getElementById("input-category").value;
    const budget = Number(document.getElementById("input-budget").value);
    const completed = document.getElementById("input-completed").checked;

    if (!title) {
        alert("Judul proyek tidak boleh kosong!");
        return;
    }
    if (budget <= 0) {
        alert("Estimasi anggaran harus lebih besar dari 0!");
        return;
    }

    // Membuat object data baru
    const newProject = {
        id: Date.now(),
        title,
        category,
        budget,
        completed
    };

    // Memasukkan data ke array menggunakan spread operator
    projects = [...projects, newProject];
    
    // Reset form
    projectForm.reset();
    
    // Render ulang dan perbarui statistik
    applyFilters();
 });
});