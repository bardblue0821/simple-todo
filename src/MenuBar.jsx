import React from 'react';

export default function MenuBar({ onNewTodo }) {
  return (
    <aside
      style={{
        width: 200,
        background: '#f3f4f6',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
      }}
    >
      <div style={{ width: '100%' }}>
        <NewTodoButton onClick={onNewTodo} />
      </div>
    </aside>
  );
}

const NewTodoButton = React.memo(function NewTodoButton({ onClick }) {
  return (
    <button
      style={{
        width: '90%',
        margin: '1rem 0',
        padding: '0.5rem',
        background: '#6366f1',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      新規作成
    </button>
  );
});
