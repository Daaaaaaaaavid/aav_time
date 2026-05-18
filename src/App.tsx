import Header from './components/Header'
import Timer from './components/Timer'
import Calendar from './components/Calendar'
import TodosList from './components/TodosList'
import TaskTemplateList from './components/TaskTemplateList'
import TimeEntriesList from './components/TimeEntriesList'
import { AppProvider } from './context/AppContext'
import './App.css'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Timer */}
            <div className="lg:col-span-1">
              <Timer />
            </div>

            {/* Center Column - Calendar */}
            <div className="lg:col-span-2">
              <Calendar />
            </div>
          </div>

          {/* Bottom Section - Todos, Templates & Time Entries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <TodosList />
            <TaskTemplateList />
            <TimeEntriesList />
          </div>
        </main>
      </div>
    </AppProvider>
  )
}

export default App
