import React, { useState } from 'react';

export default function TodoBoard({ todos, onToggle, onMove }) {
  // タスクを4象限に分類
  const areas = {
    important: [],
    urgent_important: [],
    urgent: [],
    low: [],
  };
  todos.forEach(todo => {
    areas[todo.area] ? areas[todo.area].push(todo) : areas.low.push(todo);
  });

  // エリアごとの色
  const areaTailwind = {
    important: 'bg-green-50',
    urgent_important: 'bg-red-50',
    urgent: 'bg-orange-50',
    low: 'bg-gray-100',
  };

  // エリアのグリッド位置・タイトル
  const areaGrid = {
    urgent_important: { col: 2, row: 1, title: '緊急かつ重要' },
    urgent: { col: 2, row: 2, title: '緊急' },
    important: { col: 1, row: 1, title: '重要' },
    low: { col: 1, row: 2, title: '低優先' },
  };

  // エリアの順番
  const areaOrder = [
    'urgent_important', // 緊急かつ重要
    'important',        // 重要
    'urgent',           // 緊急
    'low',              // 低優先
  ];

  // タスク詳細モーダルの状態
  const [detailTask, setDetailTask] = useState(null);

  // エリアカラム（ドラッグ＆ドロップ対応）
  function AreaColumn({ areaKey, areaList, title, col, row }) {
    // ドラッグオーバー状態
    const [isDragOver, setIsDragOver] = useState(false);
    // ドロップ時の処理
    const handleDrop = e => {
      e.preventDefault();
      setIsDragOver(false);
      const todoIdRaw = e.dataTransfer.getData('text/plain');
      const todoId = isNaN(Number(todoIdRaw)) ? todoIdRaw : Number(todoIdRaw);
      const isAlreadyHere = areaList.some(t => t.id === todoId);
      if (todoId && !isAlreadyHere) {
        onMove && onMove(todoId, areaKey);
      }
    };
    return (
      <div
        className={`flex flex-col ${areaTailwind[areaKey]} overflow-hidden rounded-xl border border-gray-200 p-4 md:col-start-${col} md:row-start-${row} [height:var(--area-height)] md:[height:calc(50vh-1rem)]${isDragOver ? ' ring-2 ring-indigo-400 bg-indigo-50/40' : ''}`}
        style={{ '--area-height': 'calc((100vh - 5rem) / 4)' }}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="font-bold mb-3 flex-shrink-0">{title}</div>
        <div className="flex-1 overflow-auto">
          {areaList.map(todo => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onShowDetail={setDetailTask}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 items-stretch flex-1" style={{ height: 'calc(100vh - 2rem)' }}>
      {/* 2rem=32px分マージン考慮 */}
      {areaOrder.map(areaKey => {
        const { col, row, title } = areaGrid[areaKey];
        return (
          <AreaColumn
            key={areaKey}
            areaKey={areaKey}
            areaList={areas[areaKey]}
            title={title}
            col={col}
            row={row}
          />
        );
      })}
      {detailTask && (
        <DetailModal task={detailTask} onClose={() => setDetailTask(null)} />
      )}
    </div>
  );
}

// タスク1件表示（ドラッグ＆ドロップ対応）
const TaskItem = React.memo(function TaskItem({ todo, onToggle, onShowDetail, draggingId, setDraggingId }) {
  // ドラッグ開始時
  const handleDragStart = e => {
    e.dataTransfer.setData('text/plain', todo.id);
    setDraggingId && setDraggingId(todo.id);
  };
  // ドラッグ終了時
  const handleDragEnd = () => {
    setDraggingId && setDraggingId(null);
  };
  return (
    <div
      className={`flex items-center m-0.5 p-1 bg-white rounded shadow-sm relative transition-all cursor-pointer select-none text-sm${draggingId === todo.id ? ' opacity-50' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={e => {
        if (e.target.type !== 'checkbox') onShowDetail(todo);
      }}
    >
      <input
        type="checkbox"
        checked={!!todo.done}
        onChange={() => onToggle(todo.id)}
        className="mr-1 h-4 w-4"
        onClick={e => e.stopPropagation()}
      />
      <span
        className={`flex-1${todo.done ? ' line-through text-gray-400' : ''}`}
        title={todo.title}
      >
        {todo.title.length > 14 ? todo.title.slice(0, 14) + '…' : todo.title}
      </span>
      {/* 三本線アイコン */}
      <span
        className="ml-2 select-none px-0.5 text-gray-400 cursor-grab active:cursor-grabbing"
        title="ドラッグして移動"
      >
        <svg width="16" height="16" viewBox="0 0 18 18" className="block">
          <rect x="4" y="4" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="8" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="12" width="10" height="2" rx="1" fill="#bbb" />
        </svg>
      </span>
    </div>
  );
});

// タスク詳細モーダル
const DetailModal = React.memo(function DetailModal({ task, onClose }) {
  // エリア名の日本語変換
  const areaLabel =
    task.area === 'urgent_important' ? '緊急かつ重要'
    : task.area === 'important' ? '重要'
    : task.area === 'urgent' ? '緊急'
    : '低優先';
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl min-w-[320px] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">タスク詳細</h2>
        <div className="font-bold text-base mb-2 break-all">{task.title}</div>
        <div>エリア: {areaLabel}</div>
        <div>完了: {task.done ? '✔' : '未完了'}</div>
        <button
          className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded font-bold"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
});
