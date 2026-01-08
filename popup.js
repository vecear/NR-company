// Popup script for NR Preloader

document.addEventListener('DOMContentLoaded', async () => {
    const enableToggle = document.getElementById('enableToggle');
    const exportBtn = document.getElementById('exportBtn');
    const statusEl = document.getElementById('status');

    // Load saved state
    const { enabled = true } = await chrome.storage.local.get('enabled');
    enableToggle.checked = enabled;

    // Toggle enable/disable
    enableToggle.addEventListener('change', async () => {
        const enabled = enableToggle.checked;
        await chrome.storage.local.set({ enabled });

        // Update localStorage in the page context
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url.includes('navigatingradiology.com')) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (isEnabled) => {
                    localStorage.setItem('nr_preloader_enabled', isEnabled);
                    // Dispatch event for content script
                    window.dispatchEvent(new CustomEvent('nr-preloader-toggle', {
                        detail: { enabled: isEnabled }
                    }));
                },
                args: [enabled]
            });
        }

        showStatus(enabled ? '預載已啟用 (重新整理頁面生效)' : '預載已停用', 'info');
    });

    // Right-click Window/Level toggle
    const wlToggle = document.getElementById('wlToggle');
    const { wlEnabled = false } = await chrome.storage.local.get('wlEnabled');
    wlToggle.checked = wlEnabled;

    wlToggle.addEventListener('change', async () => {
        const wlEnabled = wlToggle.checked;
        await chrome.storage.local.set({ wlEnabled });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url.includes('navigatingradiology.com')) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (isEnabled) => {
                    localStorage.setItem('nr_rightclick_wl_enabled', isEnabled);
                    window.dispatchEvent(new CustomEvent('nr-rightclick-wl-toggle', {
                        detail: { enabled: isEnabled }
                    }));
                },
                args: [wlEnabled]
            });
        }

        showStatus(wlEnabled ? '右鍵調整亮度已啟用' : '右鍵調整亮度已停用', 'info');
    });

    // Left-click Pan toggle
    const panToggle = document.getElementById('panToggle');
    const { panEnabled = false } = await chrome.storage.local.get('panEnabled');
    panToggle.checked = panEnabled;

    panToggle.addEventListener('change', async () => {
        const panEnabled = panToggle.checked;
        await chrome.storage.local.set({ panEnabled });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url.includes('navigatingradiology.com')) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (isEnabled) => {
                    localStorage.setItem('nr_leftclick_pan_enabled', isEnabled);
                    window.dispatchEvent(new CustomEvent('nr-leftclick-pan-toggle', {
                        detail: { enabled: isEnabled }
                    }));
                },
                args: [panEnabled]
            });
        }

        showStatus(panEnabled ? '左鍵平移已啟用' : '左鍵平移已停用', 'info');
    });

    // Middle-click Zoom toggle
    const zoomToggle = document.getElementById('zoomToggle');
    const { zoomEnabled = false } = await chrome.storage.local.get('zoomEnabled');
    zoomToggle.checked = zoomEnabled;

    zoomToggle.addEventListener('change', async () => {
        const zoomEnabled = zoomToggle.checked;
        await chrome.storage.local.set({ zoomEnabled });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url.includes('navigatingradiology.com')) {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: (isEnabled) => {
                    localStorage.setItem('nr_middleclick_zoom_enabled', isEnabled);
                    window.dispatchEvent(new CustomEvent('nr-middleclick-zoom-toggle', {
                        detail: { enabled: isEnabled }
                    }));
                },
                args: [zoomEnabled]
            });
        }

        showStatus(zoomEnabled ? '滾輪縮放已啟用' : '滾輪縮放已停用', 'info');
    });

    // Export images
    exportBtn.addEventListener('click', async () => {
        exportBtn.disabled = true;
        exportBtn.textContent = '⏳ 選擇資料夾...';

        try {
            // Ask user to pick a folder
            const dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });

            showStatus('正在匯出影像...', 'info');
            exportBtn.textContent = '⏳ 匯出中...';

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab || !tab.url.includes('navigatingradiology.com')) {
                showStatus('請在 Navigating Radiology 頁面使用此功能', 'error');
                return;
            }

            // Get image data from page
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: getImageDataForExport
            });

            if (!results || !results[0] || !results[0].result) {
                showStatus('無法取得影像資料', 'error');
                return;
            }

            const { success, series, message } = results[0].result;

            if (!success) {
                showStatus(message || '匯出失敗', 'error');
                return;
            }

            // Save images organized by series subfolders
            let savedCount = 0;
            let totalImages = series.reduce((sum, s) => sum + s.images.length, 0);

            for (const seriesData of series) {
                // Create subfolder for this series
                const folderName = seriesData.label.replace(/[<>:"/\\|?*]/g, '_');
                const subDirHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });

                for (let i = 0; i < seriesData.images.length; i++) {
                    try {
                        const img = seriesData.images[i];
                        const fileName = `${String(i + 1).padStart(4, '0')}.png`;

                        const fileHandle = await subDirHandle.getFileHandle(fileName, { create: true });
                        const writable = await fileHandle.createWritable();

                        const base64Data = img.dataUrl.split(',')[1];
                        const binaryData = atob(base64Data);
                        const bytes = new Uint8Array(binaryData.length);
                        for (let j = 0; j < binaryData.length; j++) {
                            bytes[j] = binaryData.charCodeAt(j);
                        }

                        await writable.write(bytes);
                        await writable.close();

                        savedCount++;
                        showStatus(`匯出中... ${savedCount}/${totalImages}`, 'info');
                    } catch (e) {
                        console.warn('Failed to save image:', e);
                    }
                }
            }

            showStatus(`已匯出 ${savedCount} 張影像 (${series.length} 個資料夾)`, 'success');
        } catch (e) {
            if (e.name === 'AbortError') {
                showStatus('已取消選擇', 'info');
            } else {
                console.error('Export error:', e);
                showStatus('匯出時發生錯誤: ' + e.message, 'error');
            }
        } finally {
            exportBtn.disabled = false;
            exportBtn.textContent = '📥 匯出已載入影像';
        }
    });

    function showStatus(message, type) {
        statusEl.textContent = message;
        statusEl.className = 'status ' + type;
    }

    // Master Toggle Logic
    const masterToggle = document.getElementById('masterToggle');

    function updateMasterState() {
        // Master is ON if ALL sub-features are ON
        const allOn = wlToggle.checked && panToggle.checked && zoomToggle.checked;
        masterToggle.checked = allOn;
    }

    masterToggle.addEventListener('change', () => {
        const isChecked = masterToggle.checked;

        // Update all sub-toggles to match master
        if (wlToggle.checked !== isChecked) wlToggle.click();
        if (panToggle.checked !== isChecked) panToggle.click();
        if (zoomToggle.checked !== isChecked) zoomToggle.click();
    });

    // Hook into sub-toggles to update master state
    // We wrap original listeners or just add new ones? 
    // Since 'change' events can have multiple listeners, we add new ones.
    wlToggle.addEventListener('change', updateMasterState);
    panToggle.addEventListener('change', updateMasterState);
    zoomToggle.addEventListener('change', updateMasterState);

    // Initial check
    updateMasterState();
});

