import React from 'react';
import { FileText, AlertTriangle, CheckCircle2, ExternalLink, X, Calendar, Utensils, ShoppingCart } from 'lucide-react';
import { PERMANENT_GOOGLE_DOC_ID, WeeklyPlan } from '../types';

interface GoogleDocSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plan: WeeklyPlan;
  isLoading: boolean;
  result: {
    success: boolean;
    message: string;
    docUrl: string;
  } | null;
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export const GoogleDocSyncModal: React.FC<GoogleDocSyncModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
  isLoading,
  result,
  isAuthenticated,
  onSignIn,
}) => {
  if (!isOpen) return null;

  const docUrl = `https://docs.google.com/document/d/${PERMANENT_GOOGLE_DOC_ID}/edit`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl shadow-2xl text-[#2D2A26] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between bg-[#F8F5EE]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#697A53]/15 text-[#697A53]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D2A26]">
                Live Weekly Meal Planner Sync
              </h3>
              <p className="text-xs text-[#706B63]">
                Shared Family Google Doc (<span className="font-mono text-[#5D6A74]">1zmwLPiV...</span>)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#706B63] hover:text-[#2D2A26] p-2 rounded-full hover:bg-[#F8F5EE] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs text-[#2D2A26]">
          
          {result ? (
            <div className="space-y-4 text-center py-4">
              {result.success ? (
                <div className="space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[#697A53]/15 flex items-center justify-center text-[#697A53]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#2D2A26]">
                    Google Doc Successfully Updated!
                  </h4>
                  <p className="text-xs text-[#706B63] max-w-md mx-auto">
                    The family Google Doc has been refreshed with the new schedule, {plan.dinners.length} recipe cards, batch lunch preps, and categorized grocery list.
                  </p>
                  <div className="pt-2 flex justify-center space-x-3">
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] flex items-center space-x-1.5 transition shadow-xs"
                    >
                      <span>Open Live Google Doc</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-[#2D2A26] transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-left bg-rose-50 p-4 rounded-xl border border-rose-200 text-rose-900">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Sync Notice</span>
                  </div>
                  <p className="text-xs text-rose-700">
                    {result.message}
                  </p>
                  <p className="text-[11px] text-rose-600">
                    If this is your first time updating this specific shared file, ensure you have edit permissions on document <code className="text-rose-800 font-mono">{PERMANENT_GOOGLE_DOC_ID}</code> or sign in with the Google account that has access.
                  </p>
                  <div className="pt-1 flex items-center justify-end space-x-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-full bg-rose-100 text-xs font-semibold text-rose-800 hover:bg-rose-200 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!isAuthenticated ? (
                <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] space-y-3">
                  <div className="flex items-center space-x-2 text-[#2D2A26] font-bold">
                    <AlertTriangle className="h-4 w-4 text-[#F4C95D]" />
                    <span>Google Authorization Required</span>
                  </div>
                  <p className="text-xs text-[#706B63] leading-relaxed">
                    To write updates to the permanent shared Google Doc titled <strong>"Live Weekly Meal Planner"</strong>, please sign in with your Google account.
                  </p>
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#697A53] text-[#FFFFFF] hover:bg-[#596945] flex items-center space-x-2 shadow-xs transition"
                  >
                    <span>Sign In with Google</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-[#F8F5EE] p-4 rounded-xl border border-[#EADBCE] space-y-1.5">
                    <div className="flex items-center justify-between text-[#2D2A26] font-bold">
                      <span>Document to Update:</span>
                      <span className="text-[#697A53]">Live Weekly Meal Planner</span>
                    </div>
                    <div className="text-[11px] text-[#706B63]">
                      ID: <code className="text-[#2D2A26] font-mono">{PERMANENT_GOOGLE_DOC_ID}</code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-[#2D2A26] block">
                      Content to be written:
                    </span>
                    <ul className="space-y-2 text-[#706B63]">
                      <li className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-[#697A53]" />
                        <span>Section 1: 7-Day Dinner Schedule ({plan.dinners.length} meals)</span>
                      </li>
                      <li className="flex items-center">
                        <Utensils className="h-3.5 w-3.5 mr-2 text-[#697A53]" />
                        <span>Section 2: Detailed Recipe Cards with Allergen & Toddler Mods</span>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-2 text-[#5D6A74]" />
                        <span>Section 3: Distinct Sunday & Tuesday Batch Lunches ({plan.batchLunches.length} meals)</span>
                      </li>
                      <li className="flex items-center">
                        <ShoppingCart className="h-3.5 w-3.5 mr-2 text-[#697A53]" />
                        <span>Section 4: Categorized Grocery List ({plan.groceryItems.length} items)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-[#F8F5EE] rounded-xl border border-[#EADBCE] text-[11px] text-[#706B63]">
                    <strong className="text-[#2D2A26]">Confirmation Notice:</strong> This action will replace the current weekly content of your shared family Google Doc with this week's recipes and groceries, preserving the exact same permanent URL for the family.
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[#706B63] hover:text-[#2D2A26] transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] flex items-center space-x-2 transition disabled:opacity-50 shadow-xs"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Updating Live Document...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-3.5 w-3.5" />
                          <span>Confirm & Update Live Google Doc</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
