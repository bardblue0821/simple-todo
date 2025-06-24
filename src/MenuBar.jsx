import React, { useState } from 'react';

export default function MenuBar({ onNewTodo, onNewLabel, labels = [], onDeleteLabel }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <aside className="w-52 h-screen flex flex-col items-center pt-4">
      <div className="w-full">
        <NewTodoButton onClick={onNewTodo} />
        <NewLabelButton onClick={onNewLabel} />
        <div className="mt-6 px-4 w-full">
          <div className="mb-2 text-xs text-gray-500 font-bold">ラベル一覧</div>
          <ul>
            {labels.map(l => (
              <li key={l.label} className="flex items-center mb-2 group">
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: l.color, border: '1px solid #ccc', marginRight: 8 }} />
                <span className="text-sm text-gray-700 mr-1">{l.label}</span>
                <button
                  className="text-gray-400 hover:text-red-400 text-base px-1 focus:outline-none"
                  onClick={() => setDeleteTarget(l.label)}
                  title="ラベル削除"
                  style={{ fontWeight: 'normal', background: 'none', border: 'none', lineHeight: 1 }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        {deleteTarget && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
            <div className="bg-white p-6 rounded-xl shadow-xl min-w-[280px]">
              <div className="mb-4 text-base">ラベル「{deleteTarget}」を削除しますか？</div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
                  onClick={() => setDeleteTarget(null)}
                >キャンセル</button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
                  onClick={() => { onDeleteLabel && onDeleteLabel(deleteTarget); setDeleteTarget(null); }}
                >削除する</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

const NewTodoButton = React.memo(function NewTodoButton({ onClick }) {
  return (
    <button
      className="w-[90%] ml-4 my-4 py-2 bg-indigo-500 text-white rounded font-bold cursor-pointer hover:bg-indigo-600 transition-colors"
      onClick={onClick}
    >
      タスク作成
    </button>
  );
});

const NewLabelButton = React.memo(function NewLabelButton({ onClick }) {
  return (
    <button
      className="w-[90%] ml-4 my-2 py-2 bg-pink-500 text-white rounded font-bold cursor-pointer hover:bg-pink-600 transition-colors"
      onClick={onClick}
    >
      ラベル作成
    </button>
  );
});
