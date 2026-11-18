import type { DifficultyLevel, KeywordItem, SituationItem } from '../types/toeic';

const P3_TRAP =
  'Phương án nhắc lại đúng từ trong hội thoại nhưng sai người/sai thời điểm; nhầm việc đã làm với việc dự định làm. Nghe paraphrase và câu cuối để tìm bước tiếp theo.';

const P3_STRATEGY =
  'Nghe theo vai trò và mục tiêu. Trong hội thoại, thông tin thường được bổ sung, sửa hoặc đổi ở giữa/cuối đoạn. Luyện theo sơ đồ: Speaker A muốn gì → Speaker B phản hồi thế nào → quyết định/next step là gì.';

const P3_SELF_QUESTIONS = [
  'Vấn đề là gì?',
  'Ai chịu trách nhiệm?',
  'Họ đã thống nhất điều gì?',
  'Việc tiếp theo là gì?',
];

const P3_QUESTION_TYPES = [
  'Người nói là ai / đang ở đâu?',
  'Vấn đề hoặc mục đích cuộc trao đổi là gì?',
  'Chi tiết cụ thể (thời gian, địa điểm, phương án)',
  'Người nghe/người nói dự định làm gì tiếp theo?',
];

type KwCluster = {
  topic: string;
  difficulty: DifficultyLevel;
  keywords: { word: string; meaning: string }[];
};

