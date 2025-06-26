import React, { useState, useRef, useEffect } from 'react';

// 13色のカラーパレット
const COLOR_PALETTE = [
  '#505050', 
  '#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',
  '#4dd0e1', '#4db6ac', '#81c784', '#ffd54f', '#ffb74d', '#a1887f',
];

export default function LabelModal({ open, onClose, onSubmit }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setLabel('');
      setColor(COLOR_PALETTE[0]);
    }
  }, [open]);

  const handleSubmit = () => {
    if (label.trim()) {
      onSubmit(label.trim(), color);
      setLabel('');
      setColor(COLOR_PALETTE[0]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1100]">
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg">
        <h2 className="mb-4 text-xl font-bold">新規ラベル作成</h2>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value.slice(0, 20))}
          maxLength={20}
          placeholder="ラベル名（20文字まで）"
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          ref={inputRef}
        />
        <div className="mb-4">
          <label className="font-medium block mb-2">色:</label>
          <div className="grid grid-cols-4 grid-rows-3 gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-black scale-110' : 'border-gray-200'} focus:outline-none`}
                style={{ backgroundColor: c }}
                aria-label={`色 ${c}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm">{color}</span>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-500 text-white rounded font-bold hover:bg-pink-600"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
}
