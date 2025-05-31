// Global Variables - In-Memory Storage
let polls = [
    // Sample data for demonstration
    {
        id: 'demo1',
        title: 'ชอบอาหารประเภทไหนมากที่สุด?',
        description: 'เลือกอาหารที่คุณชอบทานมากที่สุด',
        choices: [
            { id: 'choice1', text: 'อาหารไทย', votes: 15 },
            { id: 'choice2', text: 'อาหารญี่ปุ่น', votes: 8 },
            { id: 'choice3', text: 'อาหารอิตาเลียน', votes: 12 },
            { id: 'choice4', text: 'อาหารเกาหลี', votes: 6 }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: 'demo2',
        title: 'ช่วงเวลาทำงานที่มีประสิทธิภาพมากที่สุด?',
        description: 'เลือกช่วงเวลาที่คุณทำงานได้ดีที่สุด',
        choices: [
            { id: 'choice5', text: 'เช้า (6:00-12:00)', votes: 22 },
            { id: 'choice6', text: 'บ่าย (12:00-18:00)', votes: 18 },
            { id: 'choice7', text: 'เย็น (18:00-24:00)', votes: 9 },
            { id: 'choice8', text: 'กลางคืน (00:00-6:00)', votes: 3 }
        ],
        createdAt: new Date().toISOString()
    }
];
let votedPolls = [];
let currentPollId = null;
let editingPollId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadPolls();
    updateAdminTable();
});

// View Management
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + '-view').classList.add('active');
    
    if (viewName === 'admin') {
        updateAdminTable();
    } else if (viewName === 'polls') {
        loadPolls();
    }
}

// Poll Management
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Data Management (In-Memory Storage)
function savePollsToStorage() {
    // Data is automatically saved in memory
    // No localStorage needed - data persists during session
    console.log('Polls updated in memory:', polls.length);
}

function saveVotedPolls() {
    // Data is automatically saved in memory
    // No localStorage needed - data persists during session
    console.log('Voted polls updated in memory:', votedPolls.length);
}

