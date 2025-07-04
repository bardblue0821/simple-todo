import React, { useState, useCallback, useMemo } from 'react';

export default function TodoBoard({ todos, onToggle }) {
  // 4象限に分類
  const areas = useMemo(() => {
    const result = { important: [], urgent_important: [], urgent: [], low: [] };
    todos.forEach(todo => {
      if (todo.area === 'urgent_important') result.urgent_important.push(todo);
      else if (todo.area === 'important') result.important.push(todo);
      else if (todo.area === 'urgent') result.urgent.push(todo);
      else result.low.push(todo);
    });
    return result;
  }, [todos]);

  // tailwindで色を指定
  const areaTailwind = useMemo(() => ({
    important: 'bg-green-50',
    urgent_important: 'bg-red-50',
    urgent: 'bg-orange-50',
    low: 'bg-gray-100',
  }), []);

  // エリアのグリッド位置・タイトル
  const areaGrid = useMemo(() => ({
    urgent_important: { col: 2, row: 1, title: '緊急かつ重要' },
    urgent: { col: 2, row: 2, title: '緊急' },
    important: { col: 1, row: 1, title: '重要' },
    low: { col: 1, row: 2, title: '低優先' },
  }), []);

  // タスク詳細ウィンドウ
  const [detailTask, setDetailTask] = useState(null);
  const renderDetailModal = useCallback(() => detailTask && (
    <DetailModal task={detailTask} onClose={() => setDetailTask(null)} />
  ), [detailTask]);

  // タスク描画
  const renderTask = useCallback((todo) => (
    <TaskItem key={todo.id} todo={todo} onToggle={onToggle} onShowDetail={setDetailTask} />
  ), [onToggle]);

  // エリア描画
  const AreaColumn = React.memo(({ areaKey, areaList, title, col, row }) => (
    <div
      className={`flex flex-col ${areaTailwind[areaKey]} overflow-auto rounded-xl border border-gray-200 p-4 min-h-[200px] min-w-[200px] col-start-${col} row-start-${row}`}
    >
      <div className="font-bold mb-3">{title}</div>
      {areaList.map(renderTask)}
    </div>
  ));

  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-6 p-6 max-h-[90vh] max-w-[1200px] mx-auto">
      {Object.entries(areaGrid).map(([areaKey, { col, row, title }]) => (
        <AreaColumn
          key={areaKey}
          areaKey={areaKey}
          areaList={areas[areaKey]}
          title={title}
          col={col}
          row={row}
        />
      ))}
      {renderDetailModal()}
    </div>
  );
}

// タスク1件
const TaskItem = React.memo(function TaskItem({ todo, onToggle, onShowDetail }) {
  return (
    <div
      className={`flex items-center m-1 p-2 bg-white rounded shadow-sm relative transition-all cursor-pointer`}
      onClick={e => { if (e.target.type !== 'checkbox') onShowDetail(todo); }}
    >
      <input
        type="checkbox"
        checked={!!todo.done}
        onChange={() => onToggle(todo.id)}
        className="mr-2"
        onClick={e => e.stopPropagation()}
      />
      <span className={`flex-1 ${todo.done ? 'line-through text-gray-400' : ''}`}
        title={todo.title}
      >
        {todo.title.length > 15 ? todo.title.slice(0, 15) + '…' : todo.title}
      </span>
      <span
        className="ml-3 select-none px-1 text-gray-400"
        title="ドラッグして移動"
        onClick={e => e.stopPropagation()}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" className="block">
          <rect x="4" y="4" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="8" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="12" width="10" height="2" rx="1" fill="#bbb" />
        </svg>
      </span>
    </div>
  );
});

// 詳細モーダル
const DetailModal = React.memo(function DetailModal({ task, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[2000]" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold">タスク詳細</h2>
        <div className="font-bold text-base mb-2 break-all">{task.title}</div>
        <div>エリア: {task.area === 'urgent_important' ? '緊急かつ重要' : task.area === 'important' ? '重要' : task.area === 'urgent' ? '緊急' : '低優先'}</div>
        <div>完了: {task.done ? '✔' : '未完了'}</div>
        <button className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded font-bold" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
});
