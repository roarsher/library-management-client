 import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Calendar, MoreVertical, Plus, Repeat } from 'lucide-react';
import * as todoService from '../../services/todoService';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-600 border border-red-100',
  medium: 'bg-amber-50 text-amber-600 border border-amber-100',
  low: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const isOverdue = (t) => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString());
const isDueToday = (t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString();
const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null);

const emptyDraft = { title: '', priority: 'medium', category: 'General', dueDate: '', repeat: 'none', notes: '' };

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [draft, setDraft] = useState(emptyDraft);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [adding, setAdding] = useState(false);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('manual');

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedSubtasks, setExpandedSubtasks] = useState(new Set());
  const [subtaskInput, setSubtaskInput] = useState({});
  const [draggedId, setDraggedId] = useState(null);

  const loadTodos = async () => {
    try {
      const { data } = await todoService.getMyTodos();
      setTodos(data.todos);
    } catch {
      setError('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTodos(); }, []);

  const visibleTodos = useMemo(() => {
    let list = [...todos];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
    }
    if (filterPriority !== 'all') list = list.filter((t) => t.priority === filterPriority);
    if (sortBy === 'dueDate') {
      list.sort((a, b) => (!a.dueDate ? 1 : !b.dueDate ? -1 : new Date(a.dueDate) - new Date(b.dueDate)));
    } else if (sortBy === 'priority') {
      list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    } else if (sortBy === 'created') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [todos, search, filterPriority, sortBy]);

  const pending = visibleTodos.filter((t) => !t.isCompleted);
  const completed = visibleTodos.filter((t) => t.isCompleted);
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setAdding(true);
    try {
      const { data } = await todoService.createTodo({
        title: draft.title, priority: draft.priority, category: draft.category || 'General',
        dueDate: draft.dueDate || undefined, repeat: draft.repeat, notes: draft.notes,
      });
      setTodos((prev) => [...prev, data.todo]);
      setDraft(emptyDraft);
      setShowAddPanel(false);
    } catch {
      setError('Could not add task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (todo) => {
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? { ...t, isCompleted: !t.isCompleted } : t)));
    try {
      const { data } = await todoService.updateTodo(todo._id, { isCompleted: !todo.isCompleted });
      if (data.newTodo) setTodos((prev) => [...prev, data.newTodo]);
    } catch { loadTodos(); }
  };

  const handleDelete = async (id) => {
    setTodos((prev) => prev.filter((t) => t._id !== id));
    setOpenMenuId(null);
    try { await todoService.deleteTodo(id); } catch { loadTodos(); }
  };

  const startEdit = (todo) => {
    setOpenMenuId(null);
    setEditingId(todo._id);
    setEditDraft({
      title: todo.title, priority: todo.priority, category: todo.category || 'General',
      dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : '', repeat: todo.repeat || 'none', notes: todo.notes || '',
    });
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const saveEdit = async (id) => {
    const payload = { ...editDraft, dueDate: editDraft.dueDate || null };
    setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, ...payload } : t)));
    setEditingId(null);
    try { await todoService.updateTodo(id, payload); } catch { loadTodos(); }
  };

  const toggleExpanded = (id) => {
    setExpandedSubtasks((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const handleAddSubtask = async (todo) => {
    const text = (subtaskInput[todo._id] || '').trim();
    if (!text) return;
    const nextSubtasks = [...(todo.subtasks || []), { title: text, isCompleted: false }];
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? { ...t, subtasks: nextSubtasks } : t)));
    setSubtaskInput((prev) => ({ ...prev, [todo._id]: '' }));
    try {
      const { data } = await todoService.updateTodo(todo._id, { subtasks: nextSubtasks });
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? data.todo : t)));
    } catch { loadTodos(); }
  };
  const handleToggleSubtask = async (todo, subtaskId) => {
    const nextSubtasks = todo.subtasks.map((s) => (s._id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s));
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? { ...t, subtasks: nextSubtasks } : t)));
    try { await todoService.updateTodo(todo._id, { subtasks: nextSubtasks }); } catch { loadTodos(); }
  };
  const handleDeleteSubtask = async (todo, subtaskId) => {
    const nextSubtasks = todo.subtasks.filter((s) => s._id !== subtaskId);
    setTodos((prev) => prev.map((t) => (t._id === todo._id ? { ...t, subtasks: nextSubtasks } : t)));
    try { await todoService.updateTodo(todo._id, { subtasks: nextSubtasks }); } catch { loadTodos(); }
  };

  const handleDrop = async (targetId) => {
    if (!draggedId || draggedId === targetId || sortBy !== 'manual') { setDraggedId(null); return; }
    const current = [...todos];
    const fromIndex = current.findIndex((t) => t._id === draggedId);
    const toIndex = current.findIndex((t) => t._id === targetId);
    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    setTodos(current);
    setDraggedId(null);
    try { await todoService.reorderTodos(current.map((t, idx) => ({ id: t._id, order: idx }))); }
    catch { loadTodos(); }
  };

  const renderRow = (todo) => {
    const overdue = isOverdue(todo);
    const dueToday = isDueToday(todo);
    const subtaskDone = (todo.subtasks || []).filter((s) => s.isCompleted).length;
    const subtaskTotal = (todo.subtasks || []).length;
    const expanded = expandedSubtasks.has(todo._id);

    if (editingId === todo._id) {
      return (
        <div key={todo._id} className="p-3 rounded-xl bg-gray-50 border border-brand/30 space-y-2">
          <input value={editDraft.title} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={editDraft.priority} onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value })}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <input type="date" value={editDraft.dueDate} onChange={(e) => setEditDraft({ ...editDraft, dueDate: e.target.value })}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200" />
            <input value={editDraft.category} onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
              placeholder="Category" className="px-2 py-1.5 text-xs rounded-lg border border-gray-200" />
            <select value={editDraft.repeat} onChange={(e) => setEditDraft({ ...editDraft, repeat: e.target.value })}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white">
              <option value="none">No repeat</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={cancelEdit} className="text-xs px-3 py-1.5 text-gray-400 hover:text-gray-600">Cancel</button>
            <button onClick={() => saveEdit(todo._id)} className="text-xs px-4 py-1.5 rounded-lg bg-brand text-white font-medium">Save</button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={todo._id}
        draggable={sortBy === 'manual'}
        onDragStart={() => setDraggedId(todo._id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(todo._id)}
        className={`rounded-xl border transition-colors ${
          overdue ? 'bg-red-50/40 border-red-100' : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3 px-3 py-2.5">
          <button
            onClick={() => handleToggle(todo)}
            className={`h-5 w-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-colors ${
              todo.isCompleted ? 'bg-brand border-brand' : 'border-gray-300 hover:border-brand/50'
            }`}
          >
            {todo.isCompleted && <span className="text-white text-xs">✓</span>}
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {todo.category && todo.category !== 'General' && (
                <span className="text-xs text-gray-400">{todo.category}</span>
              )}
              {todo.repeat !== 'none' && (
                <span className="flex items-center gap-0.5 text-xs text-blue-500"><Repeat size={10} />{todo.repeat}</span>
              )}
              {subtaskTotal > 0 && (
                <button onClick={() => toggleExpanded(todo._id)} className="text-xs text-gray-400 hover:text-gray-600">
                  {subtaskDone}/{subtaskTotal} subtasks
                </button>
              )}
            </div>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${PRIORITY_STYLES[todo.priority]}`}>
            {todo.priority[0].toUpperCase() + todo.priority.slice(1)}
          </span>

          {todo.dueDate && (
            <span className={`hidden sm:flex items-center gap-1 text-xs whitespace-nowrap ${overdue ? 'text-red-500' : dueToday ? 'text-amber-500' : 'text-gray-400'}`}>
              <Calendar size={12} /> {formatDate(todo.dueDate)}
            </span>
          )}

          <div className="relative">
            <button onClick={() => setOpenMenuId(openMenuId === todo._id ? null : todo._id)} className="p-1 text-gray-300 hover:text-gray-600">
              <MoreVertical size={16} />
            </button>
            {openMenuId === todo._id && (
              <div className="absolute right-0 top-7 z-10 w-32 rounded-lg bg-white border border-gray-100 shadow-lg overflow-hidden">
                <button onClick={() => startEdit(todo)} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                <button onClick={() => handleDelete(todo._id)} className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50">Delete</button>
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <div className="px-3 pb-2.5 pl-11 space-y-1.5 border-t border-gray-50 pt-2">
            {(todo.subtasks || []).map((s) => (
              <div key={s._id} className="flex items-center gap-2 group">
                <button
                  onClick={() => handleToggleSubtask(todo, s._id)}
                  className={`h-3.5 w-3.5 rounded border flex-shrink-0 ${s.isCompleted ? 'bg-brand border-brand' : 'border-gray-300'}`}
                />
                <span className={`text-xs flex-1 ${s.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>{s.title}</span>
                <button
                  onClick={() => handleDeleteSubtask(todo, s._id)}
                  className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <input
                value={subtaskInput[todo._id] || ''}
                onChange={(e) => setSubtaskInput((prev) => ({ ...prev, [todo._id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask(todo))}
                placeholder="Add subtask..."
                className="flex-1 text-xs px-2 py-1 rounded border border-gray-200"
              />
              <button onClick={() => handleAddSubtask(todo)} className="text-xs text-brand hover:underline">Add</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">To-Do List</h3>
        <button
          onClick={() => setShowAddPanel((s) => !s)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
        >
          <Plus size={14} /> New task
        </button>
      </div>

      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{completedCount} of {totalCount} complete</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {showAddPanel && (
        <form onSubmit={handleAdd} className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="flex gap-2">
            <input
              autoFocus type="text" value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Task title..."
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <select
              value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
            >
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200" />
            <input type="text" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="Category" className="px-2 py-1.5 text-xs rounded-lg border border-gray-200" />
            <select value={draft.repeat} onChange={(e) => setDraft({ ...draft, repeat: e.target.value })}
              className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white">
              <option value="none">No repeat</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
            </select>
            <input type="text" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="Notes" className="px-2 py-1.5 text-xs rounded-lg border border-gray-200" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowAddPanel(false)} className="text-xs px-3 py-1.5 text-gray-400 hover:text-gray-600">Cancel</button>
            <button type="submit" disabled={adding} className="text-xs px-4 py-1.5 rounded-lg bg-brand text-white font-medium disabled:opacity-50">
              {adding ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
          <Search size={14} className="text-gray-300" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1 min-w-0"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`p-2 rounded-lg border transition-colors ${showFilters ? 'bg-brand/10 border-brand/30 text-brand' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button key={p} onClick={() => setFilterPriority(p)}
              className={`text-xs px-2.5 py-1 rounded-full border ${filterPriority === p ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-500 border-gray-200 hover:border-gray-300 bg-white'}`}>
              {p === 'all' ? 'All priorities' : p}
            </button>
          ))}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="ml-auto text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-600">
            <option value="manual">Manual order</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="created">Newest</option>
          </select>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks...</p>
      ) : visibleTodos.length === 0 ? (
        <p className="text-sm text-gray-400">{todos.length === 0 ? 'No tasks yet. Add one above.' : 'No tasks match your filters.'}</p>
      ) : (
        <div className="space-y-2">
          {pending.map(renderRow)}
          {completed.length > 0 && (
            <>
              <p className="text-xs text-gray-400 mt-3 mb-1">Completed ({completed.length})</p>
              {completed.map(renderRow)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;