// Load and Display Polls
function loadPolls() {
    const container = document.getElementById('polls-container');
    
    if (polls.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>ยังไม่มี Poll</h3>
                <p>เริ่มต้นสร้าง Poll แรกของคุณกันเลย!</p>
                <button class="btn btn-primary" onclick="openCreateModal()">➕ สร้าง Poll ใหม่</button>
            </div>
        `;
        return;
    }

    container.innerHTML = polls.map(poll => {
        const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);
        const isVoted = votedPolls.includes(poll.id);
        
        return `
            <div class="poll-card">
                <h3>${poll.title}</h3>
                <p>${poll.description}</p>
                <div class="poll-stats">
                    <span>📊 ${poll.choices.length} ตัวเลือก</span>
                    <span>🗳️ ${totalVotes} โหวต</span>
                </div>
                <button class="btn btn-primary" onclick="showPollDetail('${poll.id}')">
                    ${isVoted ? '📊 ดูผลโหวต' : '🗳️ โหวต'}
                    ${isVoted ? '<span class="voted-badge">โหวตแล้ว</span>' : ''}
                </button>
            </div>
        `;
    }).join('');
}

// Show Poll Detail
function showPollDetail(pollId) {
    currentPollId = pollId;
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    const isVoted = votedPolls.includes(pollId);
    const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);

    let content = `
        <h2>${poll.title}</h2>
        <p>${poll.description}</p>
        <hr style="margin: 20px 0;">
    `;

    if (isVoted || totalVotes > 0) {
        // Show Results
        content += `
            <h3>📊 ผลโหวต</h3>
            <div class="progress-container">
        `;
        
        poll.choices.forEach(choice => {
            const percentage = totalVotes > 0 ? (choice.votes / totalVotes * 100).toFixed(1) : 0;
            content += `
                <div class="choice-item">
                    <div class="choice-label">
                        <span>${choice.text}</span>
                        <span>${choice.votes} โหวต (${percentage}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%">
                            <div class="progress-text">${percentage}%</div>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <strong>รวมทั้งหมด: ${totalVotes} โหวต</strong>
            </div>
        `;
    }

    if (!isVoted) {
        // Show Voting Interface
        content += `
            <h3>🗳️ เลือกตัวเลือกของคุณ</h3>
            <div class="voting-section">
        `;
        
        poll.choices.forEach(choice => {
            content += `
                <button class="choice-button" onclick="vote('${choice.id}')">
                    ${choice.text}
                </button>
            `;
        });

        content += `</div>`;
    }

    document.getElementById('poll-detail-content').innerHTML = content;
    showView('poll-detail');
}

// Voting Function
function vote(choiceId) {
    if (!currentPollId) return;
    
    const poll = polls.find(p => p.id === currentPollId);
    if (!poll) return;

    if (votedPolls.includes(currentPollId)) {
        alert('คุณโหวตใน Poll นี้แล้ว!');
        return;
    }

    const choice = poll.choices.find(c => c.id === choiceId);
    if (choice) {
        choice.votes++;
        votedPolls.push(currentPollId);
        
        savePollsToStorage();
        saveVotedPolls();
        
        // Refresh the poll detail view
        showPollDetail(currentPollId);
        
        // Show success message
        setTimeout(() => {
            alert('โหวตสำเร็จ! ขอบคุณที่ร่วมแสดงความคิดเห็น');
        }, 100);
    }
}

// Modal Management
function openCreateModal() {
    editingPollId = null;
    document.getElementById('modal-title').textContent = 'สร้าง Poll ใหม่';
    document.getElementById('poll-form').reset();
    document.getElementById('choices-list').innerHTML = '';
    addChoice();
    addChoice();
    document.getElementById('poll-modal').style.display = 'block';
}

function openEditModal(pollId) {
    editingPollId = pollId;
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    document.getElementById('modal-title').textContent = 'แก้ไข Poll';
    document.getElementById('poll-title').value = poll.title;
    document.getElementById('poll-description').value = poll.description;
    
    const choicesList = document.getElementById('choices-list');
    choicesList.innerHTML = '';
    
    poll.choices.forEach(choice => {
        addChoice(choice.text);
    });

    document.getElementById('poll-modal').style.display = 'block';
}

function closePollModal() {
    document.getElementById('poll-modal').style.display = 'none';
}

// Choice Management
function addChoice(text = '') {
    const choicesList = document.getElementById('choices-list');
    const choiceDiv = document.createElement('div');
    choiceDiv.className = 'choice-input';
    choiceDiv.innerHTML = `
        <input type="text" placeholder="ป้อนตัวเลือก..." value="${text}" required>
        <button type="button" class="btn btn-danger btn-small" onclick="removeChoice(this)">🗑️</button>
    `;
    choicesList.appendChild(choiceDiv);
}

function removeChoice(button) {
    const choicesList = document.getElementById('choices-list');
    if (choicesList.children.length > 2) {
        button.parentElement.remove();
    } else {
        alert('ต้องมีอย่างน้อย 2 ตัวเลือก');
    }
}

// Save Poll
function savePoll(event) {
    event.preventDefault();
    
    const title = document.getElementById('poll-title').value.trim();
    const description = document.getElementById('poll-description').value.trim();
    
    const choiceInputs = document.querySelectorAll('#choices-list input');
    const choices = Array.from(choiceInputs)
        .map(input => input.value.trim())
        .filter(text => text !== '')
        .map(text => ({
            id: generateId(),
            text: text,
            votes: 0
        }));

    if (choices.length < 2) {
        alert('ต้องมีอย่างน้อย 2 ตัวเลือก');
        return;
    }

    if (editingPollId) {
        // Edit existing poll
        const pollIndex = polls.findIndex(p => p.id === editingPollId);
        if (pollIndex !== -1) {
            polls[pollIndex] = {
                ...polls[pollIndex],
                title: title,
                description: description,
                choices: choices
            };
        }
    } else {
        // Create new poll
        const newPoll = {
            id: generateId(),
            title: title,
            description: description,
            choices: choices,
            createdAt: new Date().toISOString()
        };
        polls.push(newPoll);
    }

    savePollsToStorage();
    closePollModal();
    loadPolls();
    updateAdminTable();
    
    alert(editingPollId ? 'แก้ไข Poll สำเร็จ!' : 'สร้าง Poll สำเร็จ!');
}

// Admin Functions
function updateAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    
    if (polls.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #6c757d;">
                    ยังไม่มี Poll ในระบบ
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = polls.map(poll => {
        const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);
        const createdDate = new Date(poll.createdAt).toLocaleDateString('th-TH');
        
        return `
            <tr>
                <td>${poll.title}</td>
                <td>${poll.choices.length}</td>
                <td>${totalVotes}</td>
                <td>${createdDate}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-small" onclick="showPollDetail('${poll.id}')">👁️ ดู</button>
                        <button class="btn btn-warning btn-small" onclick="openEditModal('${poll.id}')">✏️ แก้ไข</button>
                        <button class="btn btn-danger btn-small" onclick="deletePoll('${poll.id}')">🗑️ ลบ</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function deletePoll(pollId) {
    if (confirm('คุณแน่ใจว่าต้องการลบ Poll นี้?')) {
        polls = polls.filter(p => p.id !== pollId);
        
        // Remove from voted polls as well
        votedPolls = votedPolls.filter(id => id !== pollId);
        
        savePollsToStorage();
        saveVotedPolls();
        updateAdminTable();
        loadPolls();
        
        alert('ลบ Poll สำเร็จ!');
    }
}

// Export/Import Functions
function exportData() {
    const data = {
        polls: polls,
        votedPolls: votedPolls,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `poll-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('📥 Export ข้อมูลสำเร็จ! ไฟล์จะถูกดาวน์โหลด');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.polls && Array.isArray(data.polls)) {
                    polls = data.polls;
                }
                
                if (data.votedPolls && Array.isArray(data.votedPolls)) {
                    votedPolls = data.votedPolls;
                }
                
                loadPolls();
                updateAdminTable();
                
                alert('📤 Import ข้อมูลสำเร็จ!');
            } catch (error) {
                alert('❌ ไฟล์ไม่ถูกต้อง! กรุณาเลือกไฟล์ JSON ที่ถูกต้อง');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('poll-modal');
    if (event.target === modal) {
        closePollModal();
    }
}

// Auto-refresh results every 5 seconds when viewing poll detail
setInterval(() => {
    if (document.getElementById('poll-detail-view').classList.contains('active') && currentPollId) {
        showPollDetail(currentPollId);
    }
}, 5000);