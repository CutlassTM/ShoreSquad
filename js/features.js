/**
 * ShoreSquad - Enhanced Features Module
 * 
 * Handles:
 * - Event management and filtering
 * - Crew creation and management
 * - User profiles with gamification
 * - Leaderboard system
 * - Badge/achievement tracking
 */

// ==========================================
// DATA STRUCTURES & STORAGE
// ==========================================

const ShoreSquadData = {
    // Sample user profile
    currentUser: {
        id: 1,
        name: 'You',
        role: 'Environmental Advocate',
        avatar: '👤',
        cleanups: 5,
        kgRemoved: 145,
        hoursVolunteered: 24,
        carbonOffset: 82,
        crewSize: 0,
        level: 1,
        xp: 0,
        badges: ['newbie', 'teamwork', 'firstCleanup']
    },

    // Sample events
    events: [
        {
            id: 1,
            title: 'Pasir Ris Beach Cleanup',
            date: '2025-12-07',
            time: '09:00',
            location: 'Pasir Ris Beach',
            participants: 12,
            kgTarget: 50,
            description: 'Join us for a morning beach cleanup!',
            registered: true
        },
        {
            id: 2,
            title: 'East Coast Park Cleanup',
            date: '2025-12-14',
            time: '10:00',
            location: 'East Coast Park',
            participants: 8,
            kgTarget: 40,
            description: 'Help restore East Coast Park!',
            registered: false
        },
        {
            id: 3,
            title: 'Changi Beach Restoration',
            date: '2025-12-21',
            time: '08:30',
            location: 'Changi Beach',
            participants: 15,
            kgTarget: 60,
            description: 'Large-scale cleanup drive',
            registered: false
        },
        {
            id: 4,
            title: 'Semakau Island Cleanup',
            date: '2025-12-28',
            time: '09:00',
            location: 'Semakau Island',
            participants: 20,
            kgTarget: 80,
            description: 'Premium island cleanup experience',
            registered: false
        }
    ],

    // Sample crew members
    crewMembers: [
        { id: 1, name: 'Alex', role: 'Leader', avatar: '👨‍🦰' },
        { id: 2, name: 'Jordan', role: 'Member', avatar: '👩‍🦱' },
        { id: 3, name: 'Casey', role: 'Member', avatar: '👨‍🦲' }
    ],

    // Badge definitions
    badges: {
        newbie: { name: 'Newbie', icon: '🌱', desc: 'Attended first cleanup' },
        teamwork: { name: 'Team Player', icon: '👥', desc: 'Invited 5 friends' },
        firstCleanup: { name: 'Ocean Guardian', icon: '🌊', desc: 'First cleanup completed' },
        eco50: { name: 'Eco Hero', icon: '🦸', desc: '50 kg removed' },
        streak: { name: 'On Fire!', icon: '🔥', desc: '5-day cleanup streak' },
        leader: { name: 'Squad Leader', icon: '👑', desc: 'Created 5 events' }
    },

    // Leaderboard data
    leaderboard: [
        { rank: 1, name: 'Ocean Guardian', kgRemoved: 450, events: 12, badges: 6 },
        { rank: 2, name: 'Beach Hero', kgRemoved: 380, events: 10, badges: 5 },
        { rank: 3, name: 'Eco Warrior', kgRemoved: 320, events: 9, badges: 4 },
        { rank: 4, name: 'Cleanup King', kgRemoved: 285, events: 8, badges: 4 },
        { rank: 5, name: 'Green Advocate', kgRemoved: 245, events: 7, badges: 3 }
    ]
};

// ==========================================
// EVENTS FUNCTIONALITY
// ==========================================

function initEvents() {
    renderEvents('all');
    setupEventFilters();
    document.getElementById('create-event-btn')?.addEventListener('click', handleCreateEvent);
}

