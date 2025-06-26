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
  const [hiddenLabels, setHiddenLabels] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
        labels={labels}
      />
      {deleteTarget && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="bg-white p-6 rounded-xl shadow-xl min-w-[280px] z-10">
            <div className="mb-4 text-base">ラベル「{deleteTarget}」を削除しますか？</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300"
                onClick={() => setDeleteTarget(null)}
              >キャンセル</button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
                onClick={() => {
                  setLabels(prev => prev.filter(l => l.label !== deleteTarget));
                  setTodos(prevTodos => prevTodos.map(todo =>
                    todo.label === deleteTarget ? { ...todo, label: '未設定' } : todo
                  ));
                  setHiddenLabels(prev => prev.filter(l => l !== deleteTarget));
                  setDeleteTarget(null);
                }}
              >削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
