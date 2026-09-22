import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckSquare,
  Square,
  Plus,
  Copy,
  ExternalLink,
  CheckCircle2,
  Check,
  Filter,
  Sparkles,
  ShoppingBag,
  Store,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { GroceryCategory, GroceryItem } from '../types';

interface RunningGroceryListViewProps {
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, amount: string, category: GroceryCategory) => void;
  onDeleteItem: (id: string) => void;
  onSyncKeep: () => void;
  preferredStore: 'H-E-B' | 'Walmart' | 'Kroger';
  onChangeStore: (store: 'H-E-B' | 'Walmart' | 'Kroger') => void;
}

const CATEGORIES: GroceryCategory[] = [
  'Produce',
  'Meat, Poultry & Seafood',
  'Refrigerated & Dairy-Free',
  'Bakery & Grains',
  'Pantry & Condiments',
  'Spices & Seasonings',
  'Household & Snacks',
];

export const RunningGroceryListView: React.FC<RunningGroceryListViewProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onSyncKeep,
  preferredStore,
  onChangeStore,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryCategory>('Household & Snacks');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedInstacart, setCopiedInstacart] = useState(false);
  const [showInstacartModal, setShowInstacartModal] = useState(false);

  const uncompletedItems = items.filter((i) => !i.completed);
  const completedItems = items.filter((i) => i.completed);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemAmount.trim() || '1 item', newItemCategory);
    setNewItemName('');
    setNewItemAmount('');
    setShowAddForm(false);
  };

  const copyInstacartQueries = () => {
    const listText = uncompletedItems
      .map((item) => `${item.name} (${item.amount})`)
      .join('\n');
    navigator.clipboard.writeText(listText);
    setCopiedInstacart(true);
    setTimeout(() => setCopiedInstacart(false), 2500);
  };

  const getStoreSlug = (store: 'H-E-B' | 'Walmart' | 'Kroger') => {
    switch (store) {
      case 'H-E-B': return 'heb';
      case 'Walmart': return 'walmart';
      case 'Kroger': return 'kroger';
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] space-y-6">
      
      {/* Top Header with Keep & Instacart CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#EADBCE] pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/25">
              Supermarket Departments
            </span>
            <span className="text-[#EADBCE]">•</span>
            <span className="text-xs text-[#706B63] font-medium">Google Keep & Instacart Sync</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2D2A26] tracking-tight flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2.5 text-[#697A53]" />
            Running Grocery List
          </h2>
          <p className="text-xs text-[#706B63] mt-1">
            {uncompletedItems.length} items to purchase • {completedItems.length} checked off
          </p>
        </div>

        {/* Action buttons: Google Keep & Instacart */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Keep Sync Button */}
          <button
            onClick={onSyncKeep}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition flex items-center space-x-1.5 shadow-xs"
            title="Export checklist to Google Keep Running Grocery List note"
          >
            <CheckSquare className="h-4 w-4 text-[#2D2A26]" />
            <span>Export to Google Keep List</span>
          </button>

          {/* Instacart Cart Button */}
          <button
            onClick={() => setShowInstacartModal(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition flex items-center space-x-1.5 shadow-xs"
          >
            <ShoppingBag className="h-4 w-4 text-[#5D6A74]" />
            <span>Load {preferredStore} Cart ({uncompletedItems.length})</span>
          </button>
        </div>
      </div>

      {/* Retailer Selector & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Category Pills matching design tokens */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full transition text-xs font-bold whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-[#697A53] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8F5EE] text-[#706B63] hover:text-[#2D2A26] hover:bg-[#EADBCE]/50 border border-[#EADBCE]'
            }`}
          >
            All ({items.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full transition text-xs font-semibold whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#697A53] text-[#FFFFFF] font-bold shadow-xs'
                    : 'bg-[#F8F5EE] text-[#706B63] hover:text-[#2D2A26] hover:bg-[#EADBCE]/50 border border-[#EADBCE]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Add custom household extra trigger */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#2D2A26] border border-[#EADBCE] transition flex items-center space-x-1 shrink-0 self-start sm:self-auto shadow-xs"
        >
          <Plus className="h-3.5 w-3.5 text-[#697A53]" />
          <span>Add Snack / Extra</span>
        </button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddNewItem} className="p-5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D2A26]">
              Add Household Extra (Snacks, Baby Supplies, Toiletries)
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#706B63] hover:text-[#2D2A26]"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <input
              type="text"
              placeholder="Item name (e.g. Diapers, Cold brew coffee, Pretzels)..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="sm:col-span-1 bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
              autoFocus
            />
            <input
              type="text"
              placeholder="Amount (e.g. 1 box, 2 ct)..."
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              className="bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as GroceryCategory)}
              className="bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition shadow-xs"
            >
              Add to Grocery List
            </button>
          </div>
        </form>
      )}

      {/* Grocery Items List */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const categoryItems = filteredItems.filter((i) => i.category === cat);
          if (categoryItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#706B63] flex items-center justify-between pb-1.5 border-b border-[#EADBCE]">
                <span>{cat}</span>
                <span className="text-[11px] font-medium text-[#706B63]">
                  {categoryItems.filter((i) => !i.completed).length} remaining
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                      item.completed
                        ? 'bg-[#F8F5EE]/70 border-[#EADBCE] text-[#706B63] opacity-60'
                        : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:border-[#697A53]/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {/* Rounded checkbox */}
                      <button
                        type="button"
                        className="shrink-0 transition"
                        aria-label="Toggle item"
                      >
                        {item.completed ? (
                          <div className="h-5 w-5 rounded-md bg-[#697A53] border border-[#697A53] text-[#FFFFFF] flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-md border border-[#EADBCE] bg-[#FFFFFF] group-hover:border-[#697A53]" />
                        )}
                      </button>
                      <div className="truncate">
                        <span className={`text-xs font-semibold ${item.completed ? 'line-through text-[#706B63]' : 'text-[#2D2A26]'}`}>
                          {item.name}
                        </span>
                        {item.sourceRecipe && (
                          <span className="block text-[10px] text-[#706B63] truncate">
                            {item.sourceRecipe}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs font-medium text-[#706B63] bg-[#F8F5EE] px-2.5 py-0.5 rounded-full border border-[#EADBCE]">
                        {item.amount}
                      </span>
                      {item.isCustomItem && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="text-[#706B63] hover:text-rose-500 p-1 rounded-full transition opacity-0 group-hover:opacity-100"
                          title="Remove custom item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instacart Modal (Phase 4 Fulfillment) */}
      {showInstacartModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl text-slate-900 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-2xl bg-purple-100 text-purple-700">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Instacart Cart Fulfillment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct cart loading for {preferredStore}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstacartModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-600">
              {/* Store switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Target Store
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['H-E-B', 'Walmart', 'Kroger'] as const).map((store) => (
                    <button
                      key={store}
                      type="button"
                      onClick={() => onChangeStore(store)}
                      className={`py-2 px-3 rounded-2xl border font-bold text-center transition ${
                        preferredStore === store
                          ? 'bg-[#FFD215] border-[#F2C205] text-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-h-48 overflow-y-auto space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 font-bold mb-2">
                  <span>Uncompleted Items ({uncompletedItems.length})</span>
                  <span>Store: {preferredStore}</span>
                </div>
                {uncompletedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1 border-b border-slate-200/60 text-slate-700">
                    <span className="truncate mr-2">• {item.name}</span>
                    <span className="font-semibold text-slate-900 shrink-0">{item.amount}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200/60 text-purple-950 text-[11px] leading-relaxed">
                <p>
                  <strong>Cart Workflow:</strong> Copy the quick-add queries or click below to launch {preferredStore} on Instacart. When prompted, your family's items can be placed in cart in seconds.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={copyInstacartQueries}
                  className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center space-x-1.5"
                >
                  {copiedInstacart ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Queries Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-600" />
                      <span>Copy Quick-Add Queries</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://www.instacart.com/store/${getStoreSlug(preferredStore)}/storefront`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2 rounded-full text-xs font-bold bg-[#FFD215] hover:bg-[#F3C407] text-slate-950 transition flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <span>Open {preferredStore} on Instacart</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
