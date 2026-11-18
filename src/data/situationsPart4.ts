import type { DifficultyLevel, KeywordItem, SituationItem } from '../types/toeic';

const P4_QUESTIONS = [
  'Người nói là ai / đang ở đâu?',
  'Thông báo nhằm mục đích gì?',
  'Người nghe cần làm gì hoặc thông tin nào vừa thay đổi?',
];

const P4_TRAP =
  'Nhầm thời gian/địa điểm cũ với thông tin vừa cập nhật; chọn chi tiết được nhắc nhưng không trả lời câu hỏi. Chú ý however, instead, starting, due to.';

const P4_STRATEGY =
  'Nhận diện loại bài nói ngay từ câu mở đầu: thông báo, quảng cáo, hướng dẫn, giới thiệu hay lời nhắn. Nghe các tín hiệu diễn ngôn: Attention, We are pleased to announce, Due to, Please note, As a reminder, Instead.';

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
  tech: {
    topic: 'Công nghệ & truyền thông',
    difficulty: 'Trung bình–Cao',
    keywords: [
      { word: 'software update', meaning: 'cập nhật phần mềm' },
      { word: 'log in', meaning: 'đăng nhập' },
      { word: 'system outage', meaning: 'gián đoạn hệ thống' },
      { word: 'troubleshoot', meaning: 'khắc phục sự cố' },
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
};

const DEEP_EXPANSIONS: Record<
  number,
  {
    keywords: KeywordItem[];
    confusing: string[];
  }
> = {
  1: {
    keywords: [
      { word: 'announcement', meaning: 'thông báo', synonyms: ['notice', 'internal memo'], example: 'This is an important announcement for all staff.', origin: 'curriculum' },
      { word: 'effective', meaning: 'có hiệu lực', synonyms: ['effective date', 'starting from'], example: 'The new policy is effective next Monday.', origin: 'curriculum' },
      { word: 'mandatory', meaning: 'bắt buộc', synonyms: ['required', 'compulsory'], antonyms: ['optional'], example: 'Attendance at the meeting is mandatory.', origin: 'curriculum' },
      { word: 'reminder', meaning: 'lời nhắc', synonyms: ['as a reminder'], example: 'This is a reminder about the safety drill.', origin: 'curriculum' },
      { word: 'update', meaning: 'cập nhật', synonyms: ['inform', 'notify of changes'], example: 'We have an update on the project timeline.', origin: 'curriculum' },
      { word: 'attention', meaning: 'chú ý', synonyms: ['please note', 'attention all employees'], example: 'Attention, please. The elevators will be out of service.', origin: 'curriculum' },
    ],
    confusing: ['mandatory ≠ optional', 'announcement ≠ reminder'],
  },
  2: {
    keywords: [
      { word: 'voicemail', meaning: 'tin nhắn thoại', synonyms: ['leave a message', 'voice message'], example: 'Please leave a message after the tone.', origin: 'curriculum' },
      { word: 'return the call', meaning: 'gọi lại', synonyms: ['call back'], example: "I'll return your call as soon as possible.", origin: 'curriculum' },
      { word: 'urgent', meaning: 'khẩn', synonyms: ['important', 'time-sensitive'], antonyms: ['routine'], example: 'This is an urgent message.', origin: 'curriculum' },
      { word: 'unavailable', meaning: 'không có mặt', synonyms: ['not available', 'out of the office'], antonyms: ['available'], example: "I'm currently unavailable.", origin: 'curriculum' },
      { word: 'contact', meaning: 'liên hệ', synonyms: ['reach', 'get in touch'], example: 'You can contact me at this number.', origin: 'curriculum' },
      { word: 'regarding', meaning: 'về vấn đề', synonyms: ['about', 'concerning'], example: "I'm calling regarding your order.", origin: 'curriculum' },
    ],
    confusing: ['unavailable ≠ available', 'urgent ≠ routine'],
  },
};

const RAW_PART4: [number, string, keyof typeof CLUSTERS, string][] = [
  [1, 'Thông báo nội bộ', 'maintenance', 'Thông báo'],
  [2, 'Tin nhắn thoại', 'maintenance', 'Tin nhắn / Dịch vụ'],
  [3, 'Hướng dẫn viên du lịch thuyết minh', 'flight', 'Hướng dẫn'],
  [4, 'Quảng cáo sản phẩm', 'marketing', 'Quảng cáo'],
  [5, 'Thông báo sân bay', 'flight', 'Thông báo'],
  [6, 'Thay đổi lịch bay', 'flight', 'Thông báo'],
  [7, 'Giới thiệu sản phẩm mới', 'education', 'Quảng cáo'],
  [8, 'Hướng dẫn sử dụng thiết bị', 'project', 'Hướng dẫn'],
  [9, 'Cảnh báo an toàn', 'safety', 'Thông báo'],
  [10, 'Đào tạo nhân viên', 'education', 'Hướng dẫn'],
  [11, 'Phát biểu khai mạc hội nghị', 'meeting', 'Phát biểu'],
  [12, 'Giới thiệu diễn giả', 'education', 'Phát biểu'],
  [13, 'Thông báo kết quả cuộc họp', 'meeting', 'Thông báo'],
  [14, 'Nhắc lịch thanh toán', 'finance', 'Thông tin dịch vụ'],
  [15, 'Thông báo tuyển dụng', 'hr', 'Thông báo'],
  [16, 'Giới thiệu chính sách mới', 'education', 'Thông báo'],
  [17, 'Hướng dẫn bảo quản sản phẩm', 'marketing', 'Hướng dẫn'],
  [18, 'Thông tin thời tiết', 'safety', 'Thông tin dịch vụ'],
  [19, 'Thông báo giao thông', 'transit', 'Thông báo'],
  [20, 'Thông báo sự kiện cộng đồng', 'event', 'Thông báo'],
  [21, 'Khuyến mãi cửa hàng', 'marketing', 'Quảng cáo'],
  [22, 'Lễ ra mắt sản phẩm', 'marketing', 'Phát biểu'],
  [23, 'Thông báo bảo trì hệ thống', 'tech', 'Thông báo'],
  [24, 'Hướng dẫn sơ tán', 'safety', 'Hướng dẫn'],
  [25, 'Thông báo chuyến tàu', 'flight', 'Thông báo'],
  [26, 'Giới thiệu tour du lịch', 'flight', 'Quảng cáo'],
  [27, 'Thuyết minh bảo tàng', 'maintenance', 'Hướng dẫn'],
  [28, 'Thông báo nhập học', 'education', 'Thông báo'],
  [29, 'Hướng dẫn thi', 'education', 'Hướng dẫn'],
  [30, 'Thông báo lịch nghỉ lễ', 'maintenance', 'Thông báo'],
  [31, 'Tin nhắn chăm sóc khách hàng', 'maintenance', 'Thông tin dịch vụ'],
  [32, 'Xác nhận đặt hàng', 'maintenance', 'Thông tin dịch vụ'],
  [33, 'Nhắc gia hạn dịch vụ', 'complaint', 'Thông tin dịch vụ'],
  [34, 'Giới thiệu ứng dụng', 'tech', 'Quảng cáo'],
  [35, 'Hướng dẫn đăng ký', 'policy', 'Hướng dẫn'],
  [36, 'Thông báo lỗi hệ thống', 'tech', 'Thông báo'],
  [37, 'Cập nhật phần mềm', 'tech', 'Thông báo'],
  [38, 'Giới thiệu quy trình làm việc', 'education', 'Hướng dẫn'],
  [39, 'Phổ biến an toàn lao động', 'safety', 'Hướng dẫn'],
  [40, 'Phát biểu bế mạc', 'event', 'Phát biểu'],
  [41, 'Cảm ơn đối tác', 'maintenance', 'Phát biểu'],
  [42, 'Giới thiệu nhân sự mới', 'hr', 'Phát biểu'],
  [43, 'Thông báo thuyên chuyển nhân sự', 'hr', 'Thông báo'],
  [44, 'Thông báo giải thưởng', 'maintenance', 'Thông báo'],
  [45, 'Hướng dẫn tham quan', 'policy', 'Hướng dẫn'],
  [46, 'Quảng cáo du lịch', 'flight', 'Quảng cáo'],
  [47, 'Thông báo hoàn tiền', 'complaint', 'Thông tin dịch vụ'],
  [48, 'Nhắc lịch hẹn', 'maintenance', 'Thông tin dịch vụ'],
  [49, 'Hướng dẫn thanh toán', 'finance', 'Hướng dẫn'],
  [50, 'Thông báo tạm đóng cửa', 'maintenance', 'Thông báo'],
  [51, 'Giới thiệu chương trình đào tạo', 'education', 'Quảng cáo'],
  [52, 'Thông báo kết quả thi', 'education', 'Thông báo'],
  [53, 'Hướng dẫn sử dụng phần mềm', 'tech', 'Hướng dẫn'],
  [54, 'Cảnh báo thời tiết xấu', 'safety', 'Thông báo'],
  [55, 'Thông báo thay đổi địa điểm tổ chức', 'event', 'Thông báo'],
];

export const PART4_SITUATIONS: SituationItem[] = RAW_PART4.map(([order, title, clusterKey, talkCategory]) => {
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
    id: `P4-${String(order).padStart(2, '0')}`,
    part: 'part4',
    order,
    title,
    description: `Một người phát thông tin (nhân viên, quản lý, nhân viên dịch vụ hoặc người dẫn chương trình) nói với khách hàng/nhân viên/công chúng về ${title.toLowerCase()}. Nghe mục đích, đối tượng, mốc thời gian và chỉ dẫn.`,
    context: `${talkCategory} — Bài nói ngắn 1 người nói`,
    backboneTopic: cluster.topic,
    difficulty: cluster.difficulty,
    keywords: mergedKeywords,
    synonyms,
    antonymsOrConfusing,
    examples,
    paraphrases: [],
    commonQuestionTypes: P4_QUESTIONS,
    traps: [P4_TRAP],
    learningStrategy: P4_STRATEGY,
    hasDeepExpansion: Boolean(deep),
    sourceReference: deep
      ? `Giáo trình 220 tình huống (Part 4 #${order}) + Tài liệu bổ sung Part 1 & 2`
      : `Giáo trình 220 tình huống (Part 4 #${order})`,
  };
});
