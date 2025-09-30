// src/__mocks__/@prisma/client.ts
import { mockDeep, mockReset } from 'jest-mock-extended'
import { DeepMockProxy } from 'jest-mock-extended/lib/mjs/Mock'

// Mock de PrismaClient
const mockPrisma = mockDeep<any>()

beforeEach(() => {
  mockReset(mockPrisma)
})

// Mock de la clase PrismaClient
export const PrismaClient = jest.fn().mockImplementation(() => mockPrisma)

export const mockPrismaTyped = mockPrisma as unknown as DeepMockProxy<any>

// Exportar también el mock directo
export { mockPrisma }
