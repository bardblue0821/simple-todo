import React, { useState } from 'react';

export default function EditTodoModal({ task, labels, onClose, onSubmit }) {
  const [title, setTitle] = useState(task.title);
  const [label, setLabel] = useState(task.label);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), label);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[2100]">
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-lg">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, 50))}
          maxLength={50}
          placeholder="タイトルを編集"
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
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
            className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
            onClick={handleSubmit}
          >保存</button>
        </div>
      </div>
    </div>
  );
}
