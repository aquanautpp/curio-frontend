import { useState, useEffect, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Context para autenticação
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('curio_token'))

  useEffect(() => {
    if (token) {
      validateToken()
    } else {
      setLoading(false)
    }
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Token inválido, remove do localStorage
        localStorage.removeItem('curio_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Erro ao validar token:', error)
      localStorage.removeItem('curio_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('curio_token', data.token)
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Erro ao fazer login' }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const register = async (name, email, password, grade) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, grade })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('curio_token', data.token)
        setToken(data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Erro ao criar conta' }
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: 'Erro de conexão' }
    }
  }

  const logout = () => {
    localStorage.removeItem('curio_token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Componente de Login/Registro
const AuthForm = () => {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados do formulário
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações básicas
    if (!loginForm.email || !loginForm.password) {
      setError('Preencha todos os campos')
      setLoading(false)
      return
    }

    const result = await login(loginForm.email, loginForm.password)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.grade) {
      setError('Preencha todos os campos')
      setLoading(false)
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const result = await register(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.grade
    )
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    
    // Login com conta demo
    const result = await login('demo@curio.com', 'demo123')
    
    if (!result.success) {
      // Se não existir conta demo, cria uma
      const registerResult = await register('Estudante Demo', 'demo@curio.com', 'demo123', '7º Ano')
      if (!registerResult.success) {
        setError('Erro ao criar conta demo')
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Curió! 🐦
          </h1>
          <p className="text-gray-600">
            Sua plataforma de aprendizado inteligente
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesse sua conta</CardTitle>
            <CardDescription className="text-center">
              Entre ou crie uma nova conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              {/* Mensagens de erro/sucesso */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Tab de Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab de Registro */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-10"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-grade">Série/Ano</Label>
                    <Input
                      id="register-grade"
                      type="text"
                      placeholder="Ex: 7º Ano, 2º Ano EM"
                      value={registerForm.grade}
                      onChange={(e) => setRegisterForm(prev => ({
                        ...prev,
                        grade: e.target.value
                      }))}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar Conta
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Botão Demo */}
            <div className="mt-6 pt-6 border-t">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDemoLogin}
                disabled={loading}
              >
                <User className="mr-2 h-4 w-4" />
                Experimentar com Conta Demo
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Teste a plataforma sem criar uma conta
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente de proteção de rotas
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return children
}

export default AuthForm

