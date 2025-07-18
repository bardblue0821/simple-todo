import React, { useState, useRef, useEffect } from 'react';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

// 13色のカラーパレット
const COLOR_PALETTE = [
  '#505050', '#f07373', '#ba68c8', '#9575cd', 
  '#7986cb', '#64b5f6', '#4dd0e1', '#4db6ac', 
  '#81c784', '#ffd54f', '#ffa74d', '#a1887f',
];

// カラーパレットボタンのコンポーネント
function ColorPalette({ palette, selected, onSelect, usedColors }) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-2">
      {palette.map((c) => {
        const isUsed = usedColors.includes(c);
        return (
          <button
            key={c}
            type="button"
            onClick={() => !isUsed && onSelect(c)}
            className={`w-8 h-8 rounded-full border-2 relative ${selected === c ? 'border-black scale-110' : 'border-gray-200'} focus:outline-none ${isUsed ? 'cursor-not-allowed' : ''}`}
            style={{ backgroundColor: c }}
            aria-label={`色 ${c}`}
            disabled={isUsed}
            title={isUsed ? 'この色は使用済みです' : '選択可能'}
          >
            {isUsed && (
              <span
                className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center pointer-events-none"
                style={{ pointerEvents: 'none' }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" className="absolute">
                  <line x1="2" y1="26" x2="26" y2="2" stroke="#aaa" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function CreateLabelModal({ open, onClose, onSubmit, labels = [] }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(''); // デフォルトは空文字
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open) setFadeIn(true);
    else setFadeIn(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setLabel('');
      setColor(''); // モーダルを閉じたら選択解除
      setError('');
    }
  }, [open]);

  // 入力値変更時のハンドラ
  const handleChange = (e) => {
    setLabel(e.target.value.slice(0, 20));
    setError('');
  };

  const handleSubmit = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError('ラベル名を入力してください');
      return;
    }
    if (!color) {
      setError('色を選択してください');
      return;
    }
    if (labels.some(l => l.label === trimmed)) {
      setError('同じラベル名は登録できません');
      return;
    }
    onSubmit(trimmed, color);
    setLabel('');
    setColor('');
    setError('');
  };

  // 使用済み色リスト
  const usedColors = labels.map(l => l.color);

  if (!open) return null;

  // Enterキー押下時のハンドラ
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={`fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1100] transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg transition-all duration-300">
        <h2 className="mb-4 text-xl font-bold">新規ラベル作成</h2>
        <input
          type="text"
          value={label}
          onChange={handleChange}
          maxLength={20}
          placeholder="ラベル名（20文字まで）"
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="mb-4">
          <ColorPalette palette={COLOR_PALETTE} selected={color} onSelect={setColor} usedColors={usedColors} />
          {usedColors.length === COLOR_PALETTE.length && (
            <div className="text-xs text-gray-500 mt-2">すべての色が使用済みです。既存ラベルを編集・削除してください。</div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={onClose}>
            キャンセル
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>
            登録
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
