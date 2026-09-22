import React, { useState } from 'react';
import {
  CheckSquare,
  Copy,
  CheckCircle2,
  ExternalLink,
  X,
  ShoppingBag,
  Sparkles,
  Share2,
  Info,
  ListTodo,
  Download
} from 'lucide-react';
import { GOOGLE_KEEP_NOTE_TITLE, GroceryItem } from '../types';

interface GoogleKeepSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GroceryItem[];
  onProceedToInstacart: () => void;
  preferredStore: 'H-E-B' | 'Walmart' | 'Kroger';
}

export const GoogleKeepSyncModal: React.FC<GoogleKeepSyncModalProps> = ({
  isOpen,
  onClose,
  items,
  onProceedToInstacart,
  preferredStore,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (!isOpen) return null;

  const generateKeepText = () => {
    const lines: string[] = [];
    lines.push(`📝 ${GOOGLE_KEEP_NOTE_TITLE}`);
    lines.push(`Updated: ${new Date().toLocaleDateString()}`);
    lines.push('');

    const categories = Array.from(new Set(items.map((i) => i.category)));
    categories.forEach((cat) => {
      lines.push(`--- ${cat.toUpperCase()} ---`);
      const catItems = items.filter((i) => i.category === cat);
      catItems.forEach((item) => {
        lines.push(`☐ ${item.amount} ${item.name}${item.sourceRecipe ? ` (${item.sourceRecipe})` : ''}`);
      });
      lines.push('');
    });

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateKeepText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: GOOGLE_KEEP_NOTE_TITLE,
          text: generateKeepText(),
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch (err) {
        console.log('Share dismissed', err);
      }
    }
  };

  const handleDownload = () => {
    const text = generateKeepText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Running-Grocery-List-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl shadow-2xl text-[#2D2A26] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between bg-[#F8F5EE]/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#697A53]/15 text-[#697A53]">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D2A26]">
                Sync "Running Grocery List" to Keep
              </h3>
              <p className="text-xs text-[#706B63]">
                Target Note: <span className="font-semibold text-[#2D2A26]">"{GOOGLE_KEEP_NOTE_TITLE}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#706B63] hover:text-[#2D2A26] p-2 rounded-full hover:bg-[#F8F5EE] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-[#2D2A26] overflow-y-auto flex-1">
          
          {/* Keep Sync Tip */}
          <div className="p-3.5 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] flex items-center justify-between text-xs text-[#2D2A26]">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 shrink-0 text-[#697A53]" />
              <span>Use <strong>Share to Keep</strong> on mobile or <strong>Copy Checklist</strong> to paste directly into your pinned note.</span>
            </div>
          </div>

          {/* Checklist preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-[#706B63] text-[11px]">
              <span>Formatted Checklist Preview ({items.length} items):</span>
              <span className="font-semibold text-[#697A53]">Categorized by Store Aisles</span>
            </div>
            <div className="bg-[#F8F5EE] rounded-xl p-4 border border-[#EADBCE] max-h-48 overflow-y-auto font-mono text-[11px] text-[#2D2A26]">
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {generateKeepText()}
              </pre>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-3.5 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] space-y-1.5 text-[11px] text-[#706B63]">
            <span className="font-bold text-[#2D2A26] block">Quick Workflow:</span>
            <ol className="list-decimal list-inside space-y-1 text-[#706B63]">
              <li>Tap <strong>Copy Keep Checklist</strong> (or <strong>Share to Keep</strong>).</li>
              <li>Open your pinned <strong>"{GOOGLE_KEEP_NOTE_TITLE}"</strong> note in Keep and paste.</li>
              <li>Check off pantry staples you already have in stock.</li>
            </ol>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#EADBCE] bg-[#F8F5EE]/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] flex items-center space-x-1.5 transition shadow-xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#FFFFFF]" />
                  <span>Checklist Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Keep Checklist</span>
                </>
              )}
            </button>

            {canShare && (
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#2D2A26] border border-[#EADBCE] flex items-center space-x-1.5 transition shadow-xs"
                title="Send directly to Google Keep app via device share"
              >
                <Share2 className="h-3.5 w-3.5 text-[#697A53]" />
                <span>{shared ? 'Shared!' : 'Share to Keep'}</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#706B63] border border-[#EADBCE] flex items-center space-x-1.5 transition"
              title="Download text file of grocery checklist"
            >
              <Download className="h-3.5 w-3.5 text-[#706B63]" />
              <span>.txt</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://keep.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#706B63] border border-[#EADBCE] flex items-center space-x-1 transition"
              title="Launch Google Keep in a new browser tab"
            >
              <span>Open Keep</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={() => {
                onClose();
                onProceedToInstacart();
              }}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] flex items-center space-x-1.5 transition shadow-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Instacart Cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
