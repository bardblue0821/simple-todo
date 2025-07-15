import { useState, useEffect } from 'react';
import TodoBoard from './TodoBoard';
import Logo from './Logo';
import MenuBar from './MenuBar';
import CreateTodoModal from './components/modals/CreateTodoModal';
import CreateLabelModal from './components/modals/CreateLabelModal';
import DeleteLabelModal from './components/modals/DeleteLabelModal';
import EditTodoModal from './components/modals/EditTodoModal';

const STORAGE_KEY = 'todo-app-tasks-v1';
const LABELS_KEY = 'todo-app-labels-v1';

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function App() {
  // 状態管理
  const [todos, setTodos] = useLocalStorageState(STORAGE_KEY, []);
  const [labels, setLabels] = useLocalStorageState(LABELS_KEY, []);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [hiddenLabels, setHiddenLabels] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTodo, setEditTodo] = useState(null);

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
    setTodoModalOpen(false);
  };

  // ラベル削除処理
  const handleDeleteLabel = () => {
    setLabels(prev => prev.filter(l => l.label !== deleteTarget));
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.label === deleteTarget ? { ...todo, label: '未設定' } : todo
    ));
    setHiddenLabels(prev => prev.filter(l => l !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-[220px] bg-white shadow-[2px_0_8px_#e5e7eb] sticky top-0 h-screen flex flex-col">
        <Logo />
        <MenuBar 
          onNewTodo={() => setTodoModalOpen(true)} 
          onNewLabel={() => setLabelModalOpen(true)} 
          labels={labels} 
          onDeleteLabel={setDeleteTarget}
          hiddenLabels={hiddenLabels}
          onToggleHideLabel={label => {
            setHiddenLabels(prev => prev.includes(label)
              ? prev.filter(l => l !== label)
              : [...prev, label]
            );
          }}
        />
      </aside>
      <main className="flex-1 flex items-start justify-center overflow-y-auto">
        <TodoBoard
          todos={todos}
          onMove={handleMoveTodo}
          onToggle={handleToggleDone}
          labels={labels}
          hiddenLabels={hiddenLabels}
          onEditTodo={(id, title, label) => {
            setTodos(prevTodos => prevTodos.map(todo =>
              todo.id === id ? { ...todo, title, label } : todo
            ));
          }}
          onDeleteTodo={id => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            setEditTodo(null);
          }}
          setEditTask={todo => setEditTodo(todo)}
        />
      </main>
      <CreateTodoModal
        open={todoModalOpen}
        onClose={() => setTodoModalOpen(false)}
        onSubmit={handleNewTodo}
        labelOptions={labels.map(l => l.label)}
      />
      <CreateLabelModal
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        onSubmit={(label, color) => {
          setLabels(prev => [...prev, { label, color }]);
          setLabelModalOpen(false);
        }}
        labels={labels}
      />
      {deleteTarget && (
        <DeleteLabelModal
          label={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDelete={handleDeleteLabel}
        />
      )}
      {editTodo && (
        <EditTodoModal
          task={editTodo}
          labels={labels}
          onClose={() => setEditTodo(null)}
          onSubmit={(title, label) => {
            setTodos(prevTodos => prevTodos.map(todo =>
              todo.id === editTodo.id ? { ...todo, title, label } : todo
            ));
            setEditTodo(null);
          }}
          onDelete={() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== editTodo.id));
            setEditTodo(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
