import React, { useState, useRef, useEffect } from 'react';

export default function LabelModal({ open, onClose, onSubmit }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#e57373');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setLabel('');
      setColor('#e57373');
    }
  }, [open]);

  const handleSubmit = () => {
    if (label.trim()) {
      onSubmit(label.trim(), color);
      setLabel('');
      setColor('#e57373');
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
        <div className="flex items-center mb-4 gap-2">
          <label className="font-medium">色:</label>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-10 h-10 p-0 border-none bg-transparent"
          />
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
