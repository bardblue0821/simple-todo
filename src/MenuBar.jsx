import React from 'react';

export default function MenuBar({ onNewTodo }) {
  return (
    <aside className="w-52 h-screen flex flex-col items-center pt-4">
      <div className="w-full">
        <NewTodoButton onClick={onNewTodo} />
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
