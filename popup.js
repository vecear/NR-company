// Popup script for NR Preloader

document.addEventListener('DOMContentLoaded', async () => {
    const enableToggle = document.getElementById('enableToggle');
    const exportBtn = document.getElementById('exportBtn');
    const statusEl = document.getElementById('status');
    const langSelect = document.getElementById('langSelect');

    const TRANSLATIONS = {
        zh: {
            enablePreload: "啟用預載",
            masterToggle: "同時調整左右鍵",
            wlToggle: "右鍵調整亮度",
            panToggle: "左鍵平移影像",
            exportBtn: "📥 匯出已載入影像",
            msgs: {
                preloadEnabled: "預載已啟用 (重新整理頁面生效)",
                preloadDisabled: "預載已停用",
                wlEnabled: "右鍵調整亮度已啟用",
                wlDisabled: "右鍵調整亮度已停用",
                panEnabled: "左鍵平移已啟用",
                panDisabled: "左鍵平移已停用",
                exporting: "正在匯出影像...",
                exportBtnWait: "⏳ 匯出中...",
                exportBtnPick: "⏳ 選擇資料夾...",
                errorCornerstone: "找不到 Cornerstone",
                errorStudy: "找不到 Study 資料",
                errorCache: "找不到 Cornerstone 快取",
                errorPage: "請在 Navigating Radiology 頁面使用此功能",
                errorNoData: "無法取得影像資料",
                errorExport: "匯出失敗",
                errorGeneric: "匯出時發生錯誤: ",
                cancel: "已取消選擇",
                success: "已匯出 {n} 張影像 ({s} 個資料夾)"
            }
        },
        en: {
            enablePreload: "Enable Preload",
            masterToggle: "Control Both (L/R Click)",
            wlToggle: "Right-click Window/Level",
            panToggle: "Left-click Pan",
            exportBtn: "📥 Export Loaded Images",
            msgs: {
                preloadEnabled: "Preload Enabled (Refresh to apply)",
                preloadDisabled: "Preload Disabled",
                wlEnabled: "Right-click W/L Enabled",
                wlDisabled: "Right-click W/L Disabled",
                panEnabled: "Left-click Pan Enabled",
                panDisabled: "Left-click Pan Disabled",
                exporting: "Exporting images...",
                exportBtnWait: "⏳ Exporting...",
                exportBtnPick: "⏳ Select Folder...",
                errorCornerstone: "Cornerstone not found",
                errorStudy: "Study data not found",
                errorCache: "Cornerstone cache not found",
                errorPage: "Please use on Navigating Radiology page",
                errorNoData: "Could not retrieve image data",
                errorExport: "Export failed",
                errorGeneric: "Error during export: ",
                cancel: "Selection cancelled",
                success: "Exported {n} images ({s} folders)"
            }
        },
        ja: {
            enablePreload: "プリロードを有効化",
            masterToggle: "左右クリック同時制御",
            wlToggle: "右クリック 輝度調整",
            panToggle: "左クリック 画像移動",
            exportBtn: "📥 画像をエクスポート",
            msgs: {
                preloadEnabled: "プリロード有効 (更新して適用)",
                preloadDisabled: "プリロード無効",
                wlEnabled: "右クリック輝度調整 有効",
                wlDisabled: "右クリック輝度調整 無効",
                panEnabled: "左クリック移動 有効",
                panDisabled: "左クリック移動 無効",
                exporting: "エクスポート中...",
                exportBtnWait: "⏳ エクスポート中...",
                exportBtnPick: "⏳ フォルダ選択...",
                errorCornerstone: "Cornerstoneが見つかりません",
                errorStudy: "Studyデータが見つかりません",
                errorCache: "キャッシュが見つかりません",
                errorPage: "Navigating Radiologyページで使用してください",
                errorNoData: "画像データを取得できませんでした",
                errorExport: "エクスポート失敗",
                errorGeneric: "エラー発生: ",
                cancel: "キャンセルされました",
                success: "{n}枚の画像 ({s}フォルダ) をエクスポートしました"
            }
        },
        ko: {
            enablePreload: "미리로드 활성화",
            masterToggle: "좌우 클릭 동시 제어",
            wlToggle: "우클릭 밝기 조절",
            panToggle: "좌클릭 이미지 이동",
            exportBtn: "📥 이미지 내보내기",
            msgs: {
                preloadEnabled: "미리로드 활성화 (새로고침 필요)",
                preloadDisabled: "미리로드 비활성화",
                wlEnabled: "우클릭 밝기 조절 활성화",
                wlDisabled: "우클릭 밝기 조절 비활성화",
                panEnabled: "좌클릭 이동 활성화",
                panDisabled: "좌클릭 이동 비활성화",
                exporting: "내보내는 중...",
                exportBtnWait: "⏳ 내보내는 중...",
                exportBtnPick: "⏳ 폴더 선택...",
                errorCornerstone: "Cornerstone을 찾을 수 없습니다",
                errorStudy: "Study 데이터를 찾을 수 없습니다",
                errorCache: "캐시를 찾을 수 없습니다",
                errorPage: "Navigating Radiology 페이지에서 사용해주세요",
                errorNoData: "이미지 데이터를 가져올 수 없습니다",
                errorExport: "내보내기 실패",
                errorGeneric: "오류 발생: ",
                cancel: "취소됨",
                success: "{n}장 ({s} 폴더) 내보내기 완료"
            }
        },
        es: {
            enablePreload: "Habilitar Precarga",
            masterToggle: "Control Ambos Clics",
            wlToggle: "Clic Derecho Brillo/Contraste",
            panToggle: "Clic Izquierdo Desplazar",
            exportBtn: "📥 Exportar Imágenes",
            msgs: {
                preloadEnabled: "Precarga Activada (Recargar p/ aplicar)",
                preloadDisabled: "Precarga Desactivada",
                wlEnabled: "Clic Derecho W/L Activado",
                wlDisabled: "Clic Derecho W/L Desactivado",
                panEnabled: "Clic Izquierdo Pan Activado",
                panDisabled: "Clic Izquierdo Pan Desactivado",
                exporting: "Exportando imágenes...",
                exportBtnWait: "⏳ Exportando...",
                exportBtnPick: "⏳ Seleccionar Carpeta...",
                errorCornerstone: "No se encontró Cornerstone",
                errorStudy: "No se encontraron datos del estudio",
                errorCache: "No se encontró caché",
                errorPage: "Usar en página de Navigating Radiology",
                errorNoData: "No se pudieron obtener datos de imagen",
                errorExport: "Falló la exportación",
                errorGeneric: "Error al exportar: ",
                cancel: "Cancelado",
                success: "{n} imágenes exportadas ({s} carpetas)"
            }
        },
        de: {
            enablePreload: "Vorladen aktivieren",
            masterToggle: "Beide Klicks steuern",
            wlToggle: "Rechtsklick Helligkeit",
            panToggle: "Linksklick Verschieben",
            exportBtn: "📥 Bilder exportieren",
            msgs: {
                preloadEnabled: "Vorladen aktiviert (Seite neu laden)",
                preloadDisabled: "Vorladen deaktiviert",
                wlEnabled: "Rechtsklick Helligkeit Ein",
                wlDisabled: "Rechtsklick Helligkeit Aus",
                panEnabled: "Linksklick Verschieben Ein",
                panDisabled: "Linksklick Verschieben Aus",
                exporting: "Bilder werden exportiert...",
                exportBtnWait: "⏳ Exportieren...",
                exportBtnPick: "⏳ Ordner wählen...",
                errorCornerstone: "Cornerstone nicht gefunden",
                errorStudy: "Studiendaten nicht gefunden",
                errorCache: "Cache nicht gefunden",
                errorPage: "Bitte auf Navigating Radiology Seite nutzen",
                errorNoData: "Bilddaten konnten nicht abgerufen werden",
                errorExport: "Export fehlgeschlagen",
                errorGeneric: "Fehler beim Export: ",
                cancel: "Abgebrochen",
                success: "{n} Bilder exportiert ({s} Ordner)"
            }
        },
        "zh-CN": {
            enablePreload: "启用预载",
            masterToggle: "同时调整左右键",
            wlToggle: "右键调整亮度",
            panToggle: "左键平移影像",
            exportBtn: "📥 导出已载入影像",
            msgs: {
                preloadEnabled: "预载已启用 (刷新页面生效)",
                preloadDisabled: "预载已停用",
                wlEnabled: "右键调整亮度已启用",
                wlDisabled: "右键调整亮度已停用",
                panEnabled: "左键平移已启用",
                panDisabled: "左键平移已停用",
                exporting: "正在导出影像...",
                exportBtnWait: "⏳ 导出中...",
                exportBtnPick: "⏳ 选择文件夹...",
                errorCornerstone: "找不到 Cornerstone",
                errorStudy: "找不到 Study 数据",
                errorCache: "找不到 Cornerstone 缓存",
                errorPage: "请在 Navigating Radiology 页面使用此功能",
                errorNoData: "无法获取影像数据",
                errorExport: "导出失败",
                errorGeneric: "导出时发生错误: ",
                cancel: "已取消选择",
                success: "已导出 {n} 张影像 ({s} 个文件夹)"
            }
        },
        pt: {
            enablePreload: "Ativar Pré-carregamento",
            masterToggle: "Controlar Ambos (Esq/Dir)",
            wlToggle: "Botão Direito Brilho",
            panToggle: "Botão Esquerdo Panorâmica",
            exportBtn: "📥 Exportar Imagens",
            msgs: {
                preloadEnabled: "Pré-carregamento Ativado (Recarregar p/ aplicar)",
                preloadDisabled: "Pré-carregamento Desativado",
                wlEnabled: "Botão Direito Brilho Ativado",
                wlDisabled: "Botão Direito Brilho Desativado",
                panEnabled: "Botão Esquerdo Pan Ativado",
                panDisabled: "Botão Esquerdo Pan Desativado",
                exporting: "Exportando imagens...",
                exportBtnWait: "⏳ Exportando...",
                exportBtnPick: "⏳ Selecionar Pasta...",
                errorCornerstone: "Cornerstone não encontrado",
                errorStudy: "Dados do estudo não encontrados",
                errorCache: "Cache não encontrado",
                errorPage: "Use na página Navigating Radiology",
                errorNoData: "Não foi possível obter dados da imagem",
                errorExport: "Falha na exportação",
                errorGeneric: "Erro ao exportar: ",
                cancel: "Cancelado",
                success: "{n} imagens exportadas ({s} pastas)"
            }
        },
        id: {
            enablePreload: "Aktifkan Preload",
            masterToggle: "Kontrol Keduanya (Klik Ki/Ka)",
            wlToggle: "Klik Kanan Kecerahan",
            panToggle: "Klik Kiri Geser",
            exportBtn: "📥 Ekspor Gambar",
            msgs: {
                preloadEnabled: "Preload Diaktifkan (Refresh untuk menerapkan)",
                preloadDisabled: "Preload Dinonaktifkan",
                wlEnabled: "Klik Kanan Kecerahan Aktif",
                wlDisabled: "Klik Kanan Kecerahan Nonaktif",
                panEnabled: "Klik Kiri Geser Aktif",
                panDisabled: "Klik Kiri Geser Nonaktif",
                exporting: "Mengekspor gambar...",
                exportBtnWait: "⏳ Mengekspor...",
                exportBtnPick: "⏳ Pilih Folder...",
                errorCornerstone: "Cornerstone tidak ditemukan",
                errorStudy: "Data Study tidak ditemukan",
                errorCache: "Cache tidak ditemukan",
                errorPage: "Gunakan pada halaman Navigating Radiology",
                errorNoData: "Tidak dapat mengambil data gambar",
                errorExport: "Ekspor gagal",
                errorGeneric: "Terjadi kesalahan: ",
                cancel: "Dibatalkan",
                success: "{n} gambar diekspor ({s} folder)"
            }
        },
        hi: {
            enablePreload: "प्री-लोड सक्षम करें",
            masterToggle: "दोनों क्लिक नियंत्रित करें",
            wlToggle: "दायां क्लिक ब्राइटनेस",
            panToggle: "बायां क्लिक पैन",
            exportBtn: "📥 छवियां निर्यात करें",
            msgs: {
                preloadEnabled: "प्री-लोड सक्षम (लागू करने के लिए रीफ्रेश करें)",
                preloadDisabled: "प्री-लोड अक्षम",
                wlEnabled: "दायां क्लिक ब्राइटनेस चालू",
                wlDisabled: "दायां क्लिक ब्राइटनेस बंद",
                panEnabled: "बायां क्लिक पैन चालू",
                panDisabled: "बायां क्लिक पैन बंद",
                exporting: "छवियां निर्यात हो रही हैं...",
                exportBtnWait: "⏳ निर्यात हो रहा है...",
                exportBtnPick: "⏳ फ़ोल्डर चुनें...",
                errorCornerstone: "Cornerstone नहीं मिला",
                errorStudy: "Study डेटा नहीं मिला",
                errorCache: "कैश नहीं मिला",
                errorPage: "कृपया Navigating Radiology पेज पर उपयोग करें",
                errorNoData: "छवि डेटा प्राप्त नहीं किया जा सका",
                errorExport: "निर्यात विफल",
                errorGeneric: "निर्यात के दौरान त्रुटि: ",
                cancel: "रद्द किया गया",
                success: "{n} छवियां निर्यात की गईं ({s} फ़ोल्डर)"
            }
        },
        ms: {
            enablePreload: "Dayakan Pra-muat",
            masterToggle: "Kawal Kedua-duanya (Klik Ki/Ka)",
            wlToggle: "Klik Kanan Kecerahan",
            panToggle: "Klik Kiri Pan",
            exportBtn: "📥 Eksport Imej",
            msgs: {
                preloadEnabled: "Pra-muat Didayakan (Muat semula untuk memohon)",
                preloadDisabled: "Pra-muat Dilumpuhkan",
                wlEnabled: "Klik Kanan Kecerahan Hidup",
                wlDisabled: "Klik Kanan Kecerahan Mati",
                panEnabled: "Klik Kiri Pan Hidup",
                panDisabled: "Klik Kiri Pan Mati",
                exporting: "Mengeksport imej...",
                exportBtnWait: "⏳ Mengeksport...",
                exportBtnPick: "⏳ Pilih Folder...",
                errorCornerstone: "Cornerstone tidak ditemui",
                errorStudy: "Data Study tidak ditemui",
                errorCache: "Cache tidak ditemui",
                errorPage: "Sila gunakan pada halaman Navigating Radiology",
                errorNoData: "Tidak dapat mengambil data imej",
                errorExport: "Eksport gagal",
                errorGeneric: "Ralat semasa eksport: ",
                cancel: "Dibatalkan",
                success: "{n} imej dieksport ({s} folder)"
            }
        }
    };

    let currentLang = 'zh';

    function setLanguage(lang) {
        currentLang = lang;
        langSelect.value = lang;
        chrome.storage.local.set({ language: lang });

        // Update UI
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                el.innerText = TRANSLATIONS[lang][key];
            }
        });
    }

    function getMsg(key, params = {}) {
        let msg = TRANSLATIONS[currentLang].msgs[key] || TRANSLATIONS['zh'].msgs[key];
        Object.keys(params).forEach(k => {
            msg = msg.replace(`{${k}}`, params[k]);
        });
        return msg;
    }

    // Load language preference
    let { language } = await chrome.storage.local.get('language');

    if (!language) {
        // No saved preference, detect system language
        const sysLang = navigator.language.toLowerCase(); // e.g., "en-us", "zh-tw"

        if (sysLang.startsWith('zh')) {
            if (sysLang.includes('cn') || sysLang.includes('hans')) {
                language = 'zh-CN';
            } else {
                language = 'zh'; // Traditional for TW, HK, or generic 'zh'
            }
        } else if (sysLang.startsWith('en')) {
            language = 'en';
        } else if (sysLang.startsWith('hi')) {
            language = 'hi';
        } else if (sysLang.startsWith('es')) {
            language = 'es';
        } else if (sysLang.startsWith('pt')) {
            language = 'pt';
        } else if (sysLang.startsWith('id')) {
            language = 'id';
        } else if (sysLang.startsWith('de')) {
            language = 'de';
        } else if (sysLang.startsWith('ja')) {
            language = 'ja';
        } else if (sysLang.startsWith('ko')) {
            language = 'ko';
        } else if (sysLang.startsWith('ms')) {
            language = 'ms';
        } else {
            language = 'en'; // Default fallback
        }
    }

    setLanguage(language);

    langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

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

        showStatus(enabled ? getMsg('preloadEnabled') : getMsg('preloadDisabled'), 'info');
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

        showStatus(wlEnabled ? getMsg('wlEnabled') : getMsg('wlDisabled'), 'info');
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

        showStatus(panEnabled ? getMsg('panEnabled') : getMsg('panDisabled'), 'info');
    });



    // Export images
    exportBtn.addEventListener('click', async () => {
        exportBtn.disabled = true;
        exportBtn.textContent = getMsg('exportBtnPick');

        try {
            // Ask user to pick a folder
            const dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });

            showStatus(getMsg('exporting'), 'info');
            exportBtn.textContent = getMsg('exportBtnWait');

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab || !tab.url.includes('navigatingradiology.com')) {
                showStatus(getMsg('errorPage'), 'error');
                return;
            }

            // Get image data from page
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                world: 'MAIN',
                func: getImageDataForExport
            });

            if (!results || !results[0] || !results[0].result) {
                showStatus(getMsg('errorNoData'), 'error');
                return;
            }

            const { success, series, message } = results[0].result;

            if (!success) {
                showStatus(message || getMsg('errorExport'), 'error');
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
                        showStatus(`${getMsg('exporting')} ${savedCount}/${totalImages}`, 'info');
                    } catch (e) {
                        console.warn('Failed to save image:', e);
                    }
                }
            }

            showStatus(getMsg('success', { n: savedCount, s: series.length }), 'success');
        } catch (e) {
            if (e.name === 'AbortError') {
                showStatus('已取消選擇', 'info');
            } else {
                console.error('Export error:', e);
                showStatus('匯出時發生錯誤: ' + e.message, 'error');
            }
        } finally {
            exportBtn.disabled = false;
            exportBtn.textContent = TRANSLATIONS[currentLang].exportBtn;
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
        const allOn = wlToggle.checked && panToggle.checked;
        masterToggle.checked = allOn;
    }

    masterToggle.addEventListener('change', () => {
        const isChecked = masterToggle.checked;

        // Update all sub-toggles to match master
        if (wlToggle.checked !== isChecked) wlToggle.click();
        if (panToggle.checked !== isChecked) panToggle.click();
    });

    // Hook into sub-toggles to update master state
    // We wrap original listeners or just add new ones? 
    // Since 'change' events can have multiple listeners, we add new ones.
    wlToggle.addEventListener('change', updateMasterState);
    panToggle.addEventListener('change', updateMasterState);

    // Initial check
    updateMasterState();
});

// This function runs in the page context - returns image data organized by series
function getImageDataForExport() {
    try {
        if (typeof cornerstone === 'undefined') {
            return { success: false, message: 'Cornerstone not found' };
        }
        if (typeof window.studydata === 'undefined' || !window.studydata.series) {
            return { success: false, message: 'Study data not found' };
        }

        const imageCache = cornerstone.imageCache;
        if (!imageCache) {
            return { success: false, message: 'Cache not found' };
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
            return { success: false, message: 'No images in cache' };
        }

        return {
            success: true,
            series: seriesResults
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}
