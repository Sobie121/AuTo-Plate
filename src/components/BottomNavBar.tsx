import React from 'react';
import { Home, CalendarDays, Sparkles, ShoppingBag, User } from 'lucide-react';

export type TabType = 'home' | 'week' | 'generate' | 'list' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  groceryBadgeCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  groceryBadgeCount = 0,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#EADBCE] shadow-[0_-8px_24px_-4px_rgba(45,42,38,0.08)] py-2 px-3 sm:px-6"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between">
        
        {/* Home Tab */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition ${
            activeTab === 'home'
              ? 'text-[#697A53]'
              : 'text-[#706B63] hover:text-[#2D2A26]'
          }`}
          aria-label="Home"
        >
          <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-[#697A53]/15' : ''}`}>
            <Home className="h-5 w-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Week Tab */}
        <button
          onClick={() => onSelectTab('week')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition ${
            activeTab === 'week'
              ? 'text-[#697A53]'
              : 'text-[#706B63] hover:text-[#2D2A26]'
          }`}
          aria-label="Week"
        >
          <div className={`p-1 rounded-full ${activeTab === 'week' ? 'bg-[#697A53]/15' : ''}`}>
            <CalendarDays className="h-5 w-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'week' ? 'font-bold' : 'font-medium'}`}>
            Week
          </span>
        </button>

        {/* Generate Tab (Center prominent Mustard Gold CTA) */}
        <button
          onClick={() => onSelectTab('generate')}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] -mt-4 py-1 px-2 transition group"
          aria-label="Generate Menu"
        >
          <div className="h-12 w-12 rounded-full bg-[#F4C95D] text-[#2D2A26] flex items-center justify-center shadow-[0_4px_12px_rgba(244,201,93,0.4)] border-2 border-[#FFFFFF] group-hover:scale-105 group-active:scale-95 transition-transform">
            <Sparkles className="h-6 w-6 text-[#2D2A26]" />
          </div>
          <span className="text-[10px] font-bold text-[#2D2A26] tracking-tight mt-0.5">
            Generate
          </span>
        </button>

        {/* List Tab */}
        <button
          onClick={() => onSelectTab('list')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition relative ${
            activeTab === 'list'
              ? 'text-[#697A53]'
              : 'text-[#706B63] hover:text-[#2D2A26]'
          }`}
          aria-label="Grocery List"
        >
          <div className={`p-1 rounded-full relative ${activeTab === 'list' ? 'bg-[#697A53]/15' : ''}`}>
            <ShoppingBag className="h-5 w-5" />
            {groceryBadgeCount > 0 && (
              <span className="absolute -top-0.5 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#697A53] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center">
                {groceryBadgeCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'list' ? 'font-bold' : 'font-medium'}`}>
            List
          </span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition ${
            activeTab === 'profile'
              ? 'text-[#697A53]'
              : 'text-[#706B63] hover:text-[#2D2A26]'
          }`}
          aria-label="Household Profile"
        >
          <div className={`p-1 rounded-full ${activeTab === 'profile' ? 'bg-[#697A53]/15' : ''}`}>
            <User className="h-5 w-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>
            Profile
          </span>
        </button>

      </div>
    </nav>
  );
};
