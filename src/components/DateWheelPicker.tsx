import { useState, useRef, useEffect, useCallback } from 'react';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function WheelColumn({ items, selectedIndex, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const animFrame = useRef<number>();

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (!containerRef.current) return;
    const target = index * ITEM_HEIGHT;
    if (smooth) {
      containerRef.current.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      containerRef.current.scrollTop = target;
    }
  }, []);

  useEffect(() => {
    scrollToIndex(selectedIndex, false);
  }, []);

  const snapToNearest = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    scrollToIndex(clamped);
    onChange(clamped);
  }, [items.length, onChange, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (isDragging.current) return;
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(() => {
      // Will snap after scroll ends
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    startScroll.current = containerRef.current?.scrollTop || 0;
    lastY.current = e.touches[0].clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const currentY = e.touches[0].clientY;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (lastY.current - currentY) / dt;
    }
    lastY.current = currentY;
    lastTime.current = now;
    const diff = startY.current - currentY;
    containerRef.current.scrollTop = startScroll.current + diff;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    snapToNearest();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = containerRef.current?.scrollTop || 0;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const diff = startY.current - e.clientY;
    containerRef.current.scrollTop = startScroll.current + diff;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    snapToNearest();
  };

  // Also snap on native scroll end
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isDragging.current) snapToNearest();
      }, 100);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, [snapToNearest]);

  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 pointer-events-none border-t-2 border-b-2 border-pollo-marron/30 z-10"
        style={{ top: ITEM_HEIGHT * paddingItems, height: ITEM_HEIGHT }}
      />
      {/* Fade top */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
      {/* Fade bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scrollbar-hide select-none"
        style={{ scrollSnapType: 'y mandatory' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onScroll={handleScroll}
      >
        {/* Top padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`pad-top-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
        {items.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={i}
              className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'text-pollo-marron font-bold text-lg'
                  : 'text-pollo-marron/40 text-base'
              }`}
              style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'center' }}
              onClick={() => {
                onChange(i);
                scrollToIndex(i);
              }}
            >
              {item}
            </div>
          );
        })}
        {/* Bottom padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`pad-bot-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}

interface DateWheelPickerProps {
  value?: string; // YYYY-MM-DD
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export function DateWheelPicker({ value, onConfirm, onCancel }: DateWheelPickerProps) {
  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;

  const [monthIndex, setMonthIndex] = useState(parsed ? parsed.getMonth() : today.getMonth());
  const [dayIndex, setDayIndex] = useState(parsed ? parsed.getDate() - 1 : today.getDate() - 1);
  const [yearIndex, setYearIndex] = useState(0);

  const startYear = 1900;
  const endYear = today.getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => String(startYear + i));

  useEffect(() => {
    const y = parsed ? parsed.getFullYear() : 2000;
    const idx = years.indexOf(String(y));
    setYearIndex(idx >= 0 ? idx : years.indexOf('2000'));
  }, []);

  const selectedYear = parseInt(years[yearIndex] || String(endYear));
  const selectedMonth = monthIndex + 1;

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  useEffect(() => {
    if (dayIndex >= daysInMonth) {
      setDayIndex(daysInMonth - 1);
    }
  }, [daysInMonth, dayIndex]);

  const handleConfirm = () => {
    const m = String(selectedMonth).padStart(2, '0');
    const d = String(dayIndex + 1).padStart(2, '0');
    const y = years[yearIndex];
    onConfirm(`${y}-${m}-${d}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onCancel}>
      <div
        className="w-full max-w-sm bg-white rounded-t-2xl p-5 pb-8 shadow-xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-pollo-marron font-bold text-base mb-4">Seleccionar fecha</p>

        <div className="flex gap-2">
          <div className="flex-1">
            <WheelColumn
              items={MONTHS_ES}
              selectedIndex={monthIndex}
              onChange={setMonthIndex}
            />
          </div>
          <div className="w-16">
            <WheelColumn
              items={days}
              selectedIndex={dayIndex}
              onChange={setDayIndex}
            />
          </div>
          <div className="w-20">
            <WheelColumn
              items={years}
              selectedIndex={yearIndex}
              onChange={setYearIndex}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-pollo-marron/60 hover:text-pollo-marron transition-colors"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-bold text-pollo-marron hover:text-pollo-amarillo transition-colors"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
}
