import React, { useState } from 'react';
import PrimaryButton from './components/buttons/PrimaryButton';
import SecondaryButton from './components/buttons/SecondaryButton';

// ラベルリストアイテムのコンポーネント
function LabelListItem({ label, color, isHidden, onToggleHide, onDelete }) {
  return (
    <li className="flex items-center mb-2 group">
      <button
        className={`
          flex items-center px-0 py-0 border-none bg-white focus:outline-none
          ${isHidden ? 'opacity-40' : ''}
        `}
        onClick={onToggleHide}
        title={isHidden ? 'このラベルのタスクを表示' : 'このラベルのタスクを非表示'}
      >
        <span
          className="inline-block rounded-full mr-2 transition-all"
          style={{
            width: 14,
            height: 14,
            background: color,
          }}
        />
        <span className="text-sm text-gray-700 mr-1">{label}</span>
      </button>
      <button
        className="text-gray-400 hover:text-red-400 text-base px-1 focus:outline-none font-normal bg-white border-none leading-none"
        onClick={onDelete}
        title="ラベル削除"
      >
        ×
      </button>
    </li>
  );
}

export default function MenuBar({ onNewTodo, onNewLabel, labels = [], onDeleteLabel, hiddenLabels = [], onToggleHideLabel }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <aside className="w-52 h-screen flex flex-col items-center pt-4">
      <div className="w-full">
        <PrimaryButton className="w-[90%] ml-4 my-4" onClick={onNewTodo}>
          タスク作成
        </PrimaryButton>
        <PrimaryButton className="w-[90%] ml-4 my-2" onClick={onNewLabel}>
          ラベル作成
        </PrimaryButton>
        <div className="mt-6 px-4 w-full">
          <ul>
            {labels.map(l => (
              <LabelListItem
                key={l.label}
                label={l.label}
                color={l.color}
                isHidden={hiddenLabels.includes(l.label)}
                onToggleHide={() => onToggleHideLabel && onToggleHideLabel(l.label)}
                onDelete={() => onDeleteLabel && onDeleteLabel(l.label)}
              />
            ))}
          </ul>
        </div>
        {deleteTarget && (
          null
        )}
      </div>
    </aside>
  );
}
