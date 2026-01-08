# CT Viewer Preloader - Chrome Extension

自動預載 Navigating Radiology 網站上的所有 CT Series/Views。

## 安裝方式

1. 開啟 Chrome，進入 `chrome://extensions/`
2. 開啟右上角的「開發人員模式」
3. 點擊「載入未封裝項目」
4. 選擇這個資料夾 (`ct-preloader-extension`)

## 使用方式

安裝後，當你進入任何 CT case 頁面時，擴充程式會自動：

1. **等待 3 秒** - 讓你正在看的 view 先載入
2. **背景預載其他 views** - 左下角會顯示進度
3. **完成後自動隱藏** - 狀態 UI 會在 5 秒後消失

## 設定調整

如果需要調整，可以編輯 `content.js` 中的 `CONFIG` 物件：

```js
const CONFIG = {
  INITIAL_DELAY_MS: 3000,    // 開始預載前等待時間
  IMAGE_DELAY_MS: 50,        // 每批圖片之間的延遲
  PARALLEL_LOADS: 4,         // 同時載入幾張圖
  SKIP_ACTIVE_SERIES: true   // 跳過目前正在看的 series
};
```

## 運作原理

此擴充程式利用網站已使用的 [Cornerstone.js](https://cornerstonejs.org/) 函式庫：

1. 偵測 `window.studydata` 取得所有 series 的圖片 URL
2. 對每個非當前 series 呼叫 `cornerstone.loadAndCacheImage()`
3. 圖片會被快取，切換 view 時就不用重新載入

## 注意事項

- 需要登入 Navigating Radiology 才能使用
- 預載會使用頻寬，但不會影響當前瀏覽
- 快取上限約 1GB（網站設定）