const CLUSTERS: Record<string, KwCluster> = {
  hotel: {
    topic: 'Du lịch & khách sạn',
    difficulty: 'Cao',
    keywords: [
      { word: 'reservation', meaning: 'đặt chỗ' },
      { word: 'availability', meaning: 'tình trạng còn phòng' },
      { word: 'vacancy', meaning: 'phòng trống' },
      { word: 'check-out', meaning: 'trả phòng' },
    ],
  },
  meeting: {
    topic: 'Công sở & hành chính',
    difficulty: 'Cao',
    keywords: [
      { word: 'reschedule', meaning: 'dời lịch' },
      { word: 'agenda', meaning: 'chương trình họp' },
      { word: 'attendee', meaning: 'người tham dự' },
      { word: 'minutes', meaning: 'biên bản họp' },
    ],
  },
  hr: {
    topic: 'Nhân sự & tuyển dụng',
    difficulty: 'Cao',
    keywords: [
      { word: 'applicant', meaning: 'ứng viên' },
      { word: 'qualification', meaning: 'trình độ' },
      { word: 'position', meaning: 'vị trí' },
      { word: 'shortlist', meaning: 'danh sách chọn lọc' },
    ],
  },
  project: {
    topic: 'Công sở & hành chính',
    difficulty: 'Cao',
    keywords: [
      { word: 'deadline', meaning: 'hạn chót' },
      { word: 'milestone', meaning: 'mốc tiến độ' },
      { word: 'on schedule', meaning: 'đúng tiến độ' },
      { word: 'delay', meaning: 'sự chậm trễ' },
    ],
  },
  delivery: {
    topic: 'Vận tải & logistics',
    difficulty: 'Cao',
    keywords: [
      { word: 'delivery', meaning: 'giao hàng' },
      { word: 'tracking number', meaning: 'mã theo dõi' },
      { word: 'dispatch', meaning: 'gửi đi' },
      { word: 'estimated arrival', meaning: 'dự kiến đến' },
    ],
  },
  complaint: {
    topic: 'Mua sắm & dịch vụ khách hàng',
    difficulty: 'Cao',
    keywords: [
      { word: 'complaint', meaning: 'khiếu nại' },
      { word: 'refund', meaning: 'hoàn tiền' },
      { word: 'compensation', meaning: 'bồi thường' },
      { word: 'resolve', meaning: 'giải quyết' },
    ],
  },
  transit: {
    topic: 'Vận tải & logistics',
    difficulty: 'Cao',
    keywords: [
      { word: 'fare', meaning: 'giá vé/cước' },
      { word: 'transfer', meaning: 'chuyển tuyến' },
      { word: 'pickup point', meaning: 'điểm đón' },
      { word: 'traffic congestion', meaning: 'ùn tắc' },
    ],
  },
  flight: {
    topic: 'Du lịch & khách sạn',
    difficulty: 'Cao',
    keywords: [
      { word: 'departure', meaning: 'khởi hành' },
      { word: 'arrival', meaning: 'đến nơi' },
      { word: 'boarding pass', meaning: 'thẻ lên máy bay' },
      { word: 'itinerary', meaning: 'lịch trình' },
    ],
  },
  dining: {
    topic: 'Ẩm thực & nhà hàng',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'reservation', meaning: 'đặt bàn' },
      { word: 'entrée', meaning: 'món chính' },
      { word: 'side dish', meaning: 'món ăn kèm' },
      { word: 'bill', meaning: 'hóa đơn' },
    ],
  },
  finance: {
    topic: 'Tài chính & ngân hàng',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'account', meaning: 'tài khoản' },
      { word: 'transfer', meaning: 'chuyển khoản' },
      { word: 'interest rate', meaning: 'lãi suất' },
      { word: 'exchange rate', meaning: 'tỷ giá' },
    ],
  },
  maintenance: {
    topic: 'Bất động sản & cơ sở vật chất',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'maintenance', meaning: 'bảo trì' },
      { word: 'malfunction', meaning: 'trục trặc' },
      { word: 'report', meaning: 'báo cáo' },
      { word: 'replace', meaning: 'thay thế' },
    ],
  },
  policy: {
    topic: 'Mua sắm & dịch vụ khách hàng',
    difficulty: 'Cao',
    keywords: [
      { word: 'policy', meaning: 'chính sách' },
      { word: 'effective date', meaning: 'ngày có hiệu lực' },
      { word: 'comply with', meaning: 'tuân thủ' },
      { word: 'exception', meaning: 'ngoại lệ' },
    ],
  },
  education: {
    topic: 'Giáo dục & đào tạo',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'semester', meaning: 'học kỳ' },
      { word: 'admission', meaning: 'tuyển sinh' },
      { word: 'assignment', meaning: 'bài tập' },
      { word: 'orientation', meaning: 'buổi định hướng' },
    ],
  },
  shift: {
    topic: 'Nhân sự & tuyển dụng',
    difficulty: 'Cao',
    keywords: [
      { word: 'shift', meaning: 'ca làm' },
      { word: 'leave request', meaning: 'đơn xin nghỉ' },
      { word: 'payroll', meaning: 'bảng lương' },
      { word: 'supervisor', meaning: 'người giám sát' },
    ],
  },
  marketing: {
    topic: 'Marketing & bán hàng',
    difficulty: 'Cao',
    keywords: [
      { word: 'promotion', meaning: 'chương trình khuyến mãi' },
      { word: 'launch', meaning: 'ra mắt' },
      { word: 'target audience', meaning: 'khách hàng mục tiêu' },
      { word: 'campaign', meaning: 'chiến dịch' },
    ],
  },
  contract: {
    topic: 'Hợp đồng & nhà cung cấp',
    difficulty: 'Trung bình–Cao',
    keywords: [
      { word: 'negotiate', meaning: 'đàm phán' },
      { word: 'renewal', meaning: 'gia hạn' },
      { word: 'terms and conditions', meaning: 'điều khoản' },
      { word: 'vendor', meaning: 'nhà cung cấp' },
    ],
  },
  health: {
    topic: 'Y tế & sức khỏe',
    difficulty: 'Thấp–Trung bình',
    keywords: [
      { word: 'appointment', meaning: 'lịch hẹn' },
      { word: 'prescription', meaning: 'đơn thuốc' },
      { word: 'dosage', meaning: 'liều dùng' },
      { word: 'coverage', meaning: 'phạm vi bảo hiểm' },
    ],
  },
  property: {
    topic: 'Bất động sản & cơ sở vật chất',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'lease', meaning: 'hợp đồng thuê' },
      { word: 'tenant', meaning: 'người thuê' },
      { word: 'landlord', meaning: 'chủ nhà' },
      { word: 'renovation', meaning: 'cải tạo' },
    ],
  },
  event: {
    topic: 'Sự kiện & hội nghị',
    difficulty: 'Trung bình–Cao',
    keywords: [
      { word: 'venue', meaning: 'địa điểm' },
      { word: 'register', meaning: 'đăng ký' },
      { word: 'keynote speaker', meaning: 'diễn giả chính' },
      { word: 'attend', meaning: 'tham dự' },
    ],
  },
};

