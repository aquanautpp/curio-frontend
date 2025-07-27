import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Dashboard from './components/Dashboard.jsx'
import SingaporeMethod from './components/SingaporeMethod.jsx'
import ProblemOfTheDay from './components/ProblemOfTheDay.jsx'
import AITutorChat from './components/AITutorChat.jsx'
import {
  Home,
  Trophy,
  Brain,
  Target,
  MessageCircle,
  Menu,
  X,
  User
} from 'lucide-react'

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sections = [
    { id: 'hero', name: 'Início', icon: Home, component: Hero },
    { id: 'dashboard', name: 'Dashboard', icon: Trophy, component: Dashboard },
    { id: 'singapore', name: 'Método Singapura', icon: Brain, component: SingaporeMethod },
    { id: 'problem', name: 'Problema do Dia', icon: Target, component: ProblemOfTheDay },
    { id: 'tutor', name: 'Tutor de IA', icon: MessageCircle, component: AITutorChat }
  ]

  const CurrentComponent = sections.find(s => s.id === activeSection)?.component || Hero

  return (
    <div className="main-layout">
      {/* Overlay para mobile */}
      <div 
        className={`overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'sidebar-hidden' : ''}`}>
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              C
            </div>
            <h1>Curió</h1>
          </div>

          {/* Navegação */}
          <nav>
            <ul className="sidebar-nav">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <li key={section.id} className="sidebar-nav-item">
                    <button
                      className={`sidebar-nav-button ${activeSection === section.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSection(section.id)
                        setSidebarOpen(false)
                      }}
                    >
                      <Icon size={18} />
                      {section.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Informações do usuário */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#111827' }}>
                  Victor Pires
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  7º Ano
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className={`main-content ${sidebarOpen ? '' : 'main-content-full'}`}>
        {/* Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="header-title">
              {sections.find(s => s.id === activeSection)?.name || 'Curió'}
            </h1>
          </div>
          
          <div className="header-user">
            <User size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Victor Pires
            </span>
          </div>
        </header>

        {/* Conteúdo da Seção */}
        <main className="fade-in">
          <CurrentComponent />
        </main>
      </div>
    </div>
  )
}

export default App

