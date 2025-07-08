import React from 'react';
import PrimaryButton from '/src/components/buttons/PrimaryButton';
import LabelCircle from '/src/components/icons/LabelCircle';

export default function DetailModal({ task, onClose, labelColors = {} }) {
  const areaLabel =
    task.area === 'urgent_important' ? '緊急かつ重要'
    : task.area === 'important' ? '重要'
    : task.area === 'urgent' ? '緊急'
    : '低優先';
  const color = (task.label && task.label !== '未設定') ? (labelColors[task.label] || '#e57373') : '#bdbdbd';
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[2000]"
      role="dialog"
      aria-modal="true"
      aria-label="タスク詳細"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl min-w-[320px] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="font-bold text-base mb-2 break-all">{task.title}</div>
        <div className="mb-1 flex items-center gap-2">
          <LabelCircle color={color} size={16} title={task.label || '未設定'} />
          <span>{task.label || '未設定'}</span>
        </div>
        <div>{areaLabel}</div>
        <div>{task.done ? '完了済み' : '未完了'}</div>
        <PrimaryButton
          className="mt-6 px-6"
          onClick={onClose}
          aria-label="閉じる"
        >
          閉じる
        </PrimaryButton>
      </div>
    </div>
  );
}
