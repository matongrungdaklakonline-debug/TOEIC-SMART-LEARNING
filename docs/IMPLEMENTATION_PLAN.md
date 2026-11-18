# Kế hoạch Triển khai — TOEIC Master Smart Learning System

## Giai đoạn 1: Audit Project & Tài liệu (Hoàn tất)
- Kiểm tra cấu trúc project hiện hữu và 2 file PDF giáo trình gốc.
- Xuất báo cáo `docs/CONTENT_AUDIT.md`.

## Giai đoạn 2: Thiết kế Kiến trúc & Cơ sở Dữ liệu (Hoàn tất)
- Thiết kế kiến trúc Full-stack (`docs/ARCHITECTURE.md`) và lược đồ dữ liệu 15 bảng (`docs/DATABASE.md`).

## Giai đoạn 3: Nhập & Kiểm định Toàn bộ Dữ liệu Giáo trình
- Trích xuất 100% dữ liệu từ 2 file PDF vào `src/data/`:
  - `src/data/part1And2.ts`: 5 nhóm cảnh Part 1 (action verbs, prepositions, traps, 5 hình minh họa), 5 dạng câu hỏi Part 2 (examples, golden phrases, traps), Backbone topics & 6-week roadmap.
  - `src/data/situationsPart3.ts`: Đủ 55 tình huống Part 3 (1–55) nguyên bản.
  - `src/data/situationsPart4.ts`: Đủ 55 tình huống Part 4 (1–55) nguyên bản.
  - `src/data/situationsPart6.ts`: Đủ 55 tình huống Part 6 (1–55) nguyên bản.
  - `src/data/situationsPart7.ts`: Đủ 55 tình huống Part 7 (1–55) nguyên bản.
  - `src/data/vocabulary.ts`: Tổng hợp tự động ngân hàng từ vựng chuẩn hóa không trùng lặp, liên kết tới các tình huống tương ứng, tích hợp đồng nghĩa/trái nghĩa/ví dụ từ giáo trình.
  - `src/data/practiceBank.ts`: Ngân hàng bài tập luyện tập tương tác (gắn nhãn rõ nội dung luyện tập mở rộng) cho Part 1, 2, 3, 4, 6, 7.
- Xuất báo cáo kiểm định `docs/DATA_VALIDATION.md` bằng script kiểm tra tự động.

## Giai đoạn 4 & 5: Xây dựng MVP & Smart Learning
- Backend `server.ts` với Express + lưu trữ bền vững `data/user-store.json` + API tiến độ, SM-2, Quiz, Mistakes, Admin CRUD, Export CSV/JSON Google Sheets.
- Frontend đầy đủ Module 1–11 (Dashboard, Part 1, Part 2, Part 3/4/6/7, Vocabulary Master, Smart Review SM-2, Quiz Engine, Progress Tracker với Chart.js).

## Giai đoạn 6: AI Tutor & Admin Panel
- Tích hợp `@google/genai` (`gemini-4-hydrogen`) tại `/api/ai/tutor` cho Module 12 (phân tích từ vựng, bẫy, sinh câu hỏi luyện tập theo ngữ cảnh giáo trình).
- Hoàn thiện Module 13 (Admin Panel với phân quyền Student/Admin, kiểm tra trùng lặp, xuất/nhập dữ liệu).

## Giai đoạn 7: Kiểm thử & Hoàn thiện
- Chạy script kiểm định dữ liệu 220 tình huống, kiểm tra API, build `npm run build` và `npm run lint`.
- Bổ sung tài liệu triển khai `docs/DEPLOYMENT.md`.
