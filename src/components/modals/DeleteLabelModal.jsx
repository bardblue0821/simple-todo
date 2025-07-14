import React from 'react';

export default function DeleteLabelModal({ label, onCancel, onDelete }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="bg-white p-6 rounded-xl shadow-xl min-w-[280px] z-10">
        <div className="mb-4 text-base">ラベル「{label}」を削除しますか？</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
            onClick={onCancel}
          >キャンセル</button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
            onClick={onDelete}
          >削除する</button>
        </div>
      </div>
    </div>
  );
}
