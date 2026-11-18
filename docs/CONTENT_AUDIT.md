# Báo cáo Kiểm tra Dự án và Nguồn Dữ liệu (Content Audit)

## 1. Hiện trạng Workspace
- **Stack hiện hữu**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Express (`server.ts` chạy cùng `vite.middlewares` trên cổng 3000) + `@google/genai` (backend Gemini API proxy).
- **Tài liệu giáo trình được cung cấp trong `/public/assets/aistudio/`**:
  1. `TOEIC_Hoan_Chinh_B_n_t_ng_h_p___y____v_i_m__r_ng_s_u_Part_1___Part_2_d4c9635e.pdf` (13 trang) — tương ứng tài liệu bổ sung Part 1 & Part 2 và khung xương sống Part 1–7.
  2. `Giao_trinh_TOEIC_220_tinh_huong_1e4d1145.pdf` (54 trang) — bản đồ 220 tình huống TOEIC Part 3, 4, 6, 7 và chiến lược ôn tập 6 tuần.

## 2. Thống kê nội dung giáo trình thực tế
- **Part 1 – Photographs** (Tài liệu 1, trang 2–4 & 6–8):
  - **5 nhóm cảnh phổ biến**:
    1. Văn phòng – Công việc (8 động từ ở Phần A, 6 từ khóa chi tiết ở Part 1 + cặp dễ nhầm)
    2. Ngoài trời – Đường phố – Xây dựng (7 động từ ở Phần A, 6 từ khóa chi tiết ở Part 1 + cặp dễ nhầm)
    3. Nhà hàng – Cửa hàng – Dịch vụ (7 động từ ở Phần A, 6 từ khóa chi tiết ở Part 1 + cặp dễ nhầm)
    4. Giao thông – Sân bay – Nhà ga (3 động từ ở Phần A, 5 từ khóa chi tiết ở Part 1 + cặp dễ nhầm)
    5. Cảnh không có người / Objects & Scenery (6 từ khóa chi tiết + cặp dễ nhầm)
  - **12 giới từ vị trí quan trọng** (`on`, `in`, `at`, `next to / beside`, `between`, `behind`, `in front of`, `under / below`, `above / over`, `against`, `along`, `across from / opposite`) + 4 cặp dễ nhầm vị trí + bẫy Part 1.
- **Part 2 – Question-Response** (Tài liệu 1, trang 4–6 & 8–10):
  - **5 nhóm dạng câu hỏi chính**:
    1. Wh- Questions (Who, What, When, Where, Why, How — bao gồm How long, How much/many, How often)
    2. Yes/No Questions & Indirect Answers
    3. Choice Questions (A or B)
    4. Requests & Offers
    5. Statements (Câu trần thuật)
  - **8 cụm đáp án "vàng" thường đúng** kèm đồng nghĩa, ví dụ hỏi–đáp thực tế và bẫy phổ biến Part 2.
- **Part 3 – Conversations** (Tài liệu 2, trang 2–13):
  - **55 tình huống** (số thứ tự 1 đến 55), đầy đủ tên tình huống, mô tả bối cảnh, 4 từ/cụm từ trọng tâm kèm nghĩa tiếng Việt, bẫy cần tránh và câu hỏi tự kiểm tra khi nghe.
  - Ngoài ra Tài liệu 1 (trang 10–11) bổ sung mở rộng từ khóa/đồng nghĩa/trái nghĩa/ví dụ cho tình huống 11–15 của Part 3.
- **Part 4 – Short Talks** (Tài liệu 2, trang 14–25):
  - **55 tình huống** (số thứ tự 1 đến 55), đầy đủ tên tình huống, mô tả, 4 từ/cụm từ trọng tâm kèm nghĩa tiếng Việt, câu hỏi thường gặp và bẫy cần tránh.
  - Ngoài ra Tài liệu 1 (trang 11–12) bổ sung mở rộng từ khóa/đồng nghĩa/trái nghĩa/ví dụ cho tình huống 1–2 của Part 4.
- **Part 6 – Text Completion** (Tài liệu 2, trang 26–37):
  - **55 tình huống** (số thứ tự 1 đến 55), đầy đủ tên loại văn bản, mô tả, 4 từ/cụm từ trọng tâm kèm nghĩa tiếng Việt, điểm ngữ pháp nên rà, dạng câu hỏi và bẫy.
