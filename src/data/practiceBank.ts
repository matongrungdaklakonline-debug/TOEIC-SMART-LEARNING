import type { PracticeQuestion, SituationItem, ToeicPart } from '../types/toeic';
import { PART1_SCENE_GROUPS, PART2_QUESTION_TYPES } from './part1And2';
import { PART3_SITUATIONS } from './situationsPart3';
import { PART4_SITUATIONS } from './situationsPart4';
import { PART6_SITUATIONS } from './situationsPart6';
import { PART7_SITUATIONS } from './situationsPart7';

// All practice questions below are explicitly marked origin: 'extended_practice'
// (Nội dung luyện tập mở rộng bám sát từ vựng, bẫy và ngữ cảnh giáo trình).

export const PART1_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'Q-P1-01',
    part: 'part1',
    situationId: 'P1-01',
    questionType: 'Hành động & Vị trí văn phòng',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[0].imageUrl,
    audioScript: [
      '(A) A woman is writing a memo by hand.',
      '(B) A man is reaching for a folder on a shelf.',
      '(C) The printer is placed on top of the filing cabinet.',
      '(D) Two colleagues are pointing at the window.',
    ],
    prompt: 'Quan sát ảnh minh họa nhóm Văn phòng – Công việc và chọn câu mô tả chính xác nhất.',
    options: [
      '(A) A woman is writing a memo by hand.',
      '(B) A man is reaching for a folder on a shelf.',
      '(C) The printer is placed on top of the filing cabinet.',
      '(D) Two colleagues are pointing at the window.',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: Người đàn ông đứng cạnh tủ hồ sơ đang với tay lấy một tập hồ sơ trên kệ ("reaching for a folder on a shelf").',
    trapAnalysis:
      '(A) Bẫy trái nghĩa hành động: người phụ nữ đang gõ laptop (typing), không phải viết tay (writing by hand). (C) Bẫy sai vị trí: máy in nằm phía sau bàn làm việc, không phải trên nóc tủ hồ sơ. (D) Sai hành động không có trong ảnh.',
  },
  {
    id: 'Q-P1-02',
    part: 'part1',
    situationId: 'P1-01',
    questionType: 'Phân biệt hành động & giới từ văn phòng',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[0].imageUrl,
    audioScript: [
      '(A) A lamp is sitting next to a computer monitor.',
      '(B) All employees are standing near the entrance.',
      '(C) The woman is filling a water bottle at her desk.',
      '(D) A chair has been stacked on top of the table.',
    ],
    prompt: 'Chọn mô tả đúng về vị trí đồ vật và hành động trong phòng làm việc.',
    options: [
      '(A) A lamp is sitting next to a computer monitor.',
      '(B) All employees are standing near the entrance.',
      '(C) The woman is filling a water bottle at her desk.',
      '(D) A chair has been stacked on top of the table.',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: Đèn bàn đang đặt ngay cạnh màn hình máy tính ("next to a computer monitor").',
    trapAnalysis:
      '(B) Sai chủ thể ("All employees"). (C) Bẫy từ phát âm gần giống filing/filling và suy luận sai hành động. (D) Không có ghế xếp chồng trên bàn.',
  },
  {
    id: 'Q-P1-03',
    part: 'part1',
    situationId: 'P1-02',
    questionType: 'Hành động ngoài trời & đường phố',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[1].imageUrl,
    audioScript: [
      '(A) Workers are loading boxes onto a truck.',
      '(B) Pedestrians are running across the highway.',
      '(C) A ladder is lying flat across the sidewalk.',
      '(D) Workers are painting the traffic light.',
    ],
    prompt: 'Quan sát ảnh minh họa Ngoài trời – Đường phố – Xây dựng và chọn mô tả đúng.',
    options: [
      '(A) Workers are loading boxes onto a truck.',
      '(B) Pedestrians are running across the highway.',
      '(C) A ladder is lying flat across the sidewalk.',
      '(D) Workers are painting the traffic light.',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: Hai công nhân mặc áo phản quang đang bốc các thùng carton lên xe tải đang đỗ ("loading boxes onto a truck").',
    trapAnalysis:
      '(B) Bẫy trái nghĩa: người đi bộ đang đi (walking), không phải chạy (running). (C) Bẫy giới từ: thang đang tựa vào tường ("leaning against"), không phải nằm ngang dưới đất. (D) Sai hành động.',
  },
  {
    id: 'Q-P1-04',
    part: 'part1',
    situationId: 'P1-03',
    questionType: 'Cửa hàng & Nhà hàng',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[2].imageUrl,
    audioScript: [
      '(A) A customer is clearing dishes from the counter.',
      '(B) A waiter is pouring coffee into a cup.',
      '(C) Boxes are scattered across the dining table.',
      '(D) All the shelves on the wall are completely empty.',
    ],
    prompt: 'Quan sát ảnh minh họa Nhà hàng – Cửa hàng – Dịch vụ và chọn mô tả đúng.',
    options: [
      '(A) A customer is clearing dishes from the counter.',
      '(B) A waiter is pouring coffee into a cup.',
      '(C) Boxes are scattered across the dining table.',
      '(D) All the shelves on the wall are completely empty.',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: Nhân viên phục vụ đang rót cà phê vào tách cho khách ngồi bàn ("pouring coffee into a cup").',
    trapAnalysis:
      '(A) Bẫy cặp dễ nhầm serving ≠ clearing và sai chủ thể. (C) Bẫy cặp dễ nhầm stacked ≠ scattered và sai vị trí (hộp xếp chồng trên sàn, không phải rải trên bàn). (D) Kệ có hàng trưng bày, không trống.',
  },
  {
    id: 'Q-P1-05',
    part: 'part1',
    situationId: 'P1-04',
    questionType: 'Giao thông – Sân bay – Nhà ga',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[3].imageUrl,
    audioScript: [
      '(A) A traveler is pulling a suitcase along the platform.',
      '(B) Passengers are alighting from an airplane.',
      '(C) Nobody is waiting near the train tracks.',
      '(D) An officer is loading luggage onto the train.',
    ],
    prompt: 'Quan sát ảnh minh họa Giao thông – Sân bay – Nhà ga và chọn đáp án đúng.',
    options: [
      '(A) A traveler is pulling a suitcase along the platform.',
      '(B) Passengers are alighting from an airplane.',
      '(C) Nobody is waiting near the train tracks.',
      '(D) An officer is loading luggage onto the train.',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: Một hành khách đang kéo vali có bánh xe dọc sân ga ("pulling a suitcase").',
    trapAnalysis:
      '(B) Sai phương tiện (tàu hỏa ≠ máy bay) và cặp dễ nhầm boarding ≠ alighting. (C) Có nhiều người đang xếp hàng chờ. (D) Nhân viên đang kiểm tra giấy tờ/vé ("checking documents"), không phải bốc hành lý.',
  },
  {
    id: 'Q-P1-06',
    part: 'part1',
    situationId: 'P1-05',
    questionType: 'Cảnh không có người & Trạng thái đồ vật',
    origin: 'extended_practice',
    imageUrl: PART1_SCENE_GROUPS[4].imageUrl,
    audioScript: [
      '(A) A receptionist is typing at the front desk.',
      '(B) Chairs have been stacked in the corner.',
      '(C) A bicycle is parked inside the lobby.',
      '(D) The sign is hanging below the doorway.',
    ],
    prompt: 'Quan sát ảnh minh họa Cảnh không có người và chọn mô tả chính xác.',
    options: [
      '(A) A receptionist is typing at the front desk.',
      '(B) Chairs have been stacked in the corner.',
      '(C) A bicycle is parked inside the lobby.',
      '(D) The sign is hanging below the doorway.',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: Các ghế đã được xếp chồng gọn gàng ở góc tường ("Chairs have been stacked in the corner").',
    trapAnalysis:
      '(A) Bẫy chủ thể người trong ảnh không có người! (C) Xe đạp đỗ bên ngoài cạnh ghế dài, không phải bên trong sảnh. (D) Bẫy giới từ: biển hiệu nằm phía trên ("above") lối vào, không phải "below".',
  },
];

export const PART2_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'Q-P2-01',
    part: 'part2',
    situationId: 'P2-01',
    questionType: 'Wh- Questions (When / Where / Who)',
    origin: 'extended_practice',
    audioScript: [
      'Question: When will the quarterly report be ready?',
      '(A) Yes, I read it this morning.',
      '(B) I am still working on the final section.',
      '(C) In the third-floor conference room.',
    ],
    prompt: 'Nghe câu hỏi When và chọn phản hồi tự nhiên nhất.',
    options: [
      '(A) Yes, I read it this morning.',
      '(B) I am still working on the final section.',
      '(C) In the third-floor conference room.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: Đây là câu trả lời gián tiếp kinh điển cho câu hỏi When ("Tôi vẫn đang làm phần cuối", ngụ ý chưa xong và chưa có giờ chính xác).',
    trapAnalysis:
      '(A) Bẫy trả lời Yes/No cho câu hỏi Wh-. (C) Trả lời nơi chốn (Where) thay vì thời gian (When).',
  },
  {
    id: 'Q-P2-02',
    part: 'part2',
    situationId: 'P2-01',
    questionType: 'Wh- Questions (Why / How)',
    origin: 'extended_practice',
    audioScript: [
      'Question: Why was the morning flight delayed?',
      '(A) Due to a technical problem with the engine.',
      '(B) It departs from gate B12.',
      '(C) About forty-five minutes by taxi.',
    ],
    prompt: 'Nghe câu hỏi Why và chọn đáp án phù hợp.',
    options: [
      '(A) Due to a technical problem with the engine.',
      '(B) It departs from gate B12.',
      '(C) About forty-five minutes by taxi.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: "Due to..." nêu nguyên nhân trực tiếp trả lời cho câu hỏi "Why".',
    trapAnalysis:
      '(B) Trả lời địa điểm (Where). (C) Trả lời thời lượng (How long), đồng thời lặp số 45 dễ gây nhiễu.',
  },
  {
    id: 'Q-P2-03',
    part: 'part2',
    situationId: 'P2-02',
    questionType: 'Yes/No Questions & Indirect Answers',
    origin: 'extended_practice',
    audioScript: [
      'Question: Have you called the client about the revised schedule?',
      '(A) The schedule is on the bulletin board.',
      '(B) I left a message with her assistant this morning.',
      '(C) Yes, the client’s office is nearby.',
    ],
    prompt: 'Chọn câu trả lời gián tiếp đúng ý định cho câu hỏi Yes/No.',
    options: [
      '(A) The schedule is on the bulletin board.',
      '(B) I left a message with her assistant this morning.',
      '(C) Yes, the client’s office is nearby.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: "Tôi đã để lại lời nhắn với trợ lý của cô ấy sáng nay" — trả lời gián tiếp cho việc đã liên hệ khách hàng.',
    trapAnalysis:
      '(A) Lặp từ "schedule" nhưng không trả lời đã gọi chưa. (C) Có "Yes" và lặp từ "client" nhưng sai ý định câu hỏi.',
  },
  {
    id: 'Q-P2-04',
    part: 'part2',
    situationId: 'P2-03',
    questionType: 'Choice Questions (A or B)',
    origin: 'extended_practice',
    audioScript: [
      'Question: Would you prefer to meet on Monday or Tuesday?',
      '(A) Yes, I met them yesterday.',
      '(B) Either day works for me.',
      '(C) The meeting room is on the second floor.',
    ],
    prompt: 'Nghe câu hỏi lựa chọn (A or B) và chọn phản hồi đúng.',
    options: [
      '(A) Yes, I met them yesterday.',
      '(B) Either day works for me.',
      '(C) The meeting room is on the second floor.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 1,
    explanation:
      'Đáp án (B) đúng: "Ngày nào cũng ổn với tôi" ("Either is fine / Either day works for me") là mẫu chuẩn cho câu hỏi A or B.',
    trapAnalysis:
      '(A) Bẫy Yes/No cho câu hỏi lựa chọn và sai thì quá khứ. (C) Lặp từ gần giống "meet / meeting" và trả lời nơi chốn.',
  },
  {
    id: 'Q-P2-05',
    part: 'part2',
    situationId: 'P2-04',
    questionType: 'Requests & Offers',
    origin: 'extended_practice',
    audioScript: [
      'Question: Would you mind closing the window before the presentation starts?',
      '(A) Not at all, I will do it right away.',
      '(B) The presentation lasted an hour.',
      '(C) No, thanks, I already have a copy.',
    ],
    prompt: 'Nghe lời yêu cầu lịch sự và chọn câu phản hồi tự nhiên.',
    options: [
      '(A) Not at all, I will do it right away.',
      '(B) The presentation lasted an hour.',
      '(C) No, thanks, I already have a copy.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: Với "Would you mind...", "Not at all" có nghĩa là "Không phiền chút nào" (đồng ý làm ngay).',
    trapAnalysis:
      '(B) Lặp từ "presentation" và sai thì. (C) Phản hồi dành cho lời mời ("Would you like..."), không khớp với yêu cầu đóng cửa sổ.',
  },
  {
    id: 'Q-P2-06',
    part: 'part2',
    situationId: 'P2-05',
    questionType: 'Statements (Câu trần thuật)',
    origin: 'extended_practice',
    audioScript: [
      'Statement: The office printer is jammed again.',
      '(A) I will call the maintenance team.',
      '(B) Yes, I printed twenty pages.',
      '(C) Across from the bus stop.',
    ],
    prompt: 'Nghe câu trần thuật nêu sự cố và chọn phản hồi phù hợp.',
    options: [
      '(A) I will call the maintenance team.',
      '(B) Yes, I printed twenty pages.',
      '(C) Across from the bus stop.',
      '(D) — (Part 2 chỉ có 3 lựa chọn A, B, C)',
    ],
    correctIndex: 0,
    explanation:
      'Đáp án (A) đúng: Đưa ra hành động xử lý vấn đề ("Tôi sẽ gọi đội bảo trì").',
    trapAnalysis:
      '(B) Lặp từ "printer/printed" và trả lời Yes cho câu trần thuật. (C) Sai ngữ cảnh hoàn toàn.',
  },
];

// Curated detailed practice scenarios for Part 3, 4, 6, 7 plus dynamic situation-grounded generator
const CURATED_QUESTIONS: Record<string, PracticeQuestion[]> = {
  'P3-01': [
    {
      id: 'Q-P3-01-1',
      part: 'part3',
      situationId: 'P3-01',
      questionType: 'Vấn đề & Hành động tiếp theo',
      origin: 'extended_practice',
      audioScript: [
        'Man: Hello, Lakeside Hotel. How may I help you?',
        'Woman: Hi, I would like to make a reservation for a single room from May 12 to May 15.',
        'Man: Let me check our availability... Unfortunately, we have no vacancies for single rooms on those dates, though we do have a double room available.',
        'Woman: That works. How much is the nightly rate, and what time is check-out?',
        'Man: Check-out is at 11 a.m. Let me send the booking details to your email.',
      ],
      prompt: 'Why is the woman unable to book a single room?',
      options: [
        'The hotel is closed for renovation.',
        'There are no single rooms available for her dates.',
        'She missed the check-out deadline.',
        'The online reservation system is down.',
      ],
      correctIndex: 1,
      explanation:
        'Người lễ tân nói "we have no vacancies for single rooms on those dates" — đồng nghĩa (paraphrase) với "no single rooms available".',
      trapAnalysis:
        'Bẫy nhắc đến từ "check-out" ở cuối hội thoại nhưng không phải lý do không đặt được phòng đơn.',
      evidenceQuote: 'Unfortunately, we have no vacancies for single rooms on those dates.',
    },
    {
      id: 'Q-P3-01-2',
      part: 'part3',
      situationId: 'P3-01',
      questionType: 'Chi tiết & Hành động tiếp theo',
      origin: 'extended_practice',
      audioScript: [
        'Man: Check-out is at 11 a.m. Let me send the booking details to your email.',
      ],
      prompt: 'What will the man probably do next?',
      options: [
        'Cancel the double room booking',
        'Email the reservation information to the woman',
        'Ask the woman to check out early',
        'Transfer the call to another hotel',
      ],
      correctIndex: 1,
      explanation: 'Câu cuối hội thoại: "Let me send the booking details to your email."',
      trapAnalysis: 'Chú ý hành động người nói hứa làm ở câu cuối ("send the booking details").',
      evidenceQuote: 'Let me send the booking details to your email.',
    },
  ],
  'P3-02': [
    {
      id: 'Q-P3-02-1',
      part: 'part3',
      situationId: 'P3-02',
      questionType: 'Thay đổi lịch & Paraphrase',
      origin: 'extended_practice',
      audioScript: [
        'Woman: Mark, did you see the email about Thursday’s budget meeting?',
        'Man: Yes, Mr. Kim asked to reschedule it to Friday morning because two key attendees are out of town.',
        'Woman: Got it. Should I update the agenda and send out the minutes from last week?',
        'Man: Please update the agenda. I already emailed last week’s minutes yesterday.',
      ],
      prompt: 'Why was the budget meeting rescheduled?',
      options: [
        'The conference room was unavailable.',
        'Several important participants cannot attend on Thursday.',
        'The agenda was not ready on time.',
        'Last week’s minutes had errors.',
      ],
      correctIndex: 1,
      explanation:
        '"Two key attendees are out of town" được diễn đạt lại (paraphrase) thành "Several important participants cannot attend".',
      trapAnalysis:
        'Bẫy việc đã làm vs việc dự định làm: "minutes" đã được gửi hôm qua, còn "agenda" là việc người phụ nữ sẽ cập nhật.',
      evidenceQuote: 'two key attendees are out of town',
    },
  ],
  'P4-01': [
    {
      id: 'Q-P4-01-1',
      part: 'part4',
      situationId: 'P4-01',
      questionType: 'Mục đích & Thông tin cập nhật',
      origin: 'extended_practice',
      audioScript: [
        'Attention, all employees. This is an important announcement from the Facilities Department.',
        'Due to scheduled maintenance on the main elevator, please use the east stairwell starting tomorrow morning.',
        'Originally, the repair was planned for Friday, however, the technician will arrive on Thursday instead.',
        'Attendance at tomorrow’s safety briefing at 9 a.m. is mandatory for all floor supervisors.',
      ],
      prompt: 'When will the elevator maintenance take place?',
      options: [
        'On Wednesday afternoon',
        'On Thursday',
        'On Friday',
        'Next Monday',
      ],
      correctIndex: 1,
      explanation:
        'Tín hiệu chuyển ý "however ... instead": ban đầu dự kiến thứ Sáu (Friday), nhưng kỹ thuật viên sẽ đến vào thứ Năm (Thursday).',
      trapAnalysis:
        'Bẫy kinh điển Part 4: nhắc lại ngày cũ (Friday) để đánh lừa người không nghe kỹ từ "however" và "instead".',
      evidenceQuote: 'Originally, the repair was planned for Friday, however, the technician will arrive on Thursday instead.',
    },
  ],
  'P6-01': [
    {
      id: 'Q-P6-01-1',
      part: 'part6',
      situationId: 'P6-01',
      questionType: 'Điền từ loại & Liên kết ngữ cảnh',
      origin: 'extended_practice',
      passages: [
        {
          label: 'Email xác nhận đặt phòng',
          docType: 'Email',
          content:
            'Dear Ms. Tran,\n\nThank you for choosing Harbor View Hotel. We are pleased to confirm your [1] _____ for a deluxe suite from June 10 to June 13. Check-in begins at 2:00 p.m., and check-out is at noon.\n\n[2] _____ you need to modify your dates, please notify our front desk at least 48 hours in advance to avoid a cancellation fee. Complimentary Wi-Fi and breakfast are included during your stay.',
        },
      ],
      prompt: 'Chọn từ đúng nhất cho chỗ trống [1]: "We are pleased to confirm your [1] _____ for a deluxe suite..."',
      options: ['reserve', 'reservation', 'reserved', 'reserving'],
      correctIndex: 1,
      grammarRule: 'Sau tính từ sở hữu "your" cần một danh từ (Noun).',
      explanation:
        '"reservation" (danh từ: sự đặt chỗ) đứng sau tính từ sở hữu "your" và đi với động từ "confirm".',
      trapAnalysis:
        'Bẫy từ loại: "reserve" là động từ/danh từ không hợp collocation bằng "reservation" trong xác nhận đặt phòng; "reserved" là tính từ/V2.',
      evidenceQuote: 'confirm your reservation for a deluxe suite',
    },
    {
      id: 'Q-P6-01-2',
      part: 'part6',
      situationId: 'P6-01',
      questionType: 'Liên từ điều kiện',
      origin: 'extended_practice',
      passages: [
        {
          label: 'Email xác nhận đặt phòng',
          docType: 'Email',
          content:
            'Dear Ms. Tran,\n\nThank you for choosing Harbor View Hotel. We are pleased to confirm your reservation for a deluxe suite from June 10 to June 13.\n\n[2] _____ you need to modify your dates, please notify our front desk at least 48 hours in advance to avoid a cancellation fee.',
        },
      ],
      prompt: 'Chọn liên từ phù hợp cho chỗ trống [2]:',
      options: ['Should', 'Because', 'Despite', 'Unless'],
      correctIndex: 0,
      grammarRule: 'Đảo ngữ câu điều kiện loại 1: Should + S + V(nguyên thể), please + V...',
      explanation:
        '"Should you need..." = "If you need..." (Nếu quý khách cần thay đổi ngày). Phù hợp hoàn hảo về nghĩa và ngữ pháp trang trọng.',
      trapAnalysis:
        '"Despite" là giới từ (cần N/V-ing). "Unless" (trừ khi) và "Because" (bởi vì) sai logic mạch văn.',
      evidenceQuote: 'Should you need to modify your dates, please notify our front desk',
    },
  ],
  'P7-01': [
    {
      id: 'Q-P7-01-1',
      part: 'part7',
      situationId: 'P7-01',
      questionType: 'Detail & Inference (Single/Double Passage)',
      origin: 'extended_practice',
      passages: [
        {
          label: 'Document 1: Internal Email',
          docType: 'Email',
          content:
            'From: Facilities Manager <facilities@northstar.com>\nTo: All Staff\nSubject: Air Conditioning Maintenance\n\nPlease be advised that technicians will inspect and replace the air filters on the 4th floor this Saturday from 8:00 a.m. to 1:00 p.m. During this time, power to the 4th-floor printer room will be shut off temporarily.\n\nNote: Employees who need to work on Saturday should relocate to Conference Room 2B on the second floor. Please submit any malfunction reports by Friday at 4:00 p.m.',
        },
        {
          label: 'Document 2: Maintenance Schedule Update',
          docType: 'Notice',
          content:
            'UPDATE (Friday, 2:00 p.m.): Due to a part delivery delay, the air filter replacement originally scheduled for Saturday morning has been moved to Sunday, 9:00 a.m. – 2:00 p.m. Conference Room 2B remains reserved for staff.',
        },
      ],
      prompt: 'According to both documents, when will the 4th-floor printer room lack power?',
      options: [
        'Friday at 4:00 p.m.',
        'Saturday from 8:00 a.m. to 1:00 p.m.',
        'Sunday from 9:00 a.m. to 2:00 p.m.',
        'Monday morning at 8:00 a.m.',
      ],
      correctIndex: 2,
      explanation:
        'Đối chiếu chéo 2 tài liệu: Tài liệu 1 nêu điện phòng máy in tầng 4 bị ngắt trong lúc thay bộ lọc khí. Tài liệu 2 cập nhật lịch thay bộ lọc khí chuyển sang Chủ nhật 9:00 a.m. – 2:00 p.m.',
      trapAnalysis:
        'Bẫy bỏ sót tài liệu thứ 2: nếu chỉ đọc Email 1 sẽ chọn nhầm Thứ Bảy 8:00–1:00.',
      evidenceQuote:
        'the air filter replacement originally scheduled for Saturday morning has been moved to Sunday, 9:00 a.m. – 2:00 p.m.',
    },
  ],
};

function buildSituationPracticeQuestion(sit: SituationItem): PracticeQuestion {
  const kw0 = sit.keywords[0];
  const kw1 = sit.keywords[1] ?? sit.keywords[0];
  const kw2 = sit.keywords[2] ?? sit.keywords[0];
  const kw3 = sit.keywords[3] ?? sit.keywords[0];

  if (sit.part === 'part3') {
    const script = [
      `Speaker A: Hi, I am calling about "${sit.title}". We need to check the ${kw0.word} and ${kw1.word} before the end of the day.`,
      `Speaker B: Let me verify the details. Actually, there was a change regarding ${kw2.word}, so the original plan was updated this morning.`,
      `Speaker A: Thanks for letting me know. What should we do about ${kw3.word}?`,
      `Speaker B: I will send you the updated confirmation right after this call so everything stays on track.`,
    ];
    return {
      id: `Q-${sit.id}-1`,
      part: 'part3',
      situationId: sit.id,
      questionType: 'Ý định & Hành động tiếp theo',
      origin: 'extended_practice',
      audioScript: script,
      prompt: `Trong hội thoại về "${sit.title}", người nghe (Speaker B) sẽ làm gì tiếp theo?`,
      options: [
        `Gửi xác nhận cập nhật liên quan đến ${kw3.word} ngay sau cuộc gọi`,
        `Hủy toàn bộ kế hoạch về ${kw0.word} vào ngày mai`,
        `Chờ đến tuần sau mới kiểm tra ${kw1.word}`,
        `Yêu cầu Speaker A tự sửa đổi ${kw2.word} mà không thông báo`,
      ],
      correctIndex: 0,
      explanation: `Speaker B nói ở câu cuối: "I will send you the updated confirmation right after this call..." — khớp trực tiếp với ngữ cảnh ${sit.title}.`,
      trapAnalysis:
        'Bẫy Part 3: Tránh chọn phương án dùng lại từ khóa trong bài nhưng sai hành động dự định ở câu cuối.',
      evidenceQuote: 'I will send you the updated confirmation right after this call.',
    };
  }

  if (sit.part === 'part4') {
    const script = [
      `Good morning, everyone. This is a brief announcement regarding "${sit.title}".`,
      `Please pay close attention to the latest update about ${kw0.word} and ${kw1.word}.`,
      `Originally, this was scheduled for Wednesday; however, due to ${kw2.word}, it will take place on Friday instead.`,
      `Be sure to review the ${kw3.word} guidelines before attending.`,
    ];
    return {
      id: `Q-${sit.id}-1`,
      part: 'part4',
      situationId: sit.id,
      questionType: 'Thông tin thay đổi & Chỉ dẫn',
      origin: 'extended_practice',
      audioScript: script,
      prompt: `Theo bài nói về "${sit.title}", thông tin nào vừa thay đổi?`,
      options: [
        'Thời gian đã chuyển từ thứ Tư sang thứ Sáu',
        'Sự kiện bị hủy hoàn toàn do thiếu nhân sự',
        'Mọi người không cần xem hướng dẫn nữa',
        'Thời gian được dời sớm lên thứ Hai',
      ],
      correctIndex: 0,
      explanation:
        'Chú ý tín hiệu chuyển ý "however ... instead": lịch ban đầu vào thứ Tư (Wednesday) đã đổi sang thứ Sáu (Friday).',
      trapAnalysis:
        'Bẫy Part 4: Nhầm thông tin cũ (Wednesday) với thông tin vừa cập nhật (Friday).',
      evidenceQuote: 'Originally, this was scheduled for Wednesday; however... it will take place on Friday instead.',
    };
  }

  if (sit.part === 'part6') {
    return {
      id: `Q-${sit.id}-1`,
      part: 'part6',
      situationId: sit.id,
      questionType: 'Từ vựng & Liên kết ngữ cảnh',
      origin: 'extended_practice',
      passages: [
        {
          label: sit.title,
          docType: 'Văn bản công việc',
          content: `Notice: ${sit.title}\n\nTo ensure smooth operations, please review all details regarding ${kw1.word} and ${kw2.word}. Staff members must submit the official _____ (${kw0.meaning}) to the coordinator before 5:00 p.m. Friday. Should you have questions about ${kw3.word}, please contact our support desk.`,
        },
      ],
      prompt: `Chọn cụm từ đúng ngữ cảnh giáo trình để điền vào chỗ trống (nghĩa: "${kw0.meaning}"):`,
      options: [
        kw0.word,
        kw1.word,
        kw2.word,
        kw3.word,
      ],
      correctIndex: 0,
      grammarRule: 'Kiểm tra cả từ loại và nghĩa logic với câu trước và câu sau chỗ trống.',
      explanation: `"${kw0.word}" mang nghĩa "${kw0.meaning}", khớp hoàn toàn với chỗ trống trong ngữ cảnh "${sit.title}".`,
      trapAnalysis:
        'Các lựa chọn khác tuy thuộc cùng nhóm từ trọng tâm nhưng sai nghĩa tại vị trí chỗ trống đang xét.',
      evidenceQuote: `submit the official ${kw0.word} to the coordinator`,
    };
  }

  // Part 7
  return {
    id: `Q-${sit.id}-1`,
    part: 'part7',
    situationId: sit.id,
    questionType: 'Detail & Evidence Scanning',
    origin: 'extended_practice',
    passages: [
      {
        label: `Tài liệu 1: ${sit.title}`,
        docType: 'Tài liệu công việc',
        content: `Subject: ${sit.title}\n\nPlease review the attached information covering ${kw0.word} (${kw0.meaning}) and ${kw1.word} (${kw1.meaning}). All updates related to ${kw2.word} take effect next Monday.\n\n*Note: Requests concerning ${kw3.word} must be submitted in writing at least two business days ahead.`,
      },
    ],
    prompt: `Theo ghi chú trong "${sit.title}", yêu cầu liên quan đến "${kw3.word}" cần được gửi như thế nào?`,
    options: [
      'Gửi bằng văn bản trước ít nhất 2 ngày làm việc',
      'Gọi điện trực tiếp vào sáng thứ Hai',
      'Không cần thông báo trước nếu đã có mã xác nhận',
      'Chỉ áp dụng sau khi kết thúc tháng',
    ],
    correctIndex: 0,
    explanation:
      'Phần ghi chú (*Note) nêu rõ: "Requests concerning ... must be submitted in writing at least two business days ahead."',
    trapAnalysis:
      'Bẫy Part 7: Học viên hay bỏ qua dòng ghi chú (*Note / điều kiện ngoại lệ) ở cuối văn bản.',
    evidenceQuote: `Requests concerning ${kw3.word} must be submitted in writing at least two business days ahead.`,
  };
}

export function getQuestionsForSituation(situationId: string): PracticeQuestion[] {
  if (situationId.startsWith('P1-')) {
    return PART1_PRACTICE_QUESTIONS.filter((q) => q.situationId === situationId);
  }
  if (situationId.startsWith('P2-')) {
    return PART2_PRACTICE_QUESTIONS.filter((q) => q.situationId === situationId);
  }
  if (CURATED_QUESTIONS[situationId]) {
    return CURATED_QUESTIONS[situationId];
  }
  const all = [...PART3_SITUATIONS, ...PART4_SITUATIONS, ...PART6_SITUATIONS, ...PART7_SITUATIONS];
  const found = all.find((s) => s.id === situationId);
  if (!found) return [];
  return [buildSituationPracticeQuestion(found)];
}

export function buildAllPracticeQuestions(customQuestions: PracticeQuestion[] = []): PracticeQuestion[] {
  const all220 = [...PART3_SITUATIONS, ...PART4_SITUATIONS, ...PART6_SITUATIONS, ...PART7_SITUATIONS];
  const generated220 = all220.flatMap((s) => getQuestionsForSituation(s.id));
  return [
    ...PART1_PRACTICE_QUESTIONS,
    ...PART2_PRACTICE_QUESTIONS,
    ...generated220,
    ...customQuestions,
  ];
}

export function getQuestionsByPart(part: ToeicPart | 'all', customQuestions: PracticeQuestion[] = []): PracticeQuestion[] {
  const all = buildAllPracticeQuestions(customQuestions);
  if (part === 'all') return all;
  return all.filter((q) => q.part === part);
}

export { PART1_SCENE_GROUPS, PART2_QUESTION_TYPES };
