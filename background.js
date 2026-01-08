// Background service worker - handles dynamic icon switching based on system theme

// Update icon based on color scheme
function updateIcon(isDark) {
    const suffix = isDark ? 'dark' : 'light';
    chrome.action.setIcon({
        path: {
            "48": `icon48_${suffix}.png`,
            "128": `icon128_${suffix}.png`
        }
    });
    console.log(`[NR Preloader] Icon set to ${suffix} theme`);
}

// Detect system theme using offscreen technique
async function detectAndSetTheme() {
    try {
        // Create a temporary tab to check matchMedia
        // This is a workaround since service workers can't access matchMedia directly

        // For now, we'll use a simple heuristic:
        // Check if it's evening/night time (dark mode likely) or day time (light mode likely)
        const hour = new Date().getHours();
        const isDark = hour < 7 || hour >= 19; // Before 7am or after 7pm = dark

        updateIcon(isDark);
    } catch (e) {
        console.error('[NR Preloader] Error detecting theme:', e);
        // Default to dark theme
        updateIcon(true);
    }
}

// Listen for system color scheme changes via content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'THEME_CHANGE') {
        updateIcon(message.isDark);
        sendResponse({ success: true });
    }
    return true;
});

// Also listen for tab activation to update icon
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url && tab.url.includes('navigatingradiology.com')) {
            // Inject a script to check theme and report back
            chrome.scripting.executeScript({
                target: { tabId: activeInfo.tabId },
                func: () => {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    chrome.runtime.sendMessage({ type: 'THEME_CHANGE', isDark });
                }
            }).catch(() => { });
        }
    } catch (e) { }
});

// Initialize on startup
detectAndSetTheme();

// Re-check every hour
setInterval(detectAndSetTheme, 3600000);
