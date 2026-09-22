import React from 'react';
import { Calendar, Sparkles, ArrowRight, Utensils } from 'lucide-react';

interface DashboardHeroProps {
  weekOf: string;
  onViewCurrentWeek: () => void;
  onPlanNextWeek: () => void;
  dinnersCount?: number;
  leftoversCount?: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  weekOf,
  onViewCurrentWeek,
  onPlanNextWeek,
  dinnersCount = 4,
  leftoversCount = 3,
}) => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Left Card: View Current Week */}
        <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 sm:p-7 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle background decorative wash */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#697A53]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#697A53]/15 text-[#697A53] flex items-center justify-center border border-[#697A53]/20 shadow-xs">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#697A53]/10 text-[#697A53] border border-[#697A53]/20">
                Current Week
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A26] tracking-tight">
              View Current Week
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#706B63] mt-1.5 leading-relaxed">
              {weekOf || 'Current Calendar Cycle'} • {dinnersCount} Dinners & {leftoversCount} Leftover Nights
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EADBCE]/70 flex items-center justify-end">
            <button
              onClick={onViewCurrentWeek}
              className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] transition shadow-xs group-hover:shadow-md"
            >
              <span>View Current Week</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Card: Plan Next Week */}
        <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 sm:p-7 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle background decorative wash */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4C95D]/15 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#F4C95D]/25 text-[#2D2A26] flex items-center justify-center border border-[#F4C95D]/40 shadow-xs">
                <Sparkles className="h-6 w-6 text-[#2D2A26]" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F4C95D]/25 text-[#2D2A26] border border-[#F4C95D]/40">
                AI Powered
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A26] tracking-tight">
              Plan Next Week
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#706B63] mt-1.5 leading-relaxed">
              Generate menu & shopping list tailored to your household schedule and cravings.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EADBCE]/70 flex items-center justify-end">
            <button
              onClick={onPlanNextWeek}
              className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition shadow-xs group-hover:shadow-md"
            >
              <span>Plan Next Week</span>
              <Sparkles className="h-3.5 w-3.5 ml-1.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