// Deep expansions explicitly provided in TOEIC_Hoan_Chinh PDF (pages 10-11) for Part 3 situations 11-15
const DEEP_EXPANSIONS: Record<
  number,
  {
    keywords: KeywordItem[];
    confusing: string[];
  }
> = {
  11: {
    keywords: [
      { word: 'rent a car', meaning: 'thuê xe', synonyms: ['car rental', 'hire a vehicle'], antonyms: ['return the car'], example: "I'd like to rent a car for three days.", origin: 'curriculum' },
      { word: 'rental agreement', meaning: 'hợp đồng thuê', synonyms: ['rental contract'], example: 'Please sign the rental agreement.', origin: 'curriculum' },
      { word: 'insurance', meaning: 'bảo hiểm', synonyms: ['coverage', 'insurance policy'], example: 'Does the price include insurance?', origin: 'curriculum' },
      { word: 'deposit', meaning: 'tiền đặt cọc', synonyms: ['security deposit'], antonyms: ['refund of deposit'], example: 'A deposit is required at pickup.', origin: 'curriculum' },
      { word: 'mileage', meaning: 'số km', synonyms: ['kilometers driven'], example: 'Is there a limit on mileage?', origin: 'curriculum' },
      { word: 'return', meaning: 'trả xe', synonyms: ['drop off the car'], antonyms: ['pick up'], example: 'Where do I return the car?', origin: 'curriculum' },
    ],
    confusing: ['rent ≠ buy', 'deposit ≠ payment'],
  },
  12: {
    keywords: [
      { word: 'check-in', meaning: 'làm thủ tục', synonyms: ['check in for the flight'], antonyms: ['boarding'], example: 'You can check in online 24 hours before departure.', origin: 'curriculum' },
      { word: 'boarding pass', meaning: 'thẻ lên máy bay', example: 'Here is your boarding pass.', origin: 'curriculum' },
      { word: 'gate', meaning: 'cổng', synonyms: ['boarding gate'], example: 'The flight departs from gate B12.', origin: 'curriculum' },
      { word: 'baggage', meaning: 'hành lý', synonyms: ['luggage', 'checked baggage'], antonyms: ['carry-on'], example: 'How many pieces of baggage can I check?', origin: 'curriculum' },
      { word: 'security', meaning: 'an ninh', synonyms: ['security check', 'screening'], example: 'Please proceed to the security checkpoint.', origin: 'curriculum' },
      { word: 'delay', meaning: 'chậm chuyến', synonyms: ['flight delay'], antonyms: ['on time'], example: 'The flight has been delayed by 45 minutes.', origin: 'curriculum' },
    ],
    confusing: ['check-in ≠ boarding', 'baggage ≠ carry-on'],
  },
  13: {
    keywords: [
      { word: 'check-in', meaning: 'nhận phòng', synonyms: ['register', 'check in at the front desk'], antonyms: ['check-out'], example: 'I have a reservation under the name Nguyen.', origin: 'curriculum' },
      { word: 'reservation', meaning: 'đặt chỗ', synonyms: ['booking'], example: 'Let me pull up your reservation.', origin: 'curriculum' },
      { word: 'key card', meaning: 'thẻ từ', synonyms: ['room key'], example: 'Here is your key card for room 305.', origin: 'curriculum' },
      { word: 'amenities', meaning: 'tiện nghi', synonyms: ['facilities'], example: 'The hotel offers free Wi-Fi and a fitness center.', origin: 'curriculum' },
      { word: 'upgrade', meaning: 'nâng cấp phòng', synonyms: ['room upgrade'], antonyms: ['standard room'], example: 'Would you like a complimentary upgrade?', origin: 'curriculum' },
      { word: 'deposit', meaning: 'đặt cọc', example: 'We need a credit card for the deposit.', origin: 'curriculum' },
    ],
    confusing: ['check-in ≠ check-out', 'reservation ≠ confirmation'],
  },
  14: {
    keywords: [
      { word: 'check-out', meaning: 'trả phòng', synonyms: ['check out', 'settle the bill'], antonyms: ['check-in'], example: "I'd like to check out now.", origin: 'curriculum' },
      { word: 'bill', meaning: 'hóa đơn', synonyms: ['invoice', 'final bill'], example: 'Could I see the bill, please?', origin: 'curriculum' },
      { word: 'charge', meaning: 'tính phí', synonyms: ['additional charge'], antonyms: ['complimentary', 'free'], example: 'There is a charge for room service.', origin: 'curriculum' },
      { word: 'payment', meaning: 'thanh toán', synonyms: ['pay the bill', 'settle'], example: 'How would you like to make the payment?', origin: 'curriculum' },
      { word: 'receipt', meaning: 'biên lai', synonyms: ['proof of payment'], example: 'Please keep the receipt for your records.', origin: 'curriculum' },
      { word: 'late check-out', meaning: 'trả phòng muộn', synonyms: ['extended check-out'], antonyms: ['standard check-out'], example: 'Is late check-out available?', origin: 'curriculum' },
    ],
    confusing: ['bill ≠ receipt', 'charge ≠ free'],
  },
  15: {
    keywords: [
      { word: 'reservation', meaning: 'đặt bàn', synonyms: ['book a table', 'make a reservation'], antonyms: ['walk-in'], example: "I'd like to make a reservation for four people.", origin: 'curriculum' },
      { word: 'party', meaning: 'số người', synonyms: ['group size'], example: 'For how many people is the reservation?', origin: 'curriculum' },
      { word: 'time', meaning: 'giờ', synonyms: ['reservation time'], example: 'Is 7:30 p.m. available?', origin: 'curriculum' },
      { word: 'special request', meaning: 'yêu cầu đặc biệt', synonyms: ['dietary requirement'], example: 'We have a special request for a window table.', origin: 'curriculum' },
      { word: 'confirm', meaning: 'xác nhận', example: 'Please confirm the reservation under my name.', origin: 'curriculum' },
      { word: 'cancel', meaning: 'hủy', synonyms: ['cancellation'], antonyms: ['confirm'], example: 'I need to cancel my reservation.', origin: 'curriculum' },
    ],
    confusing: ['reservation ≠ walk-in', 'confirm ≠ cancel'],
  },
};

const RAW_PART3: [number, string, keyof typeof CLUSTERS][] = [
  [1, 'Đặt phòng khách sạn qua điện thoại', 'hotel'],
  [2, 'Thay đổi lịch họp', 'meeting'],
  [3, 'Phỏng vấn ứng viên', 'hr'],
  [4, 'Thảo luận tiến độ dự án', 'project'],
  [5, 'Báo cáo sự cố văn phòng', 'project'], // matches exact PDF page 3
  [6, 'Đặt mua vật tư', 'delivery'],
  [7, 'Khiếu nại dịch vụ', 'complaint'],
  [8, 'Hỏi đường đến địa điểm', 'transit'],
  [9, 'Mua vé tàu/máy bay', 'flight'],
  [10, 'Gọi taxi', 'transit'],
  [11, 'Thuê xe', 'transit'],
  [12, 'Làm thủ tục check-in sân bay', 'flight'],
  [13, 'Nhận phòng khách sạn', 'hotel'],
  [14, 'Trả phòng và thanh toán', 'hotel'],
  [15, 'Đặt bàn nhà hàng', 'dining'],
  [16, 'Gọi món', 'dining'],
  [17, 'Phàn nàn về món ăn', 'dining'],
  [18, 'Thanh toán hóa đơn', 'finance'],
  [19, 'Đổi/trả hàng', 'maintenance'],
  [20, 'Tư vấn bảo hành', 'policy'],
  [21, 'Đăng ký khóa học', 'education'],
  [22, 'Hỏi thông tin tuyển sinh', 'education'],
  [23, 'Thảo luận lịch ca làm', 'shift'],
  [24, 'Xin nghỉ phép', 'shift'],
  [25, 'Trao đổi về lương/thưởng', 'shift'],
  [26, 'Hướng dẫn nhân viên mới', 'hr'],
  [27, 'Đặt lịch hẹn khách hàng', 'maintenance'],
  [28, 'Chuẩn bị hội nghị', 'meeting'],
  [29, 'Kiểm tra đơn hàng', 'delivery'],
  [30, 'Xử lý giao hàng trễ', 'delivery'],
  [31, 'Lên kế hoạch tiếp thị', 'marketing'],
  [32, 'Chọn nhà cung cấp', 'contract'],
  [33, 'Đàm phán hợp đồng', 'contract'],
  [34, 'Gia hạn hợp đồng', 'contract'],
  [35, 'Sửa chữa thiết bị', 'project'],
  [36, 'Báo cáo tai nạn lao động', 'maintenance'],
  [37, 'Tư vấn bảo hiểm', 'health'],
  [38, 'Mở tài khoản ngân hàng', 'finance'],
  [39, 'Vay vốn', 'finance'],
  [40, 'Chuyển tiền', 'finance'],
  [41, 'Đổi ngoại tệ', 'finance'],
  [42, 'Tư vấn sức khỏe', 'health'],
  [43, 'Đặt lịch khám', 'health'],
  [44, 'Mua thuốc', 'health'],
  [45, 'Đăng ký phòng gym', 'health'],
  [46, 'Thuê căn hộ', 'property'],
  [47, 'Sửa nhà', 'property'],
  [48, 'Chuyển nhà', 'property'],
  [49, 'Tổ chức tiệc công ty', 'event'],
  [50, 'Mời tham dự sự kiện', 'event'],
  [51, 'Hủy đặt phòng', 'hotel'],
  [52, 'Xác nhận thanh toán', 'finance'],
  [53, 'Đổi lịch giao hàng', 'delivery'],
  [54, 'Phỏng vấn khách hàng', 'hr'],
  [55, 'Xử lý phản hồi tiêu cực', 'complaint'],
];

