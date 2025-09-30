// src/__mocks__/db.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { DeepMockProxy } from 'jest-mock-extended/lib/mjs/Mock'

const mockPrisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(mockPrisma)
})

export const prisma = mockPrisma as unknown as PrismaClient
export const mockPrismaTyped =
  mockPrisma as unknown as DeepMockProxy<PrismaClient>
