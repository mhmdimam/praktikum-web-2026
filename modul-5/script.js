// File: script.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const floatingNotification = document.querySelector("#floatingNotification");
    
    // Elemen DOM Baru untuk Fitur 1 dan Fitur 2
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
 
    // Fungsi untuk menampilkan notifikasi mengambang
    const showNotification = (message) => {
        floatingNotification.textContent = message;
        floatingNotification.classList.add("show");
        
        // Hilangkan notifikasi setelah 3 detik
        setTimeout(() => {
            floatingNotification.classList.remove("show");
        }, 3000);
    };

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // 3. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();
        
        // Fitur 1: Perbarui teks Penghitung Jumlah Tugas
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const incomplete = total - completed;
        taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${incomplete}`;

        // Fitur 2: Tampilkan atau sembunyikan tombol "Bersihkan Tugas Selesai"
        clearCompletedBtn.style.display = completed > 0 ? "block" : "none";

        todoList.innerHTML = "";
        
        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            return;
        }
 
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? 'Batal' : 'Selesai'}
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        // Validasi input sederhana (kurang dari 3 karakter)
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }
        
        // Jika valid, hilangkan pesan error input
        taskInput.classList.remove("error");
        inputError.style.display = "none";
        
        // Cek apakah jumlah tugas sudah mencapai batas maksimal (5)
        const tasks = getTasks();
        if (tasks.length >= 5) {
            showNotification("Tidak bisa menambahkan lebih dari 5 tugas!");
            return;
        }
        
        // Simpan tugas baru ke array LocalStorage
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);
        taskInput.value = "";
        renderTasks();
    });
 
    // 5. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
    todoList.addEventListener("click", (e) => {
        const completeBtn = e.target.closest(".complete-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        const tasks = getTasks();

        if (completeBtn) {
            const index = parseInt(completeBtn.dataset.index, 10);
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
        } else if (deleteBtn) {
            // Fitur 3: Konfirmasi Sebelum Menghapus
            if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                const index = parseInt(deleteBtn.dataset.index, 10);
                tasks.splice(index, 1); 
                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // Fitur 2: Tombol Bersihkan Tugas Selesai
    clearCompletedBtn.addEventListener("click", () => {
        let tasks = getTasks();
        // Filter hanya tugas yang berstatus completed: false
        tasks = tasks.filter(task => !task.completed); 
        saveTasks(tasks);
        renderTasks();
    });

    // Render pertama kali saat halaman selesai dimuat
    renderTasks();
});