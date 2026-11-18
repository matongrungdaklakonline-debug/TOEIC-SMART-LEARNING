import type { DifficultyLevel, KeywordItem, SituationItem } from '../types/toeic';

const P7_QUESTIONS = [
  'main idea',
  'detail',
  'inference',
  'vocabulary in context',
  'purpose',
  'NOT/EXCEPT',
  'reference',
  'information in another document',
];

const P7_SKILLS = [
  'Skimming tiêu đề và mục đích',
  'Scanning tên riêng / số / ngày',
  'Đối chiếu chéo giữa các tài liệu (Single / Double / Triple)',
];

const P7_TRAP =
  'Suy luận vượt quá dữ kiện; bỏ sót điều kiện ở chú thích, ngày tháng hoặc tài liệu liên kết. Chỉ chọn điều được văn bản hỗ trợ.';

const P7_STRATEGY =
  'Xác định loại tài liệu và mục đích đọc trước khi tìm chi tiết. Đọc nhanh tiêu đề/người gửi/mục đích; xem câu hỏi; quét tên, ngày, giá, địa điểm; quay lại đọc vùng chứa bằng chứng. Với double/triple, lập bảng đối chiếu.';

type KwCluster = {
  topic: string;
  difficulty: DifficultyLevel;
  keywords: { word: string; meaning: string }[];
};

const CLUSTERS: Record<string, KwCluster> = {
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
  safety: {
    topic: 'An toàn & môi trường',
    difficulty: 'Trung bình',
    keywords: [
      { word: 'forecast', meaning: 'dự báo' },
      { word: 'conditions', meaning: 'điều kiện thời tiết' },
      { word: 'severe', meaning: 'khắc nghiệt' },
      { word: 'postpone', meaning: 'hoãn' },
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

const RAW_PART7: [number, string, keyof typeof CLUSTERS][] = [
  [1, 'Email trao đổi công việc', 'maintenance'],
  [2, 'Chuỗi email khách hàng – nhà cung cấp', 'contract'],
  [3, 'Thư mời họp', 'meeting'],
  [4, 'Biên bản họp', 'meeting'],
  [5, 'Báo cáo tháng', 'maintenance'],
  [6, 'Báo cáo tài chính', 'finance'],
  [7, 'Hóa đơn', 'finance'],
  [8, 'Biên lai', 'finance'],
  [9, 'Bảng lương', 'shift'],
  [10, 'Hợp đồng', 'contract'],
  [11, 'Phụ lục hợp đồng', 'contract'],
  [12, 'Thông báo tuyển dụng', 'hr'],
  [13, 'CV', 'hr'],
  [14, 'Thư xin việc', 'hr'],
  [15, 'Email phỏng vấn', 'hr'],
  [16, 'Thông báo kết quả tuyển dụng', 'hr'],
  [17, 'Bài báo kinh doanh', 'maintenance'],
  [18, 'Thông cáo báo chí', 'maintenance'],
  [19, 'Quảng cáo', 'marketing'],
  [20, 'Tờ rơi', 'maintenance'],
  [21, 'Menu nhà hàng', 'dining'],
  [22, 'Đánh giá khách hàng', 'complaint'],
  [23, 'Phản hồi dịch vụ', 'complaint'],
  [24, 'Phiếu khảo sát', 'maintenance'],
  [25, 'Lịch trình tour', 'flight'],
  [26, 'Brochure du lịch', 'flight'],
  [27, 'Thông báo chuyến bay', 'flight'],
  [28, 'Thẻ lên máy bay', 'flight'],
  [29, 'Xác nhận đặt phòng', 'hotel'],
  [30, 'Hóa đơn khách sạn', 'hotel'],
  [31, 'Email hủy phòng', 'hotel'],
  [32, 'Thông báo thay đổi lịch', 'maintenance'],
  [33, 'Hướng dẫn sử dụng', 'policy'],
  [34, 'Tài liệu đào tạo', 'education'],
  [35, 'Nội quy công ty', 'policy'],
  [36, 'Chính sách bảo hành', 'policy'],
  [37, 'Phiếu bảo hành', 'policy'],
  [38, 'Đơn đặt hàng', 'maintenance'],
  [39, 'Xác nhận giao hàng', 'delivery'],
  [40, 'Phiếu giao nhận', 'delivery'],
  [41, 'Thông báo vận chuyển', 'delivery'],
  [42, 'Email khiếu nại', 'complaint'],
  [43, 'Email xin lỗi', 'complaint'],
  [44, 'Biên bản sự cố', 'meeting'],
  [45, 'Thông báo an toàn', 'safety'],
  [46, 'Bảng giá', 'finance'],
  [47, 'Báo giá', 'finance'],
  [48, 'Chương trình khuyến mãi', 'marketing'],
  [49, 'Thông báo sự kiện', 'event'],
  [50, 'Giấy mời', 'maintenance'],
  [51, 'Biểu mẫu đăng ký', 'maintenance'],
  [52, 'Thông báo hoàn tiền', 'complaint'],
  [53, 'Thông báo tăng giá', 'finance'],
  [54, 'Email đàm phán', 'contract'],
  [55, 'Bảng so sánh sản phẩm', 'marketing'],
];

export const PART7_SITUATIONS: SituationItem[] = RAW_PART7.map(([order, title, clusterKey]) => {
  const cluster = CLUSTERS[clusterKey];
  const keywords: KeywordItem[] = cluster.keywords.map((k) => ({
    word: k.word,
    meaning: k.meaning,
    origin: 'curriculum' as const,
  }));

  return {
    id: `P7-${String(order).padStart(2, '0')}`,
    part: 'part7',
    order,
    title,
    description: `Tài liệu đơn hoặc một bộ tài liệu liên quan đến ${title.toLowerCase()}; thông tin có thể nằm ở tiêu đề, phần thân, ghi chú, bảng hoặc tài liệu thứ hai/thứ ba.`,
    context: 'Single passage / Double passage / Triple passage',
    backboneTopic: cluster.topic,
    difficulty: cluster.difficulty,
    keywords,
    synonyms: [],
    antonymsOrConfusing: [],
    examples: [],
    paraphrases: [],
    commonQuestionTypes: P7_QUESTIONS,
    passageFormats: ['Single passage', 'Double passage', 'Triple passage'],
    readingSkills: P7_SKILLS,
    traps: [P7_TRAP],
    learningStrategy: P7_STRATEGY,
    sourceReference: `Giáo trình 220 tình huống (Part 7 #${order})`,
  };
});
