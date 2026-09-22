import React, { useRef } from 'react';
import { Clock, Flame, Utensils, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface WeeklyCalendarStripProps {
  dinners: Recipe[];
  selectedRecipeId: string;
  onSelectRecipe: (id: string) => void;
  onOpenQuickView?: (recipe: Recipe) => void;
}

export const WeeklyCalendarStrip: React.FC<WeeklyCalendarStripProps> = ({
  dinners,
  selectedRecipeId,
  onSelectRecipe,
  onOpenQuickView,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Extract day and optional date from dinner.day (e.g., "Monday (Oct 19)")
  const parseDayInfo = (dayStr: string, index: number) => {
    const parts = dayStr.split('(');
    const dayName = parts[0]?.trim() || `Day ${index + 1}`;
    const dateStr = parts[1] ? parts[1].replace(')', '').trim() : `Day ${index + 1}`;
    return { dayName, dateStr };
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-5 sm:p-7 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] space-y-4">
      {/* Header bar with title and scroll controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#697A53]">
              Monday – Sunday Rhythm
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#2D2A26] tracking-tight mt-0.5">
            Weekly Meal Planner
          </h3>
        </div>

        {/* Scroll arrow buttons for desktop & mobile ease */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-[#EADBCE] bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#706B63] hover:text-[#2D2A26] transition shadow-xs"
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-[#EADBCE] bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#706B63] hover:text-[#2D2A26] transition shadow-xs"
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Day-Column Grid: Monday through Sunday scrolling horizontally */}
      <div
        ref={scrollRef}
        className="flex items-stretch space-x-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-2 px-2"
      >
        {dinners.map((dinner, idx) => {
          const isSelected = selectedRecipeId === dinner.id;
          const { dayName, dateStr } = parseDayInfo(dinner.day, idx);

          return (
            <div
              key={dinner.id}
              className={`w-[82vw] sm:w-[290px] md:w-[310px] shrink-0 snap-start rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 bg-[#FFFFFF] relative group cursor-pointer ${
                isSelected
                  ? 'border-[#697A53] ring-2 ring-[#697A53]/30 shadow-[0_8px_24px_rgba(105,122,83,0.12)]'
                  : 'border-[#EADBCE] hover:border-[#697A53]/50 hover:shadow-[0_6px_16px_rgba(45,42,38,0.06)]'
              }`}
              onClick={() => {
                onSelectRecipe(dinner.id);
                if (onOpenQuickView) onOpenQuickView(dinner);
              }}
            >
              {/* Top Header: Day Name, Date, and Active indicator */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE]/80">
                  <div>
                    <span className="text-sm font-bold text-[#2D2A26] block">
                      {dayName}
                    </span>
                    <span className="text-[11px] font-medium text-[#706B63]">
                      {dateStr}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#697A53] text-[#FFFFFF] shadow-xs flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FFFFFF] animate-pulse mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8F5EE] text-[#706B63] border border-[#EADBCE]">
                      {dinner.isLeftoverNight ? 'Leftovers' : dinner.isSlowCooker ? 'Slow Cook' : 'Fresh'}
                    </span>
                  )}
                </div>

                {/* Meal Title & Flavor */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 flex-wrap text-[10px] font-bold uppercase tracking-wider">
                    {dinner.isLeftoverNight ? (
                      <span className="text-[#706B63]">Leftover Encore</span>
                    ) : dinner.isSlowCooker ? (
                      <span className="text-[#697A53] flex items-center">
                        <Flame className="h-3 w-3 mr-1 text-[#F4C95D]" /> Slow Cooker
                      </span>
                    ) : (
                      <span className="text-[#697A53]">Fresh Cook (&le;30m)</span>
                    )}
                    <span className="text-[#EADBCE]">•</span>
                    <span className="text-[#706B63] lowercase font-normal">{dinner.cuisine}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#2D2A26] leading-snug line-clamp-2 group-hover:text-[#697A53] transition-colors">
                    {dinner.title}
                  </h4>
                </div>
              </div>

              {/* Badges and Footer Action */}
              <div className="mt-4 pt-3 border-t border-[#EADBCE]/70 space-y-3">
                {/* Dietary Tags matching tokens */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/25">
                    DF
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4C95D]/25 text-[#2D2A26] border border-[#F4C95D]/40">
                    GF / Soy Safe
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F8F5EE] text-[#706B63] border border-[#EADBCE]">
                    Toddler Mod
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="inline-flex items-center text-[#706B63] font-medium text-[11px]">
                    <Clock className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                    {dinner.activePrepMinutes}m prep • {dinner.totalTimeMinutes}m total
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRecipe(dinner.id);
                      if (onOpenQuickView) onOpenQuickView(dinner);
                    }}
                    className="text-[11px] font-bold text-[#5D6A74] hover:text-[#2D2A26] bg-[#F8F5EE] hover:bg-[#EADBCE]/40 px-2.5 py-1 rounded-full border border-[#EADBCE] transition"
                  >
                    Quick View
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
