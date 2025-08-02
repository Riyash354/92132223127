export function logAction(action, data = {}) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${action}: ${JSON.stringify(data)}`;
    
    // Store it temporarily (e.g., in-memory or session)
    if (!window._logStore) window._logStore = [];
    window._logStore.push(entry);
  }
  