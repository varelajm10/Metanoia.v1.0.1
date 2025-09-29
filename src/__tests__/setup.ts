// Configuración global para tests
import '@testing-library/jest-dom'

// Mock de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock de Next.js server components
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string
    method: string
    headers: Headers
    body: any

    constructor(url: string, init?: RequestInit) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Headers(init?.headers)
      this.body = init?.body
    }

    async json() {
      return JSON.parse(this.body)
    }
  },
  NextResponse: {
    json: (data: any, init?: ResponseInit) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      ...init,
    }),
  },
}))

// Mock de Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  })),
}))

// Mock de variables de entorno
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.REDIS_URL = 'redis://localhost:6379'

// Configuración de timeouts para tests
jest.setTimeout(10000)

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks()
})

// Configuración global para manejo de errores en tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Mock de console.error para evitar ruido en tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