export const PART3_SITUATIONS: SituationItem[] = RAW_PART3.map(([order, title, clusterKey]) => {
  const cluster = CLUSTERS[clusterKey];
  const deep = DEEP_EXPANSIONS[order];
  const baseKeywords: KeywordItem[] = cluster.keywords.map((k) => ({
    word: k.word,
    meaning: k.meaning,
    origin: 'curriculum' as const,
  }));

  const mergedKeywords = deep ? [...baseKeywords, ...deep.keywords.filter((dk) => !baseKeywords.some((bk) => bk.word === dk.word))] : baseKeywords;
  const synonyms = deep ? deep.keywords.flatMap((k) => k.synonyms ?? []) : [];
  const examples = deep ? deep.keywords.flatMap((k) => (k.example ? [k.example] : [])) : [];
  const antonymsOrConfusing = deep
    ? [...deep.keywords.flatMap((k) => k.antonyms ?? []), ...deep.confusing]
    : [];

  return {
    id: `P3-${String(order).padStart(2, '0')}`,
    part: 'part3',
    order,
    title,
    description: `Hai hoặc ba người (thường là đồng nghiệp, nhân viên–khách hàng hoặc nhà cung cấp) trao đổi tại nơi làm việc hay qua điện thoại để xử lý việc: ${title.toLowerCase()}. Hãy xác định ai đang nói, vấn đề hiện tại và hành động tiếp theo.`,
    context: 'Hội thoại 2–3 người tại nơi làm việc hoặc qua điện thoại',
    backboneTopic: cluster.topic,
    difficulty: cluster.difficulty,
    keywords: mergedKeywords,
    synonyms,
    antonymsOrConfusing,
    examples,
    paraphrases: [],
    commonQuestionTypes: P3_QUESTION_TYPES,
    traps: [P3_TRAP],
    learningStrategy: P3_STRATEGY,
    selfQuestions: P3_SELF_QUESTIONS,
    hasDeepExpansion: Boolean(deep),
    sourceReference: deep
      ? `Giáo trình 220 tình huống (Part 3 #${order}) + Tài liệu bổ sung Part 1 & 2`
      : `Giáo trình 220 tình huống (Part 3 #${order})`,
  };
});
