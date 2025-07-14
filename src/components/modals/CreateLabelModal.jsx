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
function ColorPalette({ palette, selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-2">
      {palette.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onSelect(c)}
          className={`w-8 h-8 rounded-full border-2 ${selected === c ? 'border-black scale-110' : 'border-gray-200'} focus:outline-none`}
          style={{ backgroundColor: c }}
          aria-label={`色 ${c}`}
        />
      ))}
    </div>
  );
}

export default function CreateLabelModal({ open, onClose, onSubmit, labels = [] }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setLabel('');
      setColor(COLOR_PALETTE[0]);
      setError('');
    }
  }, [open]);

  const handleSubmit = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError('ラベル名を入力してください');
      return;
    }
    if (labels.some(l => l.label === trimmed)) {
      setError('同じラベル名は登録できません');
      return;
    }
    onSubmit(trimmed, color);
    setLabel('');
    setColor(COLOR_PALETTE[0]);
    setError('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1100]">
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg">
        <h2 className="mb-4 text-xl font-bold">新規ラベル作成</h2>
        <input
          type="text"
          value={label}
          onChange={e => {
            setLabel(e.target.value.slice(0, 20));
            setError('');
          }}
          maxLength={20}
          placeholder="ラベル名（20文字まで）"
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          ref={inputRef}
        />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="mb-4">
          <ColorPalette palette={COLOR_PALETTE} selected={color} onSelect={setColor} />
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