- **Part 7 – Reading Comprehension** (Tài liệu 2, trang 38–51):
  - **55 tình huống** (số thứ tự 1 đến 55), đầy đủ tên loại tài liệu, mô tả, 4 từ/cụm từ trọng tâm kèm nghĩa tiếng Việt, dạng văn bản (single/double/triple), câu hỏi thường gặp, kỹ năng đọc và bẫy.
- **Khung Xương Sống & Chiến lược** (Tài liệu 1 trang 6, 12–13; Tài liệu 2 trang 52–54):
  - 15 chủ đề xương sống tổng hợp Part 3–4–6–7 (với mức ước lượng sư phạm và từ vựng lõi) + 4 chủ đề mở rộng sâu (collocations, paraphrases, cặp dễ nhầm).
  - Chiến lược ôn tập hiệu quả, Lộ trình 6 tuần gợi ý, Tóm tắt 1 trang.

## 3. Dữ liệu còn thiếu / Lưu ý minh bạch nguồn dữ liệu
1. **Part 5 (Incomplete Sentences)**: Không có trong cả hai tài liệu đầu vào. Hệ thống KHÔNG tạo nội dung Part 5 và hiển thị rõ ràng trạng thái không có giáo trình Part 5.
2. **File Audio MP3 / Hình ảnh đề thi thật / Đề thi đầy đủ câu hỏi A-B-C-D**: Hai file PDF là bản đồ tình huống, từ vựng, bẫy và ví dụ cốt lõi — không chứa file MP3 gốc hay đề thi có sẵn câu hỏi trắc nghiệm cho đủ 220 tình huống.
   - **Giải pháp minh bạch**:
     - Toàn bộ 220 tình huống + Part 1 + Part 2 + Khung xương sống giữ nguyên 100% tên, số thứ tự và trường dữ liệu gốc với nhãn nguồn `Giáo trình gốc`.
     - Audio luyện nghe sử dụng trình tổng hợp giọng nói chuẩn (Web Speech API `speechSynthesis` với điều chỉnh tốc độ 0.75x–1.25x) kèm transcript luyện tập được gắn nhãn rõ `Bài luyện tập mở rộng (mô phỏng theo ngữ cảnh giáo trình)`.
     - Hình ảnh minh họa Part 1 cho 5 nhóm cảnh được gắn nhãn rõ `Ảnh minh họa tình huống luyện tập (không phải ảnh đề thi ETS)`.
     - Câu hỏi trắc nghiệm luyện tập (Part 1, 2, 3, 4, 6, 7) và giải thích AI Tutor được gắn nhãn rõ `Mở rộng luyện tập / AI biên soạn` tách biệt hoàn toàn khỏi trường dữ liệu trích từ giáo trình.
3. **Từ đồng nghĩa / Trái nghĩa / Phiên âm IPA**: Chỉ xuất hiện ở Part 1, Part 2, tình huống mở rộng (Part 3 #11-15, Part 4 #1-2) và phần Chủ đề xương sống. Với các mục chưa có trong giáo trình, hệ thống để trống hoặc đánh dấu rõ chưa có trong tài liệu gốc (không bịa đặt rồi gắn nhãn giáo trình).

## 4. Rủi ro kỹ thuật & Phương án xử lý
- **Rủi ro cấu trúc 220 tình huống trùng lặp từ vựng trọng tâm**: Trong file PDF 220 tình huống, một số tình huống cùng nhóm dùng chung bộ 4 từ khóa gốc (ví dụ `maintenance, malfunction, report, replace`). Cần chuẩn hóa ngân hàng từ vựng (Vocabulary Bank) bằng cách gộp từ duy nhất (`deduplicate` theo từ tiếng Anh) và lưu liên kết nhiều-nhiều (`relatedSituations[]`) tới tất cả các tình huống sử dụng từ đó, tránh trùng lặp flashcard.
- **Rủi ro lưu trữ & mất tiến độ**: Sử dụng Backend Express + lưu trữ bền vững phía server (`/data/store.json` + backup/sync qua API) kết hợp đồng bộ trạng thái học viên & phân quyền Student/Admin rõ ràng.
- **Rủi ro lộ API Key**: Mọi lệnh gọi `@google/genai` (Module AI Tutor) chạy hoàn toàn qua `/api/ai/*` trên Express server dùng `process.env.GEMINI_API_KEY`.
