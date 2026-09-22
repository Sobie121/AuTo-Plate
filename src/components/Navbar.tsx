import React from 'react';
import { UtensilsCrossed, FileText, ShieldCheck, Sparkles, ExternalLink, LogOut, CheckCircle2, FileDown, Users } from 'lucide-react';
import { User } from 'firebase/auth';
import { PERMANENT_GOOGLE_DOC_ID, HouseholdParameters } from '../types';

interface NavbarProps {
  user: User | null;
  householdParameters: HouseholdParameters;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenQuestionnaire: () => void;
  onOpenRules: () => void;
  onSyncDoc: () => void;
  isSyncingDoc: boolean;
  onExportBatchPdf?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  householdParameters,
  onSignIn,
  onSignOut,
  onOpenQuestionnaire,
  onOpenRules,
  onSyncDoc,
  isSyncingDoc,
  onExportBatchPdf,
}) => {
  const userName = user?.displayName ? user.displayName.split(' ')[0] : (householdParameters.diners[0]?.name || 'Chef');
  const familySummary = householdParameters.diners.length > 0
    ? `${householdParameters.diners.map(d => d.name).slice(0, 3).join(', ')}${householdParameters.diners.length > 3 ? ' +' : ''}'s Table`
    : 'Set Up Family Profile';

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EADBCE] text-[#2D2A26] shadow-[0_4px_16px_rgba(45,42,38,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Personalized Greeting Header */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-[#697A53]/15 text-[#697A53] flex items-center justify-center font-bold shadow-xs border border-[#697A53]/20">
              <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2D2A26]">
                  FamilyTable
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#697A53]/10 text-[#697A53] border border-[#697A53]/20">
                  Weekly Plan
                </span>
              </div>
              <p className="text-xs font-medium text-[#706B63]">
                Welcome, {userName} • <button onClick={onOpenRules} className="text-[#697A53] hover:underline font-semibold cursor-pointer">{familySummary}</button>
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Family Profile / Dietary Rules trigger */}
            <button
              onClick={onOpenRules}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#2D2A26] border border-[#EADBCE] transition shadow-xs"
              title="Household Dietary Rules, Allergens & AI Directives"
            >
              <Users className="h-3.5 w-3.5 mr-1.5 text-[#697A53]" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>

            {/* Batch PDF export button */}
            {onExportBatchPdf && (
              <button
                onClick={onExportBatchPdf}
                className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition shadow-xs"
                title="Download weekly meal guide PDF with all recipes"
              >
                <FileDown className="h-3.5 w-3.5 mr-1.5 text-[#5D6A74]" />
                Export PDF
              </button>
            )}

            {/* Google Doc Sync trigger */}
            <button
              onClick={onSyncDoc}
              disabled={isSyncingDoc}
              className="hidden lg:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition disabled:opacity-50 shadow-xs"
              title="Update Live Weekly Meal Planner Google Doc"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 text-[#697A53]" />
              {isSyncingDoc ? 'Updating Doc...' : 'Sync Live Doc'}
            </button>

            {/* Open Google Doc external link */}
            <a
              href={`https://docs.google.com/document/d/${PERMANENT_GOOGLE_DOC_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center p-2 rounded-full text-[#706B63] hover:text-[#2D2A26] hover:bg-[#F8F5EE] transition border border-transparent hover:border-[#EADBCE]"
              title="Open Live Weekly Meal Planner Google Doc in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Plan New Week button */}
            <button
              onClick={onOpenQuestionnaire}
              className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#2D2A26]" />
              <span className="hidden sm:inline">Plan Week</span>
              <span className="sm:hidden">Plan</span>
            </button>

            {/* Auth control (only display sign-out pill if user is authenticated) */}
            {user && (
              <div className="flex items-center pl-1 sm:pl-2 border-l border-[#EADBCE] space-x-1.5">
                <div className="hidden xl:flex items-center space-x-1 text-xs text-[#2D2A26] font-medium" title={user.email || ''}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#697A53]" />
                  <span className="max-w-[90px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 text-[#706B63] hover:text-[#2D2A26] hover:bg-[#F8F5EE] rounded-full transition border border-transparent hover:border-[#EADBCE]"
                  title="Sign out of Google"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
