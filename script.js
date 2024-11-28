document.addEventListener('DOMContentLoaded', () => {
    const weeksContainer = document.getElementById('weeks-container');
    const fileList = document.getElementById('file-list');
    const currentWeekTitle = document.getElementById('current-week');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const closePreview = document.getElementById('close-preview');

    let currentWeek = 1;
    let files = JSON.parse(localStorage.getItem('files')) || {};

    // Create week folders
    for (let i = 1; i <= 18; i++) {
        const weekFolder = document.createElement('div');
        weekFolder.classList.add('week-folder');
        weekFolder.textContent = `Semana ${i}`;
        weekFolder.addEventListener('click', () => loadWeekFiles(i));
        weeksContainer.appendChild(weekFolder);
    }

    // Load files for a specific week
    function loadWeekFiles(weekNumber) {
        currentWeek = weekNumber;
        currentWeekTitle.textContent = `Semana ${weekNumber}`;
        updateFileList();
    }

    // Update file list display
    function updateFileList() {
        fileList.innerHTML = '';
        const weekFiles = files[currentWeek] || [];
        weekFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerHTML = `
                <img src="${file.content}" alt="${file.name}" title="${file.name}">
                <span>${file.name}</span>
                <button class="delete-btn" data-name="${file.name}">Eliminar</button>
            `;
            fileList.appendChild(fileItem);

            // Add click event to show image preview
            fileItem.querySelector('img').addEventListener('click', () => showImagePreview(file.content));
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteFile(e.target.dataset.name));
        });
    }

    // Show image preview
    function showImagePreview(src) {
        previewImage.src = src;
        imagePreview.classList.remove('hidden');
    }

    // Close image preview
    closePreview.addEventListener('click', () => {
        imagePreview.classList.add('hidden');
    });

    // Upload files
    uploadBtn.addEventListener('click', () => {
        const newFiles = Array.from(fileInput.files);
        if (newFiles.length === 0) return;

        if (!files[currentWeek]) {
            files[currentWeek] = [];
        }

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                files[currentWeek].push({
                    name: file.name,
                    content: e.target.result
                });
                saveFiles();
                updateFileList();
            };
            reader.readAsDataURL(file);
        });

        fileInput.value = '';
    });

    // Delete file
    function deleteFile(fileName) {
        files[currentWeek] = files[currentWeek].filter(file => file.name !== fileName);
        saveFiles();
        updateFileList();
    }

    // Save files to localStorage
    function saveFiles() {
        localStorage.setItem('files', JSON.stringify(files));
    }

    // Initial load
    loadWeekFiles(1);
});