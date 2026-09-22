import React from 'react';
import { Clock, Flame } from 'lucide-react';
import { Recipe } from '../types';

interface PlanScheduleViewProps {
  dinners: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  selectedRecipeId: string;
}

export const PlanScheduleView: React.FC<PlanScheduleViewProps> = ({
  dinners,
  onSelectRecipe,
  selectedRecipeId,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#2D2A26] tracking-tight">
            Weekly Dinners
          </h2>
        </div>

        {/* Legend pills */}
        <div className="flex items-center space-x-2 text-xs flex-wrap gap-y-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#697A53]/15 text-[#697A53] font-bold text-[11px] border border-[#697A53]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#697A53] mr-1.5" />
            Fresh Cook (&le;30m)
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F4C95D]/25 text-[#2D2A26] font-bold text-[11px] border border-[#F4C95D]/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F4C95D] mr-1.5" />
            Slow Cooker
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F8F5EE] text-[#706B63] font-bold text-[11px] border border-[#EADBCE]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#706B63] mr-1.5" />
            Leftover Night
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3.5">
        {dinners.map((dinner) => {
          const isSelected = selectedRecipeId === dinner.id;
          
          let bgClass = "bg-[#F8F5EE] border-[#EADBCE] hover:border-[#697A53]/50";
          if (dinner.isLeftoverNight) {
            bgClass = "bg-[#F8F5EE]/60 border-[#EADBCE] hover:border-[#EADBCE]";
          } else if (dinner.isSlowCooker) {
            bgClass = "bg-[#F4C95D]/10 border-[#F4C95D]/30 hover:border-[#F4C95D]/60";
          }

          return (
            <button
              key={dinner.id}
              onClick={() => onSelectRecipe(dinner.id)}
              className={`text-left p-4 rounded-xl border transition flex flex-col justify-between relative group ${bgClass} ${
                isSelected
                  ? 'ring-2 ring-[#697A53] shadow-md scale-[1.02]'
                  : 'hover:shadow-xs'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D2A26]">
                    {dinner.day.split(' ')[0]}
                  </span>
                  
                  {dinner.isLeftoverNight ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFFFF] text-[#706B63] border border-[#EADBCE] shadow-xs">
                      Leftover
                    </span>
                  ) : dinner.isSlowCooker ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFFFF] text-[#2D2A26] border border-[#F4C95D]/40 shadow-xs flex items-center gap-0.5">
                      <Flame className="h-2.5 w-2.5 text-[#F4C95D]" /> Slow
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFFFF] text-[#697A53] border border-[#697A53]/30 shadow-xs">
                      Fresh
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-[#2D2A26] line-clamp-2 leading-snug mb-3">
                  {dinner.title}
                </h3>
              </div>

              {/* Bottom Details */}
              <div className="pt-2.5 border-t border-[#EADBCE] text-[11px] text-[#706B63] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#2D2A26] font-medium text-[10px] border border-[#EADBCE] shadow-xs">
                    <Clock className="h-3 w-3 mr-1 text-[#697A53]" />
                    {dinner.activePrepMinutes}m
                  </span>
                  <span className="text-[#706B63] text-[10px] font-medium">
                    {dinner.totalTimeMinutes}m total
                  </span>
                </div>

                <div className="text-[10px] font-medium text-[#706B63] truncate" title={dinner.cuisine}>
                  {dinner.cuisine}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

