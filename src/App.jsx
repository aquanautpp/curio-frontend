import { useState, useEffect } from 'react'
import { AuthProvider, useAuth, ProtectedRoute } from './components/AuthSystem.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import DashboardFunctional from './components/DashboardFunctional.jsx'
import SingaporeMethod from './components/SingaporeMethod.jsx'
import ProblemOfTheDay from './components/ProblemOfTheDay.jsx'
import AITutorChat from './components/AITutorChat.jsx'
import MathematicsSection from './components/MathematicsSection.jsx'
import ScienceSection from './components/ScienceSection.jsx'
import GamificationSystem from './components/GamificationSystem.jsx'
import { AnimationStyles } from './components/AnimatedComponents.jsx'
import { LoadingOverlay } from './components/LoadingStates.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import {
  Home,
  Calculator,
  Microscope,
  MessageCircle,
  Trophy,
  Brain,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'

// Componente principal da aplicação
const MainApp = () => {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])

  // Seções da aplicação
  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      component: DashboardFunctional,
      description: 'Visão geral do seu progresso'
    },
    {
      id: 'mathematics',
      name: 'Matemática',
      icon: Calculator,
      component: MathematicsSection,
      description: 'Método de Singapura e exercícios'
    },
    {
      id: 'science',
      name: 'Ciências',
      icon: Microscope,
      component: ScienceSection,
      description: 'Explore o mundo da ciência'
    },
    {
      id: 'singapore',
      name: 'Método Singapura',
      icon: Brain,
      component: SingaporeMethod,
      description: 'Aprendizado estruturado'
    },
    {
      id: 'problem',
      name: 'Problema do Dia',
      icon: Target,
      component: ProblemOfTheDay,
      description: 'Desafio diário de raciocínio'
    },
    {
      id: 'tutor',
      name: 'Tutor de IA',
      icon: MessageCircle,
      component: AITutorChat,
      description: 'Converse com o Curió'
    },
    {
      id: 'progress',
      name: 'Progresso',
      icon: Trophy,
      component: GamificationSystem,
      description: 'Conquistas e estatísticas'
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)
  const CurrentComponent = currentSection?.component || DashboardFunctional

  const handleSectionChange = (sectionId) => {
    setLoading(true)
    setActiveSection(sectionId)
    setSidebarOpen(false)
    
    // Simula carregamento para transição suave
    setTimeout(() => setLoading(false), 300)
  }

  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications(prev => [...prev, notification])
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  // Efeito para demonstrar notificações
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      addNotification(`Bem-vindo de volta, ${user?.name || 'Estudante'}! 🎉`, 'success')
    }, 1000)

    return () => clearTimeout(welcomeTimer)
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimationStyles />
      
      {/* Header */}
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}>
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {sections.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Estudante'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.grade || 'Ensino Fundamental'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">/</span>
              <span className="text-gray-900 font-medium">
                {currentSection?.name || 'Dashboard'}
              </span>
            </div>

            {/* Content */}
            <LoadingOverlay isLoading={loading} text="Carregando seção...">
              <div className="animate-fade-in">
                <CurrentComponent />
              </div>
            </LoadingOverlay>
          </div>
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            className={`
              max-w-sm shadow-lg animate-slide-up
              ${notification.type === 'success' 
                ? 'border-green-200 bg-green-50' 
                : notification.type === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-blue-200 bg-blue-50'
              }
            `}
          >
            <div className="flex items-start gap-2">
              {notification.type === 'success' && (
                <Sparkles className="w-4 h-4 text-green-600 mt-0.5" />
              )}
              {notification.type === 'error' && (
                <X className="w-4 h-4 text-red-600 mt-0.5" />
              )}
              {notification.type === 'info' && (
                <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
              )}
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </div>

      {/* Quick Actions (Floating) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        {activeSection !== 'tutor' && (
          <Button
            onClick={() => handleSectionChange('tutor')}
            className="w-12 h-12 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
            title="Abrir Tutor de IA"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        )}
        
        {activeSection !== 'problem' && (
          <Button
            onClick={() => handleSectionChange('problem')}
            className="w-12 h-12 rounded-full shadow-lg bg-green-500 hover:bg-green-600"
            title="Problema do Dia"
          >
            <Target className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Componente de boas-vindas para novos usuários
const WelcomeScreen = () => {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Curió! 🐦
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua plataforma educacional inteligente com IA, gamificação e o método de Singapura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Tutor de IA</CardTitle>
              <CardDescription>
                Converse com o Curió, seu tutor pessoal que responde dúvidas e ensina de forma amigável
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calculator className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Método de Singapura</CardTitle>
              <CardDescription>
                Aprenda matemática com o método CPA: Concreto, Pictórico e Abstrato
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle>Sistema de Conquistas</CardTitle>
              <CardDescription>
                Ganhe pontos, desbloqueie conquistas e acompanhe seu progresso
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => setShowDemo(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-5 h-5 mr-2" />
            Começar Jornada de Aprendizado
          </Button>
        </div>

        {showDemo && (
          <div className="mt-12">
            <Hero />
          </div>
        )}
      </div>
    </div>
  )
}

// Componente raiz da aplicação
function App() {
  return (
    <MainApp />
  )
}

export default App

