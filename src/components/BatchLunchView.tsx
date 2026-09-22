import React, { useState } from 'react';
import { Briefcase, Home, Calendar, Baby, FileDown, Clock, Utensils, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { BatchLunch } from '../types';
import { exportBatchLunchToPdf } from '../utils/pdfExport';

interface BatchLunchViewProps {
  batchLunches: BatchLunch[];
}

export const BatchLunchView: React.FC<BatchLunchViewProps> = ({ batchLunches }) => {
  // Store expanded recipe IDs
  const [expandedRecipeIds, setExpandedRecipeIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRecipeIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] space-y-6">
      {/* High Level Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EADBCE] pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/25">
              Prep Rhythms
            </span>
            <span className="text-[#EADBCE]">•</span>
            <span className="text-xs text-[#706B63] font-medium">Sunday & Tuesday Batch Cooks</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2D2A26] tracking-tight">
            Off-Day Batch Lunches
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#706B63] bg-[#F8F5EE] px-3.5 py-2 rounded-full border border-[#EADBCE]">
          <span className="font-semibold text-[#2D2A26]">Batch Prep:</span>
          <span>Portable Work & Easy Home Reheat Portions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batchLunches.map((lunch) => {
          const isExpanded = !!expandedRecipeIds[lunch.id];

          return (
            <div
              key={lunch.id}
              className="rounded-2xl border border-[#EADBCE] p-6 flex flex-col justify-between transition-all duration-200 bg-[#FFFFFF] shadow-xs hover:border-[#697A53]/40"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F8F5EE] text-[#2D2A26] border border-[#EADBCE] shadow-xs flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#697A53]" />
                    Prepped {lunch.prepDay}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-[#706B63] bg-[#F8F5EE] px-2.5 py-0.5 rounded-full border border-[#EADBCE]">
                      {lunch.servings} Portions
                    </span>
                    <button
                      onClick={() => exportBatchLunchToPdf(lunch)}
                      className="h-8 px-3 rounded-full bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] shadow-xs transition text-xs font-semibold flex items-center space-x-1"
                      title="Export this batch lunch recipe to PDF"
                    >
                      <FileDown className="h-3.5 w-3.5 text-[#5D6A74]" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#2D2A26] mb-1">
                  {lunch.title}
                </h3>
                <p className="text-xs text-[#706B63] mb-4">
                  Flavor profile: <span className="font-semibold text-[#2D2A26]">{lunch.flavorProfile}</span>
                </p>

                {/* High-Level Glance Summary (Compact & Easy to Read) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                  <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] text-xs">
                    <span className="font-bold text-[#5D6A74] flex items-center mb-1 text-[11px]">
                      <Briefcase className="h-3.5 w-3.5 mr-1 text-[#5D6A74] shrink-0" />
                      Work (Office)
                    </span>
                    <p className="text-[#706B63] text-[11px] line-clamp-2">
                      {lunch.workPackagingTips}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] text-xs">
                    <span className="font-bold text-[#697A53] flex items-center mb-1 text-[11px]">
                      <Home className="h-3.5 w-3.5 mr-1 text-[#697A53] shrink-0" />
                      Home (Reheat)
                    </span>
                    <p className="text-[#706B63] text-[11px] line-clamp-2">
                      {lunch.homeReheatTips}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] text-xs">
                    <span className="font-bold text-[#2D2A26] flex items-center mb-1 text-[11px]">
                      <Baby className="h-3.5 w-3.5 mr-1 text-[#697A53] shrink-0" />
                      Logan Toddler
                    </span>
                    <p className="text-[#706B63] text-[11px] line-clamp-2">
                      {lunch.toddlerModification.instructions}
                    </p>
                  </div>
                </div>

                {/* Detailed Recipe Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(lunch.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F8F5EE] hover:bg-[#F0EBE1] border border-[#EADBCE] text-[#2D2A26] text-xs font-bold flex items-center justify-between transition shadow-xs mb-2 group"
                >
                  <span className="flex items-center space-x-2">
                    <Utensils className="h-3.5 w-3.5 text-[#697A53]" />
                    <span>{isExpanded ? 'Hide Detailed Recipe & Prep Steps' : 'View Detailed Recipe & Prep Steps'}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#706B63] group-hover:text-[#2D2A26]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#706B63] group-hover:text-[#2D2A26]" />
                  )}
                </button>

                {/* Accurate & Detailed Recipe Section (Revealed when expanded) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#EADBCE] space-y-4 animate-in fade-in duration-200">
                    
                    {/* Distinct From Dinners Reason */}
                    <div className="bg-[#F8F5EE] rounded-xl p-3.5 border border-[#EADBCE] text-xs text-[#2D2A26]">
                      <span className="font-bold text-[#697A53] block mb-1">
                        Flavor Distinction from Dinners:
                      </span>
                      <p className="text-[#706B63] text-xs leading-relaxed">{lunch.distinctFromDinnersReason}</p>
                    </div>

                    {/* Ingredients with exact measurements */}
                    {lunch.ingredients && lunch.ingredients.length > 0 && (
                      <div className="bg-[#F8F5EE] rounded-xl p-4 border border-[#EADBCE]">
                        <span className="text-xs font-bold text-[#2D2A26] block mb-2 uppercase tracking-wider">
                          Ingredients ({lunch.servings} Portions)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {lunch.ingredients.map((ing, i) => (
                            <div key={i} className="flex items-center justify-between py-1 border-b border-[#EADBCE]/80 text-[#2D2A26]">
                              <span className="font-medium">• {ing.item}</span>
                              <span className="text-[#706B63] font-semibold">{ing.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step-by-step Batch Prep Steps */}
                    <div className="bg-[#F8F5EE] rounded-xl p-4 border border-[#EADBCE]">
                      <span className="text-xs font-bold text-[#2D2A26] block mb-2 uppercase tracking-wider">
                        Step-by-Step Batch Prep Instructions
                      </span>
                      <ol className="space-y-2.5">
                        {lunch.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-2.5 text-xs text-[#2D2A26] leading-relaxed">
                            <span className="h-5 w-5 rounded-full bg-[#697A53]/15 text-[#697A53] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Toddler & Dairy-Free Specifics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#F8F5EE] border border-[#EADBCE]">
                        <span className="font-bold text-[#2D2A26] flex items-center mb-1">
                          <Baby className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                          {lunch.toddlerModification.title}
                        </span>
                        <p className="text-[#706B63] text-xs leading-relaxed mb-1.5">
                          {lunch.toddlerModification.instructions}
                        </p>
                        {lunch.toddlerModification.fingerFoodTips && (
                          <p className="text-[#697A53] text-[11px] font-medium bg-[#697A53]/10 p-2 rounded-lg">
                            💡 Finger food: {lunch.toddlerModification.fingerFoodTips}
                          </p>
                        )}
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#697A53]/10 border border-[#697A53]/25">
                        <span className="font-bold text-[#697A53] flex items-center mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                          Taryn's 100% Dairy-Free Protocol
                        </span>
                        <p className="text-[#2D2A26] text-xs leading-relaxed">
                          {lunch.dairyFreeNotes || '100% dairy-free base. Free of all milk, cheese, butter, cream, and whey proteins.'}
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
