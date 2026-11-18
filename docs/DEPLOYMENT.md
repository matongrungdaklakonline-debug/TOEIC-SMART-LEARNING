# HƯỚNG DẪN TRIỂN KHAI — TOEIC MASTER SMART LEARNING SYSTEM

## 1. Kiến trúc triển khai thực tế
Ứng dụng sử dụng kiến trúc **Full-stack TypeScript**:
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Chart.js + Web Speech API (`SpeechSynthesis`).
- **Backend**: Node.js + Express (`server.ts`) phục vụ API `/api/*`, lưu trữ bền vững tại `data/user-store.json` và gọi Gemini API qua `@google/genai` ở phía máy chủ.
- **Tương thích Google Sheets**: Module Admin hỗ trợ xuất JSON 15 bảng và CSV chuẩn UTF-8 BOM (`Situations_GoogleSheets.csv`, `Vocabulary_GoogleSheets.csv`) khớp với `docs/DATABASE.md`.

---

## 2. Biến môi trường
Sao chép `.env.example` và cấu hình biến bí mật trên môi trường chạy (AI Studio Secrets / Cloud Run Env):
- `GEMINI_API_KEY`: API key Gemini dùng cho **Module 12 (AI Tutor)** tại endpoint `/api/ai/tutor`. Không bao giờ đưa khóa này xuống mã frontend.
- `NODE_ENV`: Đặt `production` khi chạy bản build.

---

## 3. Chạy phát triển (Development)
```bash
npm install
npm run dev
```
Máy chủ lắng nghe tại cổng `3000` (`http://localhost:3000`), gắn `vite.middlewares` trực tiếp vào Express.

---

## 4. Kiểm tra dữ liệu giáo trình & Build Production
1. Kiểm tra toàn vẹn 220 tình huống, Part 1 & 2, từ vựng và câu luyện tập:
   ```bash
   npx tsx scripts/validateCurriculum.ts
   ```
2. Kiểm tra kiểu TypeScript và build tĩnh:
   ```bash
   npm run lint
   npm run build
   ```
3. Khởi chạy Production:
   ```bash
   NODE_ENV=production npm start
   ```
   (`package.json` chạy `node server.ts` trên cổng `3000`).

---

## 5. Quy trình đồng bộ với Google Sheets (Tùy chọn cho quản trị viên)
1. Chuyển sang vai trò **Admin** ở góc dưới thanh điều hướng.
2. Mở **Admin Panel → Kiểm tra & Xuất dữ liệu**.
3. Nhấn **CSV bảng Situations** hoặc **CSV bảng Vocabulary** (hoặc **Xuất toàn bộ JSON**).
4. Trong Google Sheets, chọn **Tệp → Nhập (Import)** để nạp thẳng các bảng `Situations`, `Vocabulary`, `Questions`, `LearningProgress`, `ReviewSchedule`, `QuizAttempts`, `UserMistakes` mà không lỗi phông tiếng Việt nhờ định dạng UTF-8 BOM.
