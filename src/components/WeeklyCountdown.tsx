import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { nextSundayMs, countdownTo } from '@/lib/weekly';

interface Props {
  label?: string;
}

const WeeklyCountdown = ({ label = '🔄 Novos exercícios em' }: Props) => {
  const [c, setC] = useState(() => countdownTo(nextSundayMs()));

  useEffect(() => {
    const id = setInterval(() => setC(countdownTo(nextSundayMs())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
      <span className="font-bold text-foreground flex items-center gap-1">
        <Clock size={14} className="text-primary" /> {label}
      </span>
      <span className="font-black text-primary tabular-nums">
        {c.days}d {String(c.hours).padStart(2,'0')}:{String(c.minutes).padStart(2,'0')}:{String(c.seconds).padStart(2,'0')}
      </span>
    </div>
  );
};

export default WeeklyCountdown;
