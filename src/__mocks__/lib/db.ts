// src/__mocks__/lib/db.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'

const mockPrisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(mockPrisma)
})

export const prisma = mockPrisma
