import { useState, useEffect } from 'react'
import Logo from './Logo'
import MenuBar from './MenuBar'
import TodoModal from './TodoModal'
import TodoBoard from './TodoBoard'

const STORAGE_KEY = 'todo-app-tasks-v1';

function App() {
  // localStorageから初期値を取得
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false)

  // todosが変わるたびlocalStorageに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleNewTodo = (title) => {
    setTodos([
      ...todos,
      { id: Date.now(), title, area: 'urgent_important', done: false }
    ])
    setModalOpen(false)
  }

  // タスク移動用（エリア移動 or 並び替え）
  const handleMoveTodo = (arg1, arg2) => {
    // 並び替え（配列渡し）
    if (Array.isArray(arg1)) {
      setTodos(arg1);
      return;
    }
    // __reorderフラグが来た場合も配列渡し
    if (arg2 === '__reorder') {
      setTodos(arg1);
      return;
    }
    // エリア移動（従来通り）
    const id = arg1, newArea = arg2;
    setTodos(todos => todos.map(todo =>
      todo.id === id ? { ...todo, area: newArea } : todo
    ));
  };

  // チェックボックス切り替え
  const handleToggleDone = (id) => {
    setTodos(todos => todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  return (
    <div className="flex h-[100dvh] md:overflow-hidden">
      <div style={{ width: 220, background: '#fff', boxShadow: '2px 0 8px #e5e7eb' }}>
        <Logo />
        <MenuBar onNewTodo={() => setModalOpen(true)} />
      </div>
      <main className="flex-1 flex items-start justify-center min-w-0">
        <TodoBoard todos={todos} onMove={handleMoveTodo} onToggle={handleToggleDone} />
      </main>
      <TodoModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleNewTodo} />
    </div>
  )
}

export default App
