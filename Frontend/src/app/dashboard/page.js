// client/src/app/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchTasks,
  fetchStats,
  createTask,
  updateTask,
  deleteTask,
  setFilterStatus,
  setSortBy,
  setSearchTerm,
  clearError,
  clearMessage,
  selectFilteredAndSortedTasks,
} from '../../redux/slices/tasksSlice';
import { logout } from '../../redux/slices/authSlice';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Alert, 
  Spinner, 
  EmptyState 
} from '../../components/shared';
import { 
  formatDate, 
  getPriorityColor, 
  getStatusColor,
} from '../../utils/helpers';

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { 
    tasks: allTasks,
    stats, 
    loading, 
    error, 
    message,
    filterStatus,
    sortBy,
    searchTerm,
  } = useSelector((state) => state.tasks);
  const filteredTasks = useSelector(selectFilteredAndSortedTasks);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }

    dispatch(createTask(formData)).then(() => {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: ''
      });
      setShowForm(false);
      dispatch(fetchStats());
    });
  };

  const handleUpdateTask = (id, updates) => {
    dispatch(updateTask({ id, updates })).then(() => {
      dispatch(fetchStats());
    });
  };

  const handleDeleteTask = (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    dispatch(deleteTask(id)).then(() => {
      dispatch(fetchStats());
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      router.push('/');
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Fetch tasks and stats on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
      dispatch(fetchStats());
    }
  }, [dispatch, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                📋 Task Tracker
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Manage your tasks efficiently
              </p>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex gap-2">
              <Button 
                onClick={() => setShowForm(!showForm)}
                variant="primary"
                className="text-sm"
              >
                ➕ New Task
              </Button>
              <Button 
                onClick={handleLogout}
                variant="danger"
                className="text-sm"
              >
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex flex-col gap-1.5 p-2"
            >
              <span className="w-6 h-0.5 bg-gray-800"></span>
              <span className="w-6 h-0.5 bg-gray-800"></span>
              <span className="w-6 h-0.5 bg-gray-800"></span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 flex flex-col gap-2">
              <Button 
                onClick={() => {
                  setShowForm(!showForm);
                  setMobileMenuOpen(false);
                }}
                variant="primary"
                className="w-full text-sm"
              >
                ➕ New Task
              </Button>
              <Button 
                onClick={handleLogout}
                variant="danger"
                className="w-full text-sm"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
        {message && <Alert type="success" message={message} onClose={() => dispatch(clearMessage())} />}

        {/* Stats */}
        {stats && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6">
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Total</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.todo}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">To Do</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.inProgress}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">In Progress</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.done}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Done</div>
            </Card>
            <Card className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">High</div>
            </Card>
          </div>
        )}

        {/* Create Task Form */}
        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-gray-800">✨ Create New Task</h2>
            <form onSubmit={handleCreateTask} className="grid gap-3 sm:gap-4">
              {/* Title and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Title</label>
                  <Input 
                    type="text"
                    placeholder="What needs to be done?" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Priority</label>
                  <Select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    options={[
                      { value: 'low', label: '🟢 Low' },
                      { value: 'medium', label: '🟡 Medium' },
                      { value: 'high', label: '🔴 High' }
                    ]}
                  />
                </div>
              </div>

              {/* Description and Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2 sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Description</label>
                  <textarea 
                    placeholder="Add details (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="border border-gray-300 p-2 sm:p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black resize-none h-16 sm:h-20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Due Date</label>
                  <Input 
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 text-sm"
                >
                  {loading ? <Spinner size="sm" /> : '➕ Add Task'}
                </Button>
                <Button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="secondary"
                  className="flex-1 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters and Sort - Mobile and Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <Input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Filter</label>
            <Select 
              value={filterStatus}
              onChange={(e) => dispatch(setFilterStatus(e.target.value))}
              options={[
                { value: 'all', label: '📋 All' },
                { value: 'todo', label: '📝 To Do' },
                { value: 'in-progress', label: '⚙️ Progress' },
                { value: 'done', label: '✅ Done' }
              ]}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Sort</label>
            <Select 
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              options={[
                { value: 'createdAt', label: 'Latest' },
                { value: 'priority', label: 'Priority' },
                { value: 'dueDate', label: 'Due Date' },
                { value: 'title', label: 'A - Z' }
              ]}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                variant="primary"
                className="w-full text-xs sm:text-sm sm:hidden"
              >
                ➕ New
              </Button>
            )}
          </div>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-lg sm:text-2xl font-bold mb-4 text-gray-800">
            {filteredTasks.length === 0 ? '📭 No Tasks' : `📌 Tasks (${filteredTasks.length})`}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState 
              title={searchTerm ? 'No matching tasks' : 'No tasks yet'}
              description={searchTerm ? 'Try different search terms' : 'Create your first task to get started'}
              icon={searchTerm ? '🔍' : '🎯'}
            />
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {filteredTasks.map((task) => (
                <Card 
                  key={task._id} 
                  className={`p-3 sm:p-4 ${getStatusColor(task.status)}`}
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 break-words">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-200 text-gray-800 border border-gray-300">
                            📅 {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:items-center">
                      <div className="flex-1 sm:min-w-[140px] sm:max-w-[160px]">
                        <Select 
                          value={task.status}
                          onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                          options={[
                            { value: 'todo', label: '📝 To Do' },
                            { value: 'in-progress', label: '⚙️ Progress' },
                            { value: 'done', label: '✅ Done' }
                          ]}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                      <Button 
                        onClick={() => handleDeleteTask(task._id)}
                        variant="danger"
                        className="text-xs sm:text-sm w-full sm:w-auto sm:min-w-[100px]"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}