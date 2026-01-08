# NR Preloader - Chrome Extension

這是一款專為 Navigating Radiology 設計的 Chrome 擴充功能，能夠自動預載所有 CT 影像，並提供增強的滑鼠控制與多語言介面。

## 主要功能 (Features)

*   **🚀 自動預載 (Automated Preloading)**
    *   自動偵測並背景預載所有 Series 的影像。
    *   具備智能隊列管理，不影響當前閱覽體驗。
    *   預載完成後狀態面板自動收合。
    
*   **🖱️ 增強滑鼠控制 (Enhanced Mouse Controls)**
    *   **右鍵調整亮度 (Right-click W/L)**: 啟用後可使用滑鼠右鍵拖曳來調整 Window/Level。
    *   **左鍵平移影像 (Left-click Pan)**: 啟用後可使用滑鼠左鍵拖曳來平移影像。
    *   **主開關**: 可一鍵開啟/關閉所有滑鼠增強功能。

*   **🌐 多語言支援 (Multi-language Support)**
    *   支援 11 種語言介面：繁體中文、English、简体中文、Español、Deustch、日本語、한국어 等。
    *   **自動偵測**: 首次安裝會自動根據您的系統語言設定最佳顯示語言。

*   **📥 影像匯出 (Image Export)**
    *   可將已載入的 Series 影像批次匯出並儲存。

## 安裝方式 (Installation)

### 方法一：載入 .crx 檔案 (推薦)
1. 從 [Releases](../../releases) 頁面下載最新的 `.crx` 檔案。
2. 開啟 Chrome，進入 `chrome://extensions/`。
3. 將 `.crx` 檔案拖曳進擴充功能頁面即可安裝。

### 方法二：載入未封裝項目 (開發者)
1. 下載或 Clone 此專案。
2. 開啟 Chrome，進入 `chrome://extensions/`。
3. 開啟右上角的「開發人員模式 (Developer mode)」。
4. 點擊「載入未封裝項目 (Load unpacked)」。
5. 選擇本專案資料夾。

## 使用說明 (Usage)

1. **Popup 選單**: 點擊瀏覽器右上角的擴充功能圖示，可開啟設定選單。
    *   可在最上方切換語言。
    *   開關預載功能或滑鼠增強工具。
    *   匯出影像。
2. **狀態面板**: 進入 CT 頁面後，左下角會顯示預載進度面板。
    *   點擊標題可收合/展開面板。
    *   預載完成後會自動最小化。

## 開發 (Development)

若要修改設定，可編輯 `content.js` 中的 `CONFIG`：

```javascript
const CONFIG = {
    INITIAL_DELAY_MS: 3000,    // 初始延遲 (毫秒)
    IMAGE_DELAY_MS: 50,        // 圖片載入間隔 (毫秒)
    PARALLEL_LOADS: 4,         // 同時載入數
    SKIP_ACTIVE_SERIES: true,  // 跳過當前 Series
    RETRY_ATTEMPTS: 3,         // 失敗重試次數
    RETRY_DELAY: 1000          // 重試延遲
};
```

## 注意事項 (Notes)

*   本擴充功能依賴 Cornerstone.js 運作。
*   需要登入 Navigating Radiology 才能正常使用。
*   預載功能會使用額外頻寬，請留意網路環境。
