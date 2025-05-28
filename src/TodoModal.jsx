import React, { useState, useCallback, useRef, useEffect } from 'react';

export default function TodoModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  // モーダルが開いたときに入力欄にフォーカス
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // モーダルが閉じられたら入力値をリセット
  React.useEffect(() => {
    if (!open) setTitle('');
  }, [open]);

  // 入力変更
  const handleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  // Enterキーで保存
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && title.trim()) {
      onSubmit(title);
      setTitle('');
    }
  }, [onSubmit, title]);

  // 保存ボタン
  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit(title);
      setTitle('');
    }
  }, [onSubmit, title]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginBottom: 16 }}>新規Todo作成</h2>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="タイトルを入力"
          style={{ width: '100%', padding: 8, marginBottom: 16, fontSize: 16 }}
          ref={inputRef}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: 6 }}>キャンセル</button>
          <button
            onClick={handleSubmit}
            style={{ padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' }}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