// This function runs in the page context - returns image data organized by series
function getImageDataForExport() {
    try {
        if (typeof cornerstone === 'undefined') {
            return { success: false, message: '找不到 Cornerstone' };
        }
        if (typeof window.studydata === 'undefined' || !window.studydata.series) {
            return { success: false, message: '找不到 Study 資料' };
        }

        const imageCache = cornerstone.imageCache;
        if (!imageCache) {
            return { success: false, message: '找不到 Cornerstone 快取' };
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const seriesResults = [];

        // Process each series
        for (const series of window.studydata.series) {
            const seriesImages = [];
            const instances = series.instances || [];

            for (let i = 0; i < instances.length; i++) {
                const inst = instances[i];
                const imageId = inst.url.replace(/^https?:\/\//, 'dicomweb://');

                // Find in cache
                let cachedImage = null;
                if (imageCache._imageCache && imageCache._imageCache[imageId]) {
                    cachedImage = imageCache._imageCache[imageId];
                } else if (imageCache.imageCache && imageCache.imageCache[imageId]) {
                    cachedImage = imageCache.imageCache[imageId];
                }

                if (!cachedImage || !cachedImage.image) continue;

                try {
                    const image = cachedImage.image;
                    const width = image.width || image.columns || 512;
                    const height = image.height || image.rows || 512;

                    canvas.width = width;
                    canvas.height = height;

                    const pixelData = image.getPixelData ? image.getPixelData() : null;
                    if (!pixelData) continue;

                    const imgData = ctx.createImageData(width, height);
                    const windowWidth = image.windowWidth || 400;
                    const windowCenter = image.windowCenter || 40;
                    const minValue = windowCenter - windowWidth / 2;

                    for (let j = 0; j < pixelData.length; j++) {
                        let value = pixelData[j];
                        value = Math.max(0, Math.min(255, ((value - minValue) / windowWidth) * 255));
                        const idx = j * 4;
                        imgData.data[idx] = value;
                        imgData.data[idx + 1] = value;
                        imgData.data[idx + 2] = value;
                        imgData.data[idx + 3] = 255;
                    }

                    ctx.putImageData(imgData, 0, 0);
                    seriesImages.push({
                        index: i,
                        dataUrl: canvas.toDataURL('image/png')
                    });
                } catch (e) {
                    console.warn('Failed to process image:', e);
                }
            }

            if (seriesImages.length > 0) {
                seriesResults.push({
                    label: series.label || series.seriesUID || 'Unknown',
                    images: seriesImages
                });
            }
        }

        if (seriesResults.length === 0) {
            return { success: false, message: '快取中沒有影像' };
        }

        return {
            success: true,
            series: seriesResults
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}
