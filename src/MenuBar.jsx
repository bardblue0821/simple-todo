import React from 'react';

export default function MenuBar({ onNewTodo, onNewLabel }) {
  return (
    <aside className="w-52 h-screen flex flex-col items-center pt-4">
      <div className="w-full">
        <NewTodoButton onClick={onNewTodo} />
        <NewLabelButton onClick={onNewLabel} />
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
