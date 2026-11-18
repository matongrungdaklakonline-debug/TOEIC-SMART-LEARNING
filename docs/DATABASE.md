# Thiết kế Cơ sở Dữ liệu — TOEIC Master

Cấu trúc dữ liệu quan hệ chuẩn hóa được thiết kế tương thích 1:1 giữa hệ thống lưu trữ Runtime (`data/curriculum` + `data/user-store.json`) và lược đồ 15 bảng Google Sheets khi xuất/triển khai mở rộng.

## Sơ đồ 15 Bảng (Sheets / Entities)

| STT | Bảng | Khóa chính | Khóa ngoại / Liên kết | Mô tả |
|---|---|---|---|---|
| 1 | `Users` | `userId` | — | Hồ sơ học viên / admin (`role`: `student` \| `admin`, streak, ngày học gần nhất) |
| 2 | `Parts` | `partId` | — | Danh mục Part 1, 2, 3, 4, 6, 7 (ghi rõ Part 5 không có trong giáo trình) |
| 3 | `Situations` | `situationId` | `partId`, `topicId` | Toàn bộ 220 tình huống (Part 3, 4, 6, 7) + 5 nhóm Part 1 + 5 nhóm Part 2 |
| 4 | `Vocabulary` | `vocabId` | — | Ngân hàng từ vựng chuẩn hóa không trùng lặp (`word`, `pos`, `viMeaning`, `sourceType`) |
| 5 | `Synonyms` | `synId` | `vocabId` | Từ đồng nghĩa / cách diễn đạt tương đương (`sourceType`: curriculum vs extended) |
| 6 | `Antonyms` | `antId` | `vocabId` | Từ trái nghĩa & cặp từ dễ nhầm (`confusingPair`) |
| 7 | `Examples` | `exampleId` | `vocabId`, `situationId` | Câu ví dụ ngữ cảnh gắn liên kết tình huống |
| 8 | `Questions` | `questionId` | `situationId`, `partId` | Ngân hàng câu hỏi luyện tập (Part 1–7) gắn nhãn rõ nguồn luyện tập mở rộng |
| 9 | `AnswerOptions` | `optionId` | `questionId` | Các lựa chọn A/B/C/D kèm `isCorrect`, `trapReason` |
| 10 | `LearningProgress` | `progressId` | `userId`, `situationId` | Trạng thái học từng tình huống (`not_started`, `in_progress`, `completed`, `lastStep`) |
| 11 | `ReviewSchedule` | `reviewId` | `userId`, `targetId` | Lịch ôn tập SM-2 (`easinessFactor`, `interval`, `repetitions`, `nextReviewAt`, `status`) |
| 12 | `QuizAttempts` | `attemptId` | `userId` | Lịch sử làm bài kiểm tra (điểm số, tỷ lệ đúng, thời gian làm, phân tích theo Part) |
| 13 | `UserMistakes` | `mistakeId` | `userId`, `questionId`, `attemptId` | Sổ lỗi học viên (`selectedOption`, `errorCategory`, `situationId`) |
| 14 | `Media` | `mediaId` | `situationId` | Tài nguyên hình ảnh minh họa Part 1 & cấu hình transcript audio |
| 15 | `Settings` | `settingKey` | `userId` | Cấu hình tốc độ nghe, mục tiêu ngày, lộ trình 6 tuần |

## Nguyên tắc Thuật toán SM-2 (Module 9)
Với mỗi mục (`vocab` hoặc `situation`), chất lượng hồi tưởng $q \in \{0, 2, 4, 5\}$ tương ứng:
- **Quên hoàn toàn** ($q=0$): `repetitions = 0`, `interval = 0` (ôn lại ngay trong ngày / hôm sau), `status = 'needs_review'`
- **Khó nhớ** ($q=2$): `repetitions = 1`, `interval = 1` ngày, giảm `EF`, `status = 'learning'`
- **Nhớ được** ($q=4$): tăng `repetitions`, `interval = 1` (lần 1) $\to$ `6` (lần 2) $\to$ `round(interval * EF)`, `status = 'learning'` hoặc `'mastered'` nếu `repetitions >= 3 && interval >= 14`
- **Dễ dàng** ($q=5$): tăng `EF`, `interval = max(4, round(interval * EF * 1.3))`, `status = 'mastered'` nếu `repetitions >= 2`
Công thức cập nhật Ease Factor:
$$EF' = \max(1.3,\ EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02)))$$
