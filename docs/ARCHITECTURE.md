# Kiến trúc Hệ thống — TOEIC Master Smart Learning System

## 1. Tổng quan Kiến trúc
Ứng dụng được xây dựng theo kiến trúc Full-stack TypeScript hiện đại trên nền tảng workspace hiện hữu:
- **Frontend (React 19 + Vite + Tailwind CSS v4 + Chart.js)**:
  - Giao diện đơn trang (SPA) đa module với Sidebar điều hướng cố định trên desktop, Bottom/Drawer navigation mượt mà trên mobile.
  - Quản lý trạng thái người dùng (Student / Admin), tiến độ học tập, lịch ôn tập SM-2, kết quả Quiz và tương tác AI Tutor qua REST API.
  - Hỗ trợ phát âm & hội thoại luyện nghe (Web Speech API với điều chỉnh tốc độ 0.75x / 1.0x / 1.15x / 1.25x).
- **Backend (Express + Node.js / `server.ts`)**:
  - Cung cấp API REST `/api/*` phục vụ dữ liệu giáo trình chuẩn hóa, quản lý tiến độ học viên, thuật toán lặp lại ngắt quãng SM-2, chấm điểm Quiz, quản trị nội dung (Admin CRUD + Export/Import JSON/CSV tương thích Google Sheets) và proxy an toàn tới Gemini API (`@google/genai`).
  - Lưu trữ bền vững tại `data/user-store.json` (tách biệt hoàn toàn khỏi dữ liệu giáo trình bất biến).
- **Dữ liệu Giáo trình Chuẩn hóa (`src/data/`)**:
  - Được trích xuất nguyên vẹn và kiểm định từ 2 tài liệu PDF gốc (`docs/DATA_VALIDATION.md`).

## 2. Phân tách Module Frontend
- `src/components/Sidebar.tsx` & `Header`: Điều hướng 13 module, chuyển đổi vai trò Student/Admin có kiểm soát, tìm kiếm nhanh.
- `src/components/DashboardView.tsx` (Module 1): Tổng quan tiến độ, nút "Tiếp tục học", nhiệm vụ hôm nay, gợi ý bài tiếp theo theo dữ liệu thật.
- `src/components/Part1View.tsx` (Module 2): 5 nhóm cảnh Part 1, ảnh minh họa phân biệt rõ, động từ hành động, 12 giới từ vị trí, bẫy & bài tập nhìn hình nghe mô tả.
- `src/components/Part2View.tsx` (Module 3): 5 dạng câu hỏi Part 2, cụm đáp án "vàng", bẫy phổ biến & bài tập nghe hỏi–đáp.
- `src/components/SituationsView.tsx` (Module 4, 5, 6, 7): Giao diện học chuyên sâu cho đủ 55 tình huống mỗi Part (Part 3, 4, 6, 7) với quy trình từng bước (Bối cảnh → Từ khóa → Diễn đạt tương đương/Ngữ pháp → Audio/Đoạn văn/Tài liệu + Highlight bằng chứng → Câu hỏi luyện tập & Phân tích bẫy → Đánh dấu hoàn thành).
- `src/components/VocabularyView.tsx` (Module 8): Ngân hàng từ vựng tập trung, tìm kiếm, lọc theo Part/chủ đề/trạng thái, Flashcard 2 chiều, luyện đồng nghĩa & cặp dễ nhầm.
- `src/components/SmartReviewView.tsx` (Module 9): Hệ thống ôn tập lặp lại ngắt quãng chuẩn SM-2 với 4 mức đánh giá (Quên hoàn toàn / Khó nhớ / Nhớ được / Dễ dàng).
- `src/components/QuizEngineView.tsx` (Module 10): Trình tạo bài kiểm tra linh hoạt (theo Part, chủ đề xương sống, từ vựng, hỗn hợp, giới hạn thời gian), chấm điểm chi tiết, sổ lỗi và đề xuất bài ôn.
- `src/components/ProgressTrackerView.tsx` (Module 11): Biểu đồ Chart.js theo ngày/tuần/tháng, tỷ lệ chính xác từng Part, nhận diện dạng câu hỏi hay sai và tình huống yếu.
- `src/components/AiTutorView.tsx` (Module 12): Gia sư TOEIC AI kết nối `/api/ai/tutor` — ưu tiên ngữ cảnh giáo trình, tách bạch rõ phần giáo trình gốc và phần AI mở rộng.
- `src/components/AdminPanelView.tsx` (Module 13): Phân quyền Admin (chặn Student), quản lý tình huống mở rộng, câu hỏi, từ vựng, kiểm tra trùng lặp, xuất/nhập JSON & CSV chuẩn Google Sheets.

## 3. Phân quyền và Bảo mật
- **Student**: Học toàn bộ giáo trình, luyện tập, thi thử, ôn tập SM-2, xem thống kê cá nhân, hỏi AI Tutor. Bị chặn truy cập các API `/api/admin/*` (trả mã 403 nếu không có quyền Admin).
- **Admin**: Toàn quyền thêm/sửa/xóa nội dung mở rộng, câu hỏi luyện tập, kiểm tra trùng lặp, xuất/nhập dữ liệu.
- **API Key**: `GEMINI_API_KEY` chỉ được đọc tại `server.ts` qua `process.env.GEMINI_API_KEY`, tuyệt đối không xuất hiện trong bundle frontend.
