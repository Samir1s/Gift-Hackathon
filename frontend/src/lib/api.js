const API_BASE = import.meta.env.VITE_API_URL || 'https://gift-hackathon-vill.onrender.com';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(error.detail || `API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.warn(`API unreachable at ${url}, using fallback data`);
            return null;
        }
        throw error;
    }
}

// ── Auth ──────────────────────────────────────────────────
export async function login(email, password) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function signup(email, password, name) {
    return apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    });
}

export async function getMe() {
    return apiRequest('/api/auth/me');
}

// ── Learn ─────────────────────────────────────────────────
export async function getModules() {
    return apiRequest('/api/learn/modules');
}

export async function getModule(id) {
    return apiRequest(`/api/learn/modules/${id}`);
}

export async function completeLesson(moduleId, lessonId) {
    return apiRequest(`/api/learn/modules/${moduleId}/lessons/${lessonId}/complete`, {
        method: 'POST',
    });
}

export async function getProgress() {
    return apiRequest('/api/learn/progress');
}

export async function getLearnAIAnalysis() {
    return apiRequest('/api/learn/ai-analysis', { method: 'POST' });
}

// ── Playground ────────────────────────────────────────────
export async function getScenarios() {
    return apiRequest('/api/playground/scenarios');
}

export async function startSession(scenarioId) {
    return apiRequest(`/api/playground/session/start?scenario_id=${scenarioId}`, {
        method: 'POST',
    });
}

export async function executeTrade(sessionId, orderType, quantity, scenarioId) {
    return apiRequest(`/api/playground/session/${sessionId}/trade`, {
        method: 'POST',
        body: JSON.stringify({ order_type: orderType, quantity, scenario_id: scenarioId }),
    });
}

export async function getSessionStatus(sessionId) {
    return apiRequest(`/api/playground/session/${sessionId}/status`);
}

export async function getChartData(scenarioId = 'default') {
    return apiRequest(`/api/playground/chart-data?scenario_id=${scenarioId}`);
}

// ── Daily Updates ─────────────────────────────────────────
export async function getNews(category = 'All') {
    return apiRequest(`/api/daily-updates/news?category=${category}`);
}

export async function getAlerts() {
    return apiRequest('/api/daily-updates/alerts');
}

export async function getNewsAIAnalysis(title, description) {
    return apiRequest('/api/daily-updates/ai-analysis', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
    });
}

// ── Portfolio ─────────────────────────────────────────────
export async function getPortfolio() {
    return apiRequest('/api/portfolio/');
}

export async function getPortfolioPerformance() {
    return apiRequest('/api/portfolio/performance');
}

export async function getPortfolioAllocation() {
    return apiRequest('/api/portfolio/allocation');
}

export async function getPortfolioAIReview() {
    return apiRequest('/api/portfolio/ai-review', { method: 'POST' });
}

// ── Chatbot ───────────────────────────────────────────────
export async function sendChatMessage(message, context = 'general') {
    return apiRequest('/api/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
    });
}

export async function clearChatHistory() {
    return apiRequest('/api/chatbot/history', { method: 'DELETE' });
}
