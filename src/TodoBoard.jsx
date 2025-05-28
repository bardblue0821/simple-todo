import React, { useState, useCallback, useMemo } from 'react';

export default function TodoBoard({ todos, onMove, onToggle }) {
  // 4象限に分類（useMemoで最適化）
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

  // ドラッグ中のタスクIDとドロップ先インデックスを管理
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverArea, setDragOverArea] = useState(null);
  const [detailTask, setDetailTask] = useState(null);

  // ドラッグイベントハンドラ
  const handleDragStart = useCallback((e, todoId, todo) => {
    e.dataTransfer.setData('text/plain', todoId);
    setDraggingId(todoId);
    setDragOverIndex(null);
    setDragOverArea(null);
    // カスタムドラッグイメージ
    const dragGhost = document.createElement('div');
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-9999px';
    dragGhost.style.left = '-9999px';
    dragGhost.style.padding = '8px 16px';
    dragGhost.style.background = '#fff';
    dragGhost.style.borderRadius = '4px';
    dragGhost.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dragGhost.style.fontSize = '16px';
    dragGhost.style.color = '#222';
    dragGhost.innerText = todo.title;
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 60, 20);
    setTimeout(() => document.body.removeChild(dragGhost), 0);
  }, []);

  const handleDrop = useCallback((e, area, index = null) => {
    e.preventDefault();
    const todoId = Number(e.dataTransfer.getData('text/plain'));
    setDraggingId(null);
    setDragOverIndex(null);
    setDragOverArea(null);
    if (todoId == null || area == null) return;
    // 同じエリア内で順序入れ替え
    if (area === getAreaByTodoId(todoId)) {
      const areaList = areas[area].map(t => t.id);
      const fromIdx = areaList.indexOf(todoId);
      let toIdx = index;
      if (fromIdx < 0 || toIdx == null) return;
      if (fromIdx < toIdx) toIdx--;
      if (fromIdx === toIdx || fromIdx + 1 === toIdx) return;
      const newOrder = [...areaList];
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, todoId);
      const newTodos = [];
      todos.forEach(todo => {
        if (todo.area === area) return;
        newTodos.push(todo);
      });
      newOrder.forEach(id => {
        const t = todos.find(todo => todo.id === id);
        if (t) newTodos.push(t);
      });
      onMoveOrder(newTodos);
    } else {
      // エリア移動（index位置に挿入）
      const areaList = areas[area].map(t => t.id);
      let toIdx = index;
      if (toIdx == null) toIdx = areaList.length;
      const newTodos = [];
      let inserted = false;
      todos.forEach(todo => {
        if (todo.id === todoId) return;
        if (todo.area === area && newTodos.filter(t => t.area === area).length === toIdx && !inserted) {
          const moved = { ...todos.find(t => t.id === todoId), area };
          newTodos.push(moved);
          inserted = true;
        }
        newTodos.push(todo);
      });
      if (!inserted) {
        const moved = { ...todos.find(t => t.id === todoId), area };
        newTodos.push(moved);
      }
      onMoveOrder(newTodos);
    }
  }, [areas, todos]);

  const handleDragOver = useCallback((e, area, index = null) => {
    e.preventDefault();
    setDragOverArea(area);
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverIndex(null);
    setDragOverArea(null);
  }, []);

  // エリア名取得
  const getAreaByTodoId = useCallback((id) => {
    for (const key in areas) {
      if (areas[key].some(t => t.id === id)) return key;
    }
    return null;
  }, [areas]);

  // 親(App)に順序変更を伝える
  const onMoveOrder = useCallback((newTodos) => {
    if (typeof onMove === 'function') {
      onMove(newTodos, '__reorder');
    }
  }, [onMove]);

  // タスク描画用
  const renderTask = useCallback((todo, idx, areaKey, areaList) => {
    // プレビュー用: ドラッグ中のタスクがこの位置に割り込む場合、仮のスペースを挿入
    const isPreview = dragOverArea === areaKey && dragOverIndex === idx && draggingId !== null;
    return (
      <React.Fragment key={todo.id}>
        {/* タスクの直前にプレビューを表示 */}
        {isPreview && (
          <div className="h-10 my-1 rounded border-2 border-dashed border-indigo-400 bg-indigo-100/60 animate-pulse flex items-center justify-center text-indigo-500 font-bold transition-all duration-200">
            ここに配置
          </div>
        )}
        <div
          className={`flex items-center m-1 p-2 bg-white rounded shadow-sm relative transition-all ${draggingId === todo.id ? 'bg-indigo-100 opacity-50' : ''} cursor-pointer`}
          onClick={e => { if (e.target.type !== 'checkbox') setDetailTask(todo); }}
          draggable={false}
          onDragOver={e => handleDragOver(e, areaKey, idx)}
          onDrop={e => handleDrop(e, areaKey, idx)}
        >
          <input
            type="checkbox"
            checked={!!todo.done}
            onChange={() => onToggle(todo.id)}
            className="mr-2"
            onClick={e => e.stopPropagation()}
          />
          <span className={`flex-1 ${todo.done ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </span>
          <span
            draggable
            onDragStart={e => handleDragStart(e, todo.id, todo)}
            onDragEnd={handleDragEnd}
            className="ml-3 cursor-grab select-none px-1"
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
      </React.Fragment>
    );
  }, [draggingId, dragOverArea, dragOverIndex, handleDragOver, handleDrop, onToggle, setDetailTask, handleDragStart, handleDragEnd]);

  // タスク詳細ウィンドウ
  const renderDetailModal = useCallback(() => detailTask && (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[2000]" onClick={() => setDetailTask(null)}>
      <div className="bg-white p-8 rounded-xl min-w-[320px] shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold">タスク詳細</h2>
        <div className="font-bold text-base mb-2">{detailTask.title}</div>
        <div>エリア: {detailTask.area === 'urgent_important' ? '緊急かつ重要' : detailTask.area === 'important' ? '重要' : detailTask.area === 'urgent' ? '緊急' : '低優先'}</div>
        <div>完了: {detailTask.done ? '✔' : '未完了'}</div>
        <button className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded font-bold" onClick={() => setDetailTask(null)}>閉じる</button>
      </div>
    </div>
  ), [detailTask]);

  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-6 p-6 max-h-[90vh] max-w-[1200px] mx-auto">
      {Object.entries(areas).map(([areaKey, areaList]) => (
        <div
          key={areaKey}
          className={`flex flex-col ${areaTailwind[areaKey]} overflow-auto rounded-xl border border-gray-200 p-4 min-h-[200px] min-w-[200px]`}
          onDrop={e => handleDrop(e, areaKey, areaList.length)}
          onDragOver={e => handleDragOver(e, areaKey, areaList.length)}
        >
          <div className="font-bold mb-3">
            {areaKey === 'important' ? '重要エリア' : areaKey === 'urgent_important' ? '緊急かつ重要エリア' : areaKey === 'urgent' ? '緊急エリア' : '低優先エリア'}
          </div>
          {/* 先頭にプレビュー */}
          {dragOverArea === areaKey && dragOverIndex === 0 && draggingId !== null && (
            <div className="h-10 my-1 rounded border-2 border-dashed border-indigo-400 bg-indigo-100/60 animate-pulse flex items-center justify-center text-indigo-500 font-bold transition-all duration-200">
              ここに配置
            </div>
          )}
          {areaList.map((todo, idx) => renderTask(todo, idx, areaKey, areaList))}
          {/* 最後の位置にもドロッププレビュー */}
          {dragOverArea === areaKey && dragOverIndex === areaList.length && draggingId !== null && (
            <div className="h-10 my-1 rounded border-2 border-dashed border-indigo-400 bg-indigo-100/60 animate-pulse flex items-center justify-center text-indigo-500 font-bold transition-all duration-200">
              ここに配置
            </div>
          )}
        </div>
      ))}
      {renderDetailModal()}
    </div>
  );
}
