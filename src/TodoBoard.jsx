import React, { useState } from 'react';

export default function TodoBoard({ todos, onMove, onToggle }) {
  // 4象限に分類
  const areas = {
    important: [],
    urgent_important: [],
    urgent: [],
    low: [],
  };
  todos.forEach(todo => {
    if (todo.area === 'urgent_important') areas.urgent_important.push(todo);
    else if (todo.area === 'important') areas.important.push(todo);
    else if (todo.area === 'urgent') areas.urgent.push(todo);
    else areas.low.push(todo);
  });

  // エリアごとの背景色
  const areaBgColors = {
    important: '#e6fbe6', // 薄い緑
    urgent_important: '#ffeaea', // 薄い赤
    urgent: '#fff5e6', // 薄いオレンジ
    low: '#f3f4f6', // 薄い灰色
  };

  // エリアのスタイルを拡張
  const areaStyle = (area) => ({
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    minHeight: 220,
    minWidth: 320,
    padding: 24,
    margin: 12,
    background: areaBgColors[area],
    flex: 1,
    boxSizing: 'border-box',
    transition: 'background 0.2s',
  });

  // ドラッグ中のタスクIDを管理
  const [draggingId, setDraggingId] = useState(null);

  // ドラッグイベントハンドラ
  const handleDragStart = (e, todoId, todo) => {
    e.dataTransfer.setData('text/plain', todoId);
    setDraggingId(todoId);
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
  };
  const handleDrop = (e, area) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('text/plain');
    onMove(Number(todoId), area);
    setDraggingId(null);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragEnd = () => {
    setDraggingId(null);
  };

  // タスク詳細ウィンドウ用
  const [detailTask, setDetailTask] = useState(null);

  // タスク描画用
  const renderTask = (todo) => (
    <div
      key={todo.id}
      style={{
        display: 'flex', alignItems: 'center', margin: 6, padding: 12, background: draggingId === todo.id ? '#e0e7ff' : '#fff', borderRadius: 6, position: 'relative', opacity: draggingId === todo.id ? 0.5 : 1, transition: 'background 0.2s, opacity 0.2s', cursor: 'pointer', boxShadow: '0 1px 4px #e5e7eb',
      }}
      onClick={e => { if (e.target.type !== 'checkbox') setDetailTask(todo); }}
    >
      <input
        type="checkbox"
        checked={!!todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: 8 }}
        onClick={e => e.stopPropagation()}
      />
      <span style={{ textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#9ca3af' : undefined, flex: 1 }}>
        {todo.title}
      </span>
      <span
        draggable
        onDragStart={e => handleDragStart(e, todo.id, todo)}
        onDragEnd={handleDragEnd}
        style={{
          marginLeft: 12,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          padding: '0 4px',
        }}
        title="ドラッグして移動"
        onClick={e => e.stopPropagation()}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
          <rect x="4" y="4" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="8" width="10" height="2" rx="1" fill="#bbb" />
          <rect x="4" y="12" width="10" height="2" rx="1" fill="#bbb" />
        </svg>
      </span>
    </div>
  );

  // タスク詳細ウィンドウ
  const renderDetailModal = () => detailTask && (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }} onClick={() => setDetailTask(null)}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 16 }}>タスク詳細</h2>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{detailTask.title}</div>
        <div>エリア: {detailTask.area === 'urgent_important' ? '緊急かつ重要' : detailTask.area === 'important' ? '重要' : detailTask.area === 'urgent' ? '緊急' : '低優先'}</div>
        <div>完了: {detailTask.done ? '✔' : '未完了'}</div>
        <button style={{ marginTop: 24, padding: '0.5rem 1.5rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setDetailTask(null)}>閉じる</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 32, width: '100%', height: 700, padding: 24 }}>
      <div style={areaStyle('important')}
        onDrop={e => handleDrop(e, 'important')}
        onDragOver={handleDragOver}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>重要エリア</div>
        {areas.important.map(renderTask)}
      </div>
      <div style={areaStyle('urgent_important')}
        onDrop={e => handleDrop(e, 'urgent_important')}
        onDragOver={handleDragOver}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>緊急かつ重要エリア</div>
        {areas.urgent_important.map(renderTask)}
      </div>
      <div style={areaStyle('low')}
        onDrop={e => handleDrop(e, 'low')}
        onDragOver={handleDragOver}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>低優先エリア</div>
        {areas.low.map(renderTask)}
      </div>
      <div style={areaStyle('urgent')}
        onDrop={e => handleDrop(e, 'urgent')}
        onDragOver={handleDragOver}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>緊急エリア</div>
        {areas.urgent.map(renderTask)}
      </div>
      {renderDetailModal()}
    </div>
  );
}
