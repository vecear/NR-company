// Theme detector - runs in ISOLATED world to communicate with background script

(function () {
    'use strict';

    // Detect and report theme
    function reportTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        chrome.runtime.sendMessage({ type: 'THEME_CHANGE', isDark });
    }

    // Report on load
    reportTheme();

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        chrome.runtime.sendMessage({ type: 'THEME_CHANGE', isDark: e.matches });
    });
})();
