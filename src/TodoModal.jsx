import React, { useState, useCallback, useRef, useEffect } from 'react';

export default function TodoModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  // モーダルが開いたときに入力欄にフォーカス
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // モーダルが閉じられたら入力値をリセット
  React.useEffect(() => {
    if (!open) setTitle('');
  }, [open]);

  // 入力変更
  const handleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  // Enterキーで保存
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && title.trim()) {
      onSubmit(title);
      setTitle('');
    }
  }, [onSubmit, title]);

  // 保存ボタン
  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title);
      setTitle('');
    }
  }, [onSubmit, title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1000]">
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg">
        <h2 className="mb-4 text-xl font-bold">新規Todo作成</h2>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="タイトルを入力"
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ref={inputRef}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
