# KYUDO TORI

> Kyudo Tori  
> 建構一個簡潔且易於使用的查詢介面，讓弓道學習者能快速檢索日本各地的審查資訊

---

## 專案相關連結

- [shinsa-tori](https://github.com/ckwhen/shinsa-tori)：提供審查資料模組

## 開發目標

Kyudo Tori 專案旨在提供：
- 簡潔、直覺的使用者介面
- 快速搜尋與篩選審查資訊
- 清晰的結果呈現（時間、地點、主辦單位、審查段位）
- 可於電腦與手機裝置上使用（RWD）

---

## 技術規劃

| 項目         | 技術                           |
|--------------|--------------------------------|
| Frameworks | React |
| UI | Tailwind CSS |
| API 通訊     | Axios |
| 狀態管理     | React Context / Zustand（視需要 |
| Routing      | Next.js Router |
| 建構工具     | Next.js |
| 型別, Coding Style 管理     | TypeScript / ESLint |

---

## 頁面架構

1. **首頁（Landing Page）**
   - 地區選擇（下拉選單或分區按鈕）
   - 關鍵字搜尋（主辦單位 / 地點）
   - 日期篩選（年、月）
   - 查詢結果列表（可展開細節）

---

## 未來發展
- 支援多語系（i18n）
- 搜尋結果可下載為 CSV / PDF
- 支援審查公告訂閱 / 通知