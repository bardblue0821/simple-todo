import React, { useState, useRef, useEffect } from 'react';

export default function EditTodoModal({ task, labels, onClose, onSubmit, onDelete }) {
  const [title, setTitle] = useState(task.title);
  const [label, setLabel] = useState(task.label);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), label);
    }
  };

  if (!task) return null;

  return (
    <div className={`fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[2100] transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg transition-all duration-300">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, 50))}
            onBlur={() => setIsEditing(false)}
            autoFocus
            ref={inputRef}
            maxLength={50}
            placeholder="タイトルを編集"
            className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        ) : (
          <span
            className="block mb-4 text-xl font-bold cursor-pointer"
            onClick={() => setIsEditing(true)}
            title="クリックで編集"
          >
            {title}
          </span>
        )}
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-50 text-base"
          value={label}
          onChange={e => setLabel(e.target.value)}
        >
          <option value="未設定">未設定</option>
          {labels.map((l, i) => (
            <option value={l.label} key={i}>{l.label}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
            onClick={onClose}
          >キャンセル</button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
            onClick={() => setConfirmDeleteOpen(true)}
          >削除</button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
            onClick={handleSubmit}
          >保存</button>
        </div>
      </div>
      {confirmDeleteOpen && (
        <div className={`fixed inset-0 w-screen h-screen bg-black/40 flex items-center justify-center z-[2200] transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white p-6 rounded-xl min-w-[280px] shadow-xl text-center transition-all duration-300">
            <div className="mb-6 text-lg font-semibold">本当に削除してよろしいですか？</div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
                onClick={() => setConfirmDeleteOpen(false)}
              >キャンセル</button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
                onClick={() => { setConfirmDeleteOpen(false); onDelete(); }}
              >削除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
