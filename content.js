// CT Viewer Preloader - Content Script (runs in MAIN world)
// Preloads all series/views in the background while you view the current one

(function () {
    'use strict';

    const CONFIG = {
        INITIAL_DELAY_MS: 3000,
        IMAGE_DELAY_MS: 50,
        PARALLEL_LOADS: 4,
        SKIP_ACTIVE_SERIES: true
    };

    // Check if extension is enabled (use localStorage as bridge from popup)
    const STORAGE_KEY = 'nr_preloader_enabled';

    function isEnabled() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === null ? true : stored === 'true';
    }

    // Listen for enable/disable from popup (via custom event)
    window.addEventListener('nr-preloader-toggle', (e) => {
        localStorage.setItem(STORAGE_KEY, e.detail.enabled);
        if (!e.detail.enabled) {
            // Remove UI if disabled
            const container = document.getElementById('ct-preloader-status');
            if (container) container.remove();
        }
    });

    // ========== Right-click Window/Level Feature ==========
    const WL_STORAGE_KEY = 'nr_rightclick_wl_enabled';

    function isRightClickWLEnabled() {
        const stored = localStorage.getItem(WL_STORAGE_KEY);
        return stored === 'true';
    }

    // Listen for toggle from popup
    window.addEventListener('nr-rightclick-wl-toggle', (e) => {
        localStorage.setItem(WL_STORAGE_KEY, e.detail.enabled);
        if (e.detail.enabled) {
            enableRightClickWL();
        } else {
            disableRightClickWL();
        }
    });

    // ========== Shared Tool State for Right-click WL and Left-click Pan ==========
    let originalToolId = null;  // The tool active before any custom interaction
    let isDraggingWL = false;
    let isPanDragging = false;

    function simulateClick(element) {
        if (!element) return;

        // Simulating a full user interaction
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
                buttons: 1
            });
            element.dispatchEvent(event);
        });
    }

    function saveOriginalTool() {
        // Don't save if we are already in a temporary tool state
        if (isDraggingWL || isPanDragging || isZoomDragging) return;

        // If we don't have a saved tool, find the current active one
        if (originalToolId === null) {
            const activeBtn = document.querySelector('.tool-btn.active, button.active[id*="tool"]');
            // Ignore if the active tool is one of our temporary tools (just in case)
            if (activeBtn &&
                activeBtn.id !== 'wwwc-tool' &&
                activeBtn.id !== 'pan-tool' &&
                activeBtn.id !== 'zoom-tool') {
                originalToolId = activeBtn.id;
                console.log('[NR Preloader] Saved original tool:', originalToolId);
            }
        }
    }

    function restoreOriginalTool() {
        // Only restore if neither WL nor Pan nor Zoom is still active
        if (!isDraggingWL && !isPanDragging && !isZoomDragging && originalToolId) {
            const toolToRestore = originalToolId;
            originalToolId = null; // Clear first to prevent re-entry

            setTimeout(() => {
                // Double check dragging state hasn't changed
                if (!isDraggingWL && !isPanDragging && !isZoomDragging) {
                    const prevBtn = document.getElementById(toolToRestore);
                    if (prevBtn) {
                        console.log('[NR Preloader] Restoring tool via simulation:', toolToRestore);
                        simulateClick(prevBtn);
                    }
                }
            }, 100);
        }
    }

    // ========== Right-click Window/Level ==========
    let rightClickWLActive = false;

    function enableRightClickWL() {
        if (rightClickWLActive) return;
        rightClickWLActive = true;

        document.addEventListener('contextmenu', handleContextMenu, true);
        document.addEventListener('mousedown', handleRightDown, true);
        document.addEventListener('mouseup', handleRightUp, true);

        console.log('[NR Preloader] Right-click Window/Level enabled');
    }

    function disableRightClickWL() {
        if (!rightClickWLActive) return;
        rightClickWLActive = false;

        document.removeEventListener('contextmenu', handleContextMenu, true);
        document.removeEventListener('mousedown', handleRightDown, true);
        document.removeEventListener('mouseup', handleRightUp, true);

        console.log('[NR Preloader] Right-click Window/Level disabled');
    }

    function handleContextMenu(e) {
        const viewer = e.target.closest('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (viewer) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function handleRightDown(e) {
        if (e.button !== 2) return;

        const viewer = e.target.closest('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (!viewer) return;

        e.preventDefault();
        e.stopPropagation();

        saveOriginalTool();
        isDraggingWL = true;

        const wwwcBtn = document.getElementById('wwwc-tool');
        if (wwwcBtn) {
            wwwcBtn.click();
        }

        setTimeout(() => {
            const leftDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 1,
                clientX: e.clientX,
                clientY: e.clientY
            });
            viewer.dispatchEvent(leftDown);
        }, 10);
    }

    function handleRightUp(e) {
        if (e.button !== 2 || !isDraggingWL) return;

        isDraggingWL = false;

        const viewer = document.querySelector('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (viewer) {
            const leftUp = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 0,
                clientX: e.clientX,
                clientY: e.clientY
            });
            viewer.dispatchEvent(leftUp);
        }

        restoreOriginalTool();
    }

    if (isRightClickWLEnabled()) {
        setTimeout(enableRightClickWL, 2000);
    }

    // ========== Left-click Pan ==========
    const PAN_STORAGE_KEY = 'nr_leftclick_pan_enabled';

    function isLeftClickPanEnabled() {
        const stored = localStorage.getItem(PAN_STORAGE_KEY);
        return stored === 'true';
    }

    window.addEventListener('nr-leftclick-pan-toggle', (e) => {
        localStorage.setItem(PAN_STORAGE_KEY, e.detail.enabled);
        if (e.detail.enabled) {
            enableLeftClickPan();
        } else {
            disableLeftClickPan();
        }
    });

    let leftClickPanActive = false;

    function enableLeftClickPan() {
        if (leftClickPanActive) return;
        leftClickPanActive = true;

        document.addEventListener('mousedown', handlePanDown, true);
        document.addEventListener('mouseup', handlePanUp, true);

        console.log('[NR Preloader] Left-click Pan enabled');
    }

    function disableLeftClickPan() {
        if (!leftClickPanActive) return;
        leftClickPanActive = false;

        document.removeEventListener('mousedown', handlePanDown, true);
        document.removeEventListener('mouseup', handlePanUp, true);

        console.log('[NR Preloader] Left-click Pan disabled');
    }

    function handlePanDown(e) {
        if (e.button !== 0) return; // Only left-click

        // Prevent Pan if Window/Level is currently active (e.g. from the simulated left-click of W/L)
        if (isDraggingWL) return;

        const viewer = e.target.closest('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (!viewer) return;

        saveOriginalTool();
        isPanDragging = true;

        const panBtn = document.getElementById('pan-tool');
        if (panBtn) {
            panBtn.click();
        }
    }

    function handlePanUp(e) {
        if (e.button !== 0 || !isPanDragging) return;

        isPanDragging = false;
        restoreOriginalTool();
    }

    // Auto-enable if was enabled before
    if (isLeftClickPanEnabled()) {
        setTimeout(enableLeftClickPan, 2000);
    }

    // ========== Middle-click Zoom Feature ==========
    const ZOOM_STORAGE_KEY = 'nr_middleclick_zoom_enabled';

    function isMiddleClickZoomEnabled() {
        const stored = localStorage.getItem(ZOOM_STORAGE_KEY);
        return stored === 'true';
    }

    window.addEventListener('nr-middleclick-zoom-toggle', (e) => {
        localStorage.setItem(ZOOM_STORAGE_KEY, e.detail.enabled);
        if (e.detail.enabled) {
            enableMiddleClickZoom();
        } else {
            disableMiddleClickZoom();
        }
    });

    let middleClickZoomActive = false;
    let isZoomDragging = false;

    function enableMiddleClickZoom() {
        if (middleClickZoomActive) return;
        middleClickZoomActive = true;

        document.addEventListener('mousedown', handleZoomDown, true);
        document.addEventListener('mouseup', handleZoomUp, true);

        console.log('[NR Preloader] Middle-click Zoom enabled');
    }

    function disableMiddleClickZoom() {
        if (!middleClickZoomActive) return;
        middleClickZoomActive = false;

        document.removeEventListener('mousedown', handleZoomDown, true);
        document.removeEventListener('mouseup', handleZoomUp, true);

        console.log('[NR Preloader] Middle-click Zoom disabled');
    }

    function handleZoomDown(e) {
        if (e.button !== 1) return; // Only middle-click (button 1)

        const viewer = e.target.closest('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (!viewer) return;

        // Try multiple selectors for the zoom tool
        const zoomBtn = document.getElementById('zoom-tool') ||
            document.getElementById('zoom') ||
            document.querySelector('[title="Zoom"]');

        if (!zoomBtn) {
            // If we can't find the tool, let native behavior take over (fix for "enabled breaks it")
            return;
        }

        // Prevent default scrolling behavior only if we are taking control
        e.preventDefault();
        e.stopPropagation();

        saveOriginalTool();
        isZoomDragging = true;

        zoomBtn.click();

        // Simulate left mouse down
        setTimeout(() => {
            const leftDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 1,
                clientX: e.clientX,
                clientY: e.clientY
            });
            viewer.dispatchEvent(leftDown);
        }, 10);
    }

    function handleZoomUp(e) {
        if (e.button !== 1 || !isZoomDragging) return;

        isZoomDragging = false;

        const viewer = document.querySelector('#dicomImage, .cornerstone-canvas, canvas, .viewport-element');
        if (viewer) {
            // Simulate left mouse up
            const leftUp = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 0,
                clientX: e.clientX,
                clientY: e.clientY
            });
            viewer.dispatchEvent(leftUp);
        }

        restoreOriginalTool();
    }



    // Auto-enable if was enabled before
    if (isMiddleClickZoomEnabled()) {
        setTimeout(enableMiddleClickZoom, 2000);
    }

    // Status UI
    let isMinimized = false;

    function createStatusUI() {
        const container = document.createElement('div');
        container.id = 'ct-preloader-status';
        container.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff88;
      padding: 8px 10px;
      border-radius: 6px;
      font-family: 'Consolas', monospace;
      font-size: 11px;
      z-index: 99999;
      border: 1px solid #00ff88;
      width: 200px;
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.2);
      transition: all 0.3s ease;
      overflow: hidden;
    `;
        container.innerHTML = `
      <div id="preloader-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span id="preloader-title" style="font-weight: bold; font-size: 10px;">🔄 NR Preloader</span>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <button id="preloader-toggle" style="
            background: none;
            border: none;
            color: #00ff88;
            cursor: pointer;
            font-size: 14px;
            padding: 2px 4px;
            line-height: 1;
          ">◀</button>
          <span id="preloader-mini" style="font-size: 9px; display: none;">0/0</span>
        </div>
      </div>
      <div id="preloader-content" style="margin-top: 4px;">
        <div id="preloader-series" style="font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Waiting...</div>
        <div id="preloader-progress" style="font-size: 10px;">0 / 0</div>
        <div id="preloader-bar-container" style="
          width: 100%;
          height: 4px;
          background: #333;
          border-radius: 2px;
          margin-top: 4px;
          overflow: hidden;
        ">
          <div id="preloader-bar" style="
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #00ccff);
            transition: width 0.2s ease;
          "></div>
        </div>
      </div>
    `;
        document.body.appendChild(container);

        // Toggle button handler
        const toggleBtn = document.getElementById('preloader-toggle');
        const content = document.getElementById('preloader-content');
        const title = document.getElementById('preloader-title');
        const mini = document.getElementById('preloader-mini');

        toggleBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                content.style.display = 'none';
                title.style.display = 'none';
                mini.style.display = 'block';
                container.style.width = 'auto';
                container.style.padding = '6px 8px';
                toggleBtn.textContent = '▶';
            } else {
                content.style.display = 'block';
                title.style.display = 'inline';
                mini.style.display = 'none';
                container.style.width = '200px';
                container.style.padding = '8px 10px';
                toggleBtn.textContent = '◀';
            }
        });

        return container;
    }

    function updateStatus(seriesName, loaded, total, completed = false, currentSeries = 0, totalSeries = 0) {
        const seriesEl = document.getElementById('preloader-series');
        const progressEl = document.getElementById('preloader-progress');
        const barEl = document.getElementById('preloader-bar');
        const miniEl = document.getElementById('preloader-mini');

        if (seriesEl) {
            seriesEl.textContent = completed ? '✅ All series preloaded!' : `📁 ${seriesName}`;
            if (completed) {
                seriesEl.style.color = '#00ff88';
            }
        }
        if (progressEl) {
            progressEl.textContent = `${loaded} / ${total} images`;
        }
        if (barEl) {
            barEl.style.width = `${(loaded / total) * 100}%`;
        }
        if (miniEl && totalSeries > 0) {
            miniEl.textContent = `${currentSeries}/${totalSeries}`;
        }
    }

    function hideStatusAfterDelay() {
        setTimeout(() => {
            const container = document.getElementById('ct-preloader-status');
            if (container) {
                container.style.transition = 'opacity 0.5s ease';
                container.style.opacity = '0';
                setTimeout(() => container.remove(), 500);
            }
        }, 5000);
    }

    // Wait for studydata and cornerstone
    function waitForDeps(callback, maxAttempts = 50) {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof window.studydata !== 'undefined' &&
                typeof window.cornerstone !== 'undefined' &&
                window.studydata.series &&
                window.studydata.series.length > 0) {
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(check, 200);
            } else {
                console.log('[CT Preloader] Dependencies not found, aborting.');
            }
        };
        check();
    }

    // Get currently active series UID
    function getActiveSeriesUID() {
        const activeThumb = document.querySelector('.series-thumb.active, .series-thumb[class*="active"]');
        if (activeThumb) {
            return activeThumb.dataset.seriesId;
        }
        return window.studydata.series[0]?.seriesUID;
    }

    // Preload images for a series
    async function preloadSeries(series, updateProgress) {
        const instances = series.instances || [];
        let loaded = 0;

        const imageIds = instances.map(inst => inst.url.replace(/^https?:\/\//, 'dicomweb://'));

        for (let i = 0; i < imageIds.length; i += CONFIG.PARALLEL_LOADS) {
            const batch = imageIds.slice(i, i + CONFIG.PARALLEL_LOADS);

            await Promise.all(batch.map(async (imageId) => {
                try {
                    await new Promise((resolve, reject) => {
                        const deferred = window.cornerstone.loadAndCacheImage(imageId);
                        if (deferred && typeof deferred.done === 'function') {
                            deferred.done(resolve).fail(reject);
                        } else if (deferred && typeof deferred.then === 'function') {
                            deferred.then(resolve, reject);
                        } else {
                            resolve();
                        }
                    });
                    loaded++;
                } catch (e) {
                    console.warn('[CT Preloader] Failed to load:', imageId);
                    loaded++;
                }
                updateProgress(loaded);
            }));

            if (i + CONFIG.PARALLEL_LOADS < imageIds.length) {
                await new Promise(r => setTimeout(r, CONFIG.IMAGE_DELAY_MS));
            }
        }

        return loaded;
    }

    // Main execution
    console.log('[NR Preloader] Extension loaded, waiting for dependencies...');

    // Check if enabled
    if (!isEnabled()) {
        console.log('[NR Preloader] Extension is disabled, skipping preload.');
        return;
    }

    waitForDeps(() => {
        console.log('[NR Preloader] Dependencies found, starting preload...');

        const statusUI = createStatusUI();
        const activeUID = getActiveSeriesUID();

        // Calculate total images across ALL series
        const allSeries = window.studydata.series;
        const grandTotal = allSeries.reduce((sum, s) => sum + (s.instances?.length || 0), 0);

        // Only preload non-active series
        const seriesToPreload = allSeries.filter(s =>
            !CONFIG.SKIP_ACTIVE_SERIES || s.seriesUID !== activeUID
        );

        // Count images already loaded (current series)
        const currentSeriesImages = grandTotal - seriesToPreload.reduce((sum, s) => sum + (s.instances?.length || 0), 0);

        if (seriesToPreload.length === 0) {
            updateStatus('No other series to preload', grandTotal, grandTotal, true, allSeries.length, allSeries.length);
            return;
        }

        let overallLoaded = currentSeriesImages; // Start from current series count

        console.log(`[NR Preloader] Will preload ${seriesToPreload.length} series, total ${grandTotal} images`);

        setTimeout(async () => {
            const totalSeriesCount = allSeries.length;
            let currentSeriesIndex = allSeries.length - seriesToPreload.length; // Start after current

            for (const series of seriesToPreload) {
                currentSeriesIndex++;
                updateStatus(series.label || series.seriesUID, overallLoaded, grandTotal, false, currentSeriesIndex, totalSeriesCount);

                await preloadSeries(series, (count) => {
                    overallLoaded++;
                    updateStatus(series.label || series.seriesUID, overallLoaded, grandTotal, false, currentSeriesIndex, totalSeriesCount);
                });

                console.log(`[NR Preloader] Finished ${series.label}: loaded images`);
            }

            updateStatus('', grandTotal, grandTotal, true, totalSeriesCount, totalSeriesCount);
            console.log('[CT Preloader] All series preloaded!');
        }, CONFIG.INITIAL_DELAY_MS);
    });
})();
