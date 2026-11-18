import { useEffect, useRef, useState } from 'react';
import { Volume2, Square, Eye, EyeOff } from 'lucide-react';
import { speakLines, stopSpeaking } from '../utils/speech';

interface AudioPlayerBarProps {
  lines: string[];
  speed: number;
  onSpeedChange: (speed: number) => void;
  title?: string;
  allowTranscriptToggle?: boolean;
  defaultShowTranscript?: boolean;
}

const SPEEDS = [0.75, 1, 1.15, 1.25];

export function AudioPlayerBar({
  lines,
  speed,
  onSpeedChange,
  title = 'Trình phát luyện nghe mô phỏng (Web Speech TTS)',
  allowTranscriptToggle = true,
  defaultShowTranscript = false,
}: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [showTranscript, setShowTranscript] = useState(defaultShowTranscript);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
      stopSpeaking();
    };
  }, [lines]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      cancelRef.current?.();
      stopSpeaking();
      setIsPlaying(false);
      setActiveLine(-1);
      return;
    }
    setIsPlaying(true);
    cancelRef.current = speakLines(
      lines,
      speed,
      (idx) => setActiveLine(idx),
      () => {
        setIsPlaying(false);
        setActiveLine(-1);
      }
    );
  };

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={!speechSupported || lines.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {isPlaying ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isPlaying ? 'Dừng phát' : 'Phát Audio'}</span>
          </button>
          <div>
            <p className="text-sm font-medium text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">
              {speechSupported
                ? 'Bài luyện tập mở rộng · Giọng đọc tổng hợp từ trình duyệt'
                : 'Trình duyệt không hỗ trợ SpeechSynthesis — vui lòng đọc transcript bên dưới.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Tốc độ phát">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium font-mono-num transition-colors whitespace-nowrap shrink-0 ${
                  speed === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {allowTranscriptToggle && (
            <button
              type="button"
              onClick={() => setShowTranscript((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              {showTranscript ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showTranscript ? 'Ẩn Transcript' : 'Hiện Transcript'}</span>
            </button>
          )}
        </div>
      </div>

      {showTranscript && (
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <p className="text-xs font-medium text-slate-500">
            Transcript luyện tập mở rộng (đối chiếu mạch hội thoại & tín hiệu paraphrase):
          </p>
          <div className="space-y-1.5 text-sm leading-relaxed text-slate-800">
            {lines.map((line, i) => (
              <p
                key={i}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  activeLine === i ? 'bg-blue-50 text-blue-950 font-medium' : 'bg-slate-50/70'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
