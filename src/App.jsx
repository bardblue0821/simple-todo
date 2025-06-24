import { useState, useEffect } from 'react';
import TodoBoard from './TodoBoard';
import Logo from './Logo';
import MenuBar from './MenuBar';
import TodoModal from './TodoModal';
import LabelModal from './LabelModal';

const STORAGE_KEY = 'todo-app-tasks-v1';

function App() {
  // タスク一覧の状態管理
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // モーダル表示状態
  const [modalOpen, setModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [labels, setLabels] = useState(() => {
    try {
      const saved = localStorage.getItem('todo-app-labels-v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // タスク一覧をlocalStorageに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todo-app-labels-v1', JSON.stringify(labels));
  }, [labels]);

  // タスクのエリア移動・並び替え
  const handleMoveTodo = (arg1, arg2) => {
    if (Array.isArray(arg1) || arg2 === '__reorder') {
      setTodos(arg1);
      return;
    }
    const id = arg1;
    const newArea = arg2;
    setTodos(prevTodos => {
      const filtered = prevTodos.filter(todo => todo.id !== id);
      const moved = prevTodos.find(todo => todo.id === id);
      if (!moved) return prevTodos;
      return [...filtered, { ...moved, area: newArea }];
    });
  };

  // タスクの完了状態切り替え
  const handleToggleDone = id => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  // 新規タスク追加
  const handleNewTodo = (title, label) => {
    setTodos(prevTodos => [
      ...prevTodos,
      { id: Date.now(), title, label, area: 'urgent_important', done: false }
    ]);
    setModalOpen(false);
  };

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-[220px] bg-white shadow-[2px_0_8px_#e5e7eb] sticky top-0 h-screen flex flex-col">
        <Logo />
        <MenuBar 
          onNewTodo={() => setModalOpen(true)} 
          onNewLabel={() => setLabelModalOpen(true)} 
          labels={labels} 
          onDeleteLabel={labelToDelete => {
            setLabels(prev => prev.filter(l => l.label !== labelToDelete));
            setTodos(prevTodos => prevTodos.map(todo =>
              todo.label === labelToDelete ? { ...todo, label: '未設定' } : todo
            ));
          }}
        />
      </aside>
      <main className="flex-1 flex items-start justify-center overflow-y-auto">
        <TodoBoard
          todos={todos}
          onMove={handleMoveTodo}
          onToggle={handleToggleDone}
          labels={labels}
        />
      </main>
      <TodoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewTodo}
        labelOptions={labels.map(l => l.label)}
      />
      <LabelModal
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        onSubmit={(label, color) => {
          setLabels(prev => [...prev, { label, color }]);
          setLabelModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