function renderEvents(filter = 'all') {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    let filtered = ShoreSquadData.events;
    if (filter === 'upcoming') {
        filtered = ShoreSquadData.events.filter(e => !e.registered);
    } else if (filter === 'registered') {
        filtered = ShoreSquadData.events.filter(e => e.registered);
    }

    grid.innerHTML = filtered.map(event => `
        <div class="event-card">
            <div class="event-header">
                <div class="event-date">${new Date(event.date).toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div class="event-title">${event.title}</div>
            </div>
            <div class="event-body">
                <div class="event-info">
                    <span class="event-info-icon">📍</span>
                    <span>${event.location}</span>
                </div>
                <div class="event-info">
                    <span class="event-info-icon">🕐</span>
                    <span>${event.time}</span>
                </div>
                <div class="event-info">
                    <span class="event-info-icon">🎯</span>
                    <span>Target: ${event.kgTarget} kg</span>
                </div>
                <p>${event.description}</p>
                <div class="event-footer">
                    <span class="event-participants">${event.participants} joined</span>
                    <button class="event-btn" onclick="handleEventRegister(${event.id})">
                        ${event.registered ? '✓ Registered' : 'Register'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupEventFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderEvents(e.target.dataset.filter);
        });
    });
}

function handleEventRegister(eventId) {
    const event = ShoreSquadData.events.find(e => e.id === eventId);
    if (event) {
        event.registered = !event.registered;
        event.participants += event.registered ? 1 : -1;
        renderEvents();
        showNotification(`${event.registered ? 'Registered for' : 'Unregistered from'} ${event.title}!`);
    }
}

function handleCreateEvent() {
    showNotification('Create Event feature coming soon! 🚀');
}

// ==========================================
// CREW FUNCTIONALITY
// ==========================================

function initCrew() {
    renderCrewMembers();
    updateCrewStats();
    document.getElementById('invite-crew-btn')?.addEventListener('click', handleInviteCrew);
}

function renderCrewMembers() {
    const container = document.getElementById('crew-members-list');
    if (!container) return;

    container.innerHTML = ShoreSquadData.crewMembers.map(member => `
        <div class="crew-member">
            <div class="crew-member-avatar">${member.avatar}</div>
            <div class="crew-member-name">${member.name}</div>
            <div class="crew-member-role">${member.role}</div>
        </div>
    `).join('');
}

function updateCrewStats() {
    const user = ShoreSquadData.currentUser;
    document.getElementById('crew-count').textContent = ShoreSquadData.crewMembers.length;
    document.getElementById('crew-level').textContent = user.level;
    document.getElementById('crew-xp').textContent = user.xp;
}

function handleInviteCrew() {
    showNotification('Invite link copied! Share with your friends 🌊');
}

// ==========================================
// PROFILE FUNCTIONALITY
// ==========================================

function initProfile() {
    updateProfileDisplay();
    renderBadges();
    document.getElementById('edit-profile-btn')?.addEventListener('click', handleEditProfile);
    document.getElementById('share-profile-btn')?.addEventListener('click', handleShareProfile);
}

function updateProfileDisplay() {
    const user = ShoreSquadData.currentUser;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-role').textContent = user.role;
    document.getElementById('profile-avatar').textContent = user.avatar;
    document.getElementById('stat-cleanups').textContent = user.cleanups;
    document.getElementById('stat-kg').textContent = `${user.kgRemoved} kg`;
    document.getElementById('stat-hours').textContent = user.hoursVolunteered;
    document.getElementById('stat-carbon').textContent = `${user.carbonOffset} kg`;
}

function renderBadges() {
    const container = document.getElementById('badges-grid');
    if (!container) return;

    const userBadges = ShoreSquadData.currentUser.badges.map(badgeId => ShoreSquadData.badges[badgeId]);

    container.innerHTML = userBadges.map(badge => `
        <div class="badge" title="${badge.desc}">
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
        </div>
    `).join('');
}

function handleEditProfile() {
    showNotification('Edit profile feature coming soon! ✏️');
}

function handleShareProfile() {
    showNotification('Profile shared! 📤');
}

// ==========================================
// LEADERBOARD FUNCTIONALITY
// ==========================================

function initLeaderboard() {
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    tbody.innerHTML = ShoreSquadData.leaderboard.map(entry => {
        let rankClass = '';
        if (entry.rank === 1) rankClass = 'leaderboard-rank-1';
        else if (entry.rank === 2) rankClass = 'leaderboard-rank-2';
        else if (entry.rank === 3) rankClass = 'leaderboard-rank-3';

        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '•';

        return `
            <tr>
                <td class="leaderboard-rank ${rankClass}">${medal} #${entry.rank}</td>
                <td>${entry.name}</td>
                <td>${entry.kgRemoved} kg</td>
                <td>${entry.events}</td>
                <td>${'⭐'.repeat(Math.min(entry.badges, 5))}</td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// INITIALIZATION
// ==========================================

function initEnhancedFeatures() {
    console.log('🌊 Initializing Enhanced ShoreSquad Features...');
    
    initEvents();
    initCrew();
    initProfile();
    initLeaderboard();
    
    console.log('✅ All features initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancedFeatures);
} else {
    initEnhancedFeatures();
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoreSquadData, initEnhancedFeatures };
}
