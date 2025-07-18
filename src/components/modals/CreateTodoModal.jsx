import React, { useState, useCallback, useRef, useEffect } from 'react';
import PrimaryButton from '/src/components/buttons/PrimaryButton';
import SecondaryButton from '/src/components/buttons/SecondaryButton';

export default function CreateTodoModal({ open, onClose, onSubmit, labelOptions = [] }) {
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open) setFadeIn(true);
    else setFadeIn(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setLabel('');
      setError('');
    }
  }, [open]);

  const handleChange = useCallback((e) => {
    setTitle(e.target.value);
    setError('');
  }, []);

  const handleLabelSelect = useCallback((e) => {
    setLabel(e.target.value);
    setError('');
  }, []);

  const validate = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('タイトルを入力してください');
      return false;
    }
    if (trimmed.length > 50) {
      setError('タイトルは50文字以内で入力してください');
      return false;
    }
    if (label && label !== '未設定' && !labelOptions.includes(label)) {
      setError('選択されたラベルは存在しません');
      return false;
    }
    return true;
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (validate()) {
          onSubmit(title.trim(), label ? label : '未設定');
          setTitle('');
          setLabel('');
          setError('');
        }
      }
    },
    [onSubmit, title, label, labelOptions]
  );

  const handleSubmit = useCallback(() => {
    if (validate()) {
      onSubmit(title.trim(), label ? label : '未設定');
      setTitle('');
      setLabel('');
      setError('');
    }
  }, [onSubmit, title, label, labelOptions]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1000] transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded-xl w-[400px] shadow-lg transition-all duration-300">
        <h2 className="mb-4 text-xl font-bold">新規Todo作成</h2>
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className="w-full p-2 mb-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          maxLength={50}
          placeholder="タイトルを入力"
        />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-50 text-base"
          value={label}
          onChange={handleLabelSelect}
        >
          <option value="未設定">未設定</option>
          {labelOptions.map((l, i) => (
            <option value={l} key={i}>{l}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={onClose}>キャンセル</SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>作成</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
