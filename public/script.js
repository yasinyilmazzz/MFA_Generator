document.addEventListener('DOMContentLoaded', () => {
    const generatedCode = document.getElementById('generatedCode');
    const copyButton = document.getElementById('copyButton');
    const secretInput = document.getElementById('secretInput');
    const generateButton = document.getElementById('generateButton');
    const saveButton = document.getElementById('saveButton');
    const saveModal = document.getElementById('saveModal');
    const titleInput = document.getElementById('titleInput');
    const confirmSave = document.getElementById('confirmSave');
    const cancelSave = document.getElementById('cancelSave');
    const importButton = document.getElementById('importButton');
    const exportButton = document.getElementById('exportButton');
    const savedCodes = document.getElementById('savedCodes');
    const countdown = document.getElementById('countdown');
    const editModal = document.getElementById('editModal');
    const editTitleInput = document.getElementById('editTitleInput');
    const confirmEdit = document.getElementById('confirmEdit');
    const cancelEdit = document.getElementById('cancelEdit');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    let currentSecret = '';
    let countdownInterval = null;
    let timeLeft = 30;
    let editingTitle = '';
    let deletingTitle = '';

    // Generate TOTP code
    async function generateCode(secret) {
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ secret }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate code');
            }
            
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Error generating code:', error);
            return '------';
        }
    }

    // Update code display
    async function updateCodeDisplay() {
        if (currentSecret) {
            const code = await generateCode(currentSecret);
            generatedCode.textContent = code;
            startCountdown();
        } else {
            generatedCode.textContent = '------';
            stopCountdown();
        }
    }

    // Countdown functions
    function startCountdown() {
        stopCountdown();
        timeLeft = 30;
        updateCountdownDisplay();
        
        countdownInterval = setInterval(() => {
            timeLeft--;
            updateCountdownDisplay();
            
            if (timeLeft <= 0) {
                updateCodeDisplay();
            }
        }, 1000);
    }

    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    function updateCountdownDisplay() {
        countdown.textContent = timeLeft;
    }

    // Copy code to clipboard
    copyButton.addEventListener('click', () => {
        const code = generatedCode.textContent;
        if (code !== '------') {
            navigator.clipboard.writeText(code)
                .then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                })
                .catch(err => console.error('Error copying code:', err));
        }
    });

    // Generate button click handler
    generateButton.addEventListener('click', () => {
        currentSecret = secretInput.value.trim();
        updateCodeDisplay();
    });

    // Save button click handler
    saveButton.addEventListener('click', () => {
        if (currentSecret) {
            saveModal.style.display = 'block';
            titleInput.value = '';
            titleInput.focus();
        }
    });

    // Modal close handlers
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    cancelSave.addEventListener('click', () => closeModal(saveModal));
    cancelEdit.addEventListener('click', () => closeModal(editModal));
    cancelDelete.addEventListener('click', () => closeModal(deleteModal));

    // Save code to localStorage
    confirmSave.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title && currentSecret) {
            const savedData = JSON.parse(localStorage.getItem('mfaCodes') || '{}');
            savedData[title] = currentSecret;
            localStorage.setItem('mfaCodes', JSON.stringify(savedData));
            updateSavedCodesList();
            closeModal(saveModal);
        }
    });

    // Edit code
    function handleEdit(title) {
        editingTitle = title;
        editTitleInput.value = title;
        editModal.style.display = 'block';
        editTitleInput.focus();
    }

    confirmEdit.addEventListener('click', () => {
        const newTitle = editTitleInput.value.trim();
        if (newTitle && newTitle !== editingTitle) {
            const savedData = JSON.parse(localStorage.getItem('mfaCodes') || '{}');
            const secret = savedData[editingTitle];
            delete savedData[editingTitle];
            savedData[newTitle] = secret;
            localStorage.setItem('mfaCodes', JSON.stringify(savedData));
            updateSavedCodesList();
            closeModal(editModal);
        }
    });

    // Delete code
    function handleDelete(title) {
        deletingTitle = title;
        deleteModal.style.display = 'block';
    }

    confirmDelete.addEventListener('click', () => {
        const savedData = JSON.parse(localStorage.getItem('mfaCodes') || '{}');
        delete savedData[deletingTitle];
        localStorage.setItem('mfaCodes', JSON.stringify(savedData));
        updateSavedCodesList();
        closeModal(deleteModal);
    });

    // Update saved codes list
    function updateSavedCodesList() {
        const savedData = JSON.parse(localStorage.getItem('mfaCodes') || '{}');
        savedCodes.innerHTML = '';
        
        Object.keys(savedData).forEach(title => {
            const item = document.createElement('div');
            item.className = 'saved-code-item';
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'saved-code-title';
            titleSpan.textContent = title;
            titleSpan.addEventListener('click', () => {
                currentSecret = savedData[title];
                secretInput.value = currentSecret;
                updateCodeDisplay();
            });
            
            const actions = document.createElement('div');
            actions.className = 'saved-code-actions';
            
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit edit-icon';
            editIcon.title = 'Edit';
            editIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                handleEdit(title);
            });
            
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash delete-icon';
            deleteIcon.title = 'Delete';
            deleteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDelete(title);
            });
            
            actions.appendChild(editIcon);
            actions.appendChild(deleteIcon);
            
            item.appendChild(titleSpan);
            item.appendChild(actions);
            savedCodes.appendChild(item);
        });
    }

    // Import/Export handlers
    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    localStorage.setItem('mfaCodes', JSON.stringify(data));
                    updateSavedCodesList();
                } catch (error) {
                    console.error('Error importing data:', error);
                    alert('Invalid file format');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });

    exportButton.addEventListener('click', () => {
        const data = localStorage.getItem('mfaCodes');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mfa-codes.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Initial load
    updateSavedCodesList();
}); 