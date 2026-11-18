import type { DifficultyLevel, KeywordItem, SituationItem } from '../types/toeic';

const P6_GRAMMAR = [
  'Dạng từ (noun / verb / adj / adv)',
  'Giới từ đi với cụm',
  'Liên từ chỉ nguyên nhân – tương phản – kết quả',
  'Thì và hòa hợp chủ-vị',
  'Đại từ tham chiếu',
];

const P6_QUESTIONS = [
  'Điền từ vựng / ngữ pháp',
  'Điền câu phù hợp vị trí trong đoạn',
];

const P6_TRAP =
  'Chọn từ đúng nghĩa nhưng sai loại từ/giới từ; bỏ qua liên từ hoặc đại từ tham chiếu. Đọc cả câu trước và sau chỗ trống.';

const P6_STRATEGY =
  'Đừng điền chỗ trống bằng cách chỉ nhìn một câu. Cần kiểm tra cấu trúc ngữ pháp và mạch ý của toàn đoạn. Đọc câu trước và sau chỗ trống; xác định từ loại trước, sau đó mới xét nghĩa. Với câu chèn, kiểm tra đại từ, từ nối và trình tự ý.';

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
};

const RAW_PART6: [number, string, keyof typeof CLUSTERS][] = [
  [1, 'Email xác nhận đặt phòng', 'hotel'],
  [2, 'Email thay đổi lịch họp', 'meeting'],
  [3, 'Thông báo nội bộ', 'maintenance'],
  [4, 'Thông báo tuyển dụng', 'hr'],
  [5, 'Quảng cáo sản phẩm', 'marketing'],
  [6, 'Quảng cáo khóa học', 'education'],
  [7, 'Thông báo khuyến mãi', 'marketing'],
  [8, 'Email cảm ơn khách hàng', 'maintenance'],
  [9, 'Email xin lỗi khách hàng', 'complaint'],
  [10, 'Email phản hồi khiếu nại', 'complaint'],
  [11, 'Thông báo bảo trì', 'project'],
  [12, 'Hướng dẫn sử dụng', 'policy'],
  [13, 'Biên bản cuộc họp', 'meeting'],
  [14, 'Báo cáo tiến độ', 'project'],
  [15, 'Báo cáo sự cố', 'project'],
  [16, 'Thông cáo báo chí', 'maintenance'],
  [17, 'Bài báo ngắn', 'maintenance'],
  [18, 'Bản tin công ty', 'maintenance'],
  [19, 'Thông báo lịch nghỉ', 'maintenance'],
  [20, 'Thông báo thay đổi chính sách', 'policy'],
  [21, 'Email mời họp', 'meeting'],
  [22, 'Email xác nhận đơn hàng', 'delivery'],
  [23, 'Hóa đơn', 'finance'],
  [24, 'Biên lai', 'finance'],
  [25, 'Phiếu giao hàng', 'delivery'],
  [26, 'Biểu mẫu đăng ký', 'maintenance'],
  [27, 'Đơn xin nghỉ phép', 'shift'],
  [28, 'Đơn xin việc', 'hr'],
  [29, 'Thư giới thiệu', 'education'],
  [30, 'Email đàm phán hợp đồng', 'contract'],
  [31, 'Email gia hạn hợp đồng', 'contract'],
  [32, 'Thông báo giá', 'finance'],
  [33, 'Bảng báo giá', 'finance'],
  [34, 'Lịch trình sự kiện', 'flight'],
  [35, 'Chương trình hội thảo', 'maintenance'],
  [36, 'Thư mời tham dự', 'event'],
  [37, 'Thông báo kết quả tuyển dụng', 'hr'],
  [38, 'Email hướng dẫn phỏng vấn', 'hr'],
  [39, 'Thông báo đào tạo', 'education'],
  [40, 'Phiếu khảo sát', 'maintenance'],
  [41, 'Bản mô tả công việc', 'hr'],
  [42, 'Thông báo nội quy', 'policy'],
  [43, 'Hướng dẫn an toàn', 'safety'],
  [44, 'Thông báo hoàn tiền', 'complaint'],
  [45, 'Email nhắc thanh toán', 'finance'],
  [46, 'Xác nhận hủy dịch vụ', 'complaint'],
  [47, 'Thông báo thay đổi địa điểm', 'maintenance'],
  [48, 'Email đặt lịch hẹn', 'maintenance'],
  [49, 'Thông báo vận chuyển', 'delivery'],
  [50, 'Email xác nhận bảo hành', 'policy'],
  [51, 'Thông báo khen thưởng', 'shift'],
  [52, 'Thông báo chuyển văn phòng', 'property'],
  [53, 'Email xác nhận tham dự', 'event'],
  [54, 'Thông báo tăng giá dịch vụ', 'complaint'],
  [55, 'Phiếu đánh giá dịch vụ', 'complaint'],
];

export const PART6_SITUATIONS: SituationItem[] = RAW_PART6.map(([order, title, clusterKey]) => {
  const cluster = CLUSTERS[clusterKey];
  const keywords: KeywordItem[] = cluster.keywords.map((k) => ({
    word: k.word,
    meaning: k.meaning,
    origin: 'curriculum' as const,
  }));

  return {
    id: `P6-${String(order).padStart(2, '0')}`,
    part: 'part6',
    order,
    title,
    description: `Văn bản thường là email, thông báo, quảng cáo, biểu mẫu hoặc bản tin về ${title.toLowerCase()}. Người đọc cần nhận ra quan hệ logic giữa các câu và chọn từ/câu phù hợp với văn phong.`,
    context: '4 đoạn văn; mỗi đoạn 4 chỗ trống (từ vựng, ngữ pháp, câu phù hợp ngữ cảnh)',
    backboneTopic: cluster.topic,
    difficulty: cluster.difficulty,
    keywords,
    synonyms: [],
    antonymsOrConfusing: [],
    examples: [],
    paraphrases: [],
    commonQuestionTypes: P6_QUESTIONS,
    grammarFocus: P6_GRAMMAR,
    traps: [P6_TRAP],
    learningStrategy: P6_STRATEGY,
    sourceReference: `Giáo trình 220 tình huống (Part 6 #${order})`,
  };
});
