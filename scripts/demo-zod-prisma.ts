#!/usr/bin/env tsx

/**
 * DEMOSTRACIÓN DE USO DE ZOD-PRISMA-TYPES
 * 
 * Este script demuestra cómo usar los esquemas autogenerados de Zod
 * para validar datos en tu aplicación Metanoia ERP.
 */

import { 
  ProductCreateInputSchema,
  CustomerCreateInputSchema,
  ProductSchema,
  CustomerSchema
} from '../lib/zod'
import { CreateProductSchema, CreateCustomerSchema } from '../src/lib/validations/product'
import { CreateCustomerSchema as CustomerValidationSchema } from '../src/lib/validations/customer'

// ========================================
// EJEMPLO 1: VALIDACIÓN BÁSICA CON ESQUEMAS AUTOGENERADOS
// ========================================

console.log('🚀 DEMOSTRACIÓN DE ZOD-PRISMA-TYPES\n')

// Datos de ejemplo para un producto
const productData = {
  name: 'Laptop Dell XPS 13',
  description: 'Laptop ultradelgada con pantalla 13 pulgadas',
  sku: 'DELL-XPS13-001',
  barcode: '1234567890123',
  price: 1299.99,
  cost: 899.99,
  stock: 50,
  minStock: 5,
  maxStock: 100,
  category: 'Electrónicos',
  brand: 'Dell',
  weight: 1.27,
  dimensions: {
    length: 30.5,
    width: 20.0,
    height: 1.5,
    unit: 'cm'
  },
  isActive: true,
  isDigital: false,
  tags: ['laptop', 'ultrabook', 'premium']
}

// Datos de ejemplo para un cliente
const customerData = {
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  phone: '+1-555-0123',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  },
  isActive: true
}

console.log('📦 VALIDANDO DATOS DE PRODUCTO...')
try {
  // Usando el esquema autogenerado directamente
  const validatedProduct = ProductCreateInputSchema.parse({
    ...productData,
    tenantId: 'tenant-123' // Campo requerido por Prisma
  })
  console.log('✅ Producto validado correctamente:', validatedProduct.name)
} catch (error) {
  console.error('❌ Error validando producto:', error)
}

console.log('\n👤 VALIDANDO DATOS DE CLIENTE...')
try {
  // Usando el esquema autogenerado directamente
  const validatedCustomer = CustomerCreateInputSchema.parse({
    ...customerData,
    tenantId: 'tenant-123' // Campo requerido por Prisma
  })
  console.log('✅ Cliente validado correctamente:', validatedCustomer.name)
} catch (error) {
  console.error('❌ Error validando cliente:', error)
}

// ========================================
// EJEMPLO 2: USANDO ESQUEMAS REFACTORIZADOS CON VALIDACIONES PERSONALIZADAS
// ========================================

console.log('\n🔧 USANDO ESQUEMAS REFACTORIZADOS...')

// Datos de producto con validaciones personalizadas
const productWithCustomValidation = {
  name: 'Smartphone Samsung Galaxy S24',
  description: 'Teléfono inteligente con IA',
  sku: 'SAMSUNG-S24-001',
  price: 999.99,
  cost: 650.00,
  stock: 25,
  minStock: 3,
  maxStock: 50,
  category: 'Smartphones',
  brand: 'Samsung',
  weight: 0.168,
  dimensions: {
    length: 14.7,
    width: 7.0,
    height: 0.8,
    unit: 'cm'
  },
  isActive: true,
  isDigital: false,
  tags: ['smartphone', 'android', 'premium']
}

try {
  const validatedProductCustom = CreateProductSchema.parse(productWithCustomValidation)
  console.log('✅ Producto con validaciones personalizadas:', validatedProductCustom.name)
  console.log('   - Precio:', validatedProductCustom.price)
  console.log('   - Stock:', validatedProductCustom.stock)
  console.log('   - Categoría:', validatedProductCustom.category)
} catch (error) {
  console.error('❌ Error validando producto personalizado:', error)
}

// Datos de cliente con validaciones personalizadas
const customerWithCustomValidation = {
  name: 'María García',
  email: 'maria.garcia@empresa.com',
  phone: '+34-91-123-4567',
  address: {
    street: 'Calle Gran Vía 123',
    city: 'Madrid',
    state: 'Madrid',
    zipCode: '28013',
    country: 'España'
  },
  isActive: true
}

try {
  const validatedCustomerCustom = CustomerValidationSchema.parse(customerWithCustomValidation)
  console.log('✅ Cliente con validaciones personalizadas:', validatedCustomerCustom.name)
  console.log('   - Email:', validatedCustomerCustom.email)
  console.log('   - Teléfono:', validatedCustomerCustom.phone)
  console.log('   - Ciudad:', validatedCustomerCustom.address?.city)
} catch (error) {
  console.error('❌ Error validando cliente personalizado:', error)
}

// ========================================
// EJEMPLO 3: DEMOSTRACIÓN DE SINCRONIZACIÓN AUTOMÁTICA
// ========================================

console.log('\n🔄 DEMOSTRACIÓN DE SINCRONIZACIÓN AUTOMÁTICA...')

// Simulando datos que vienen de la base de datos
const productFromDB = {
  id: 'cuid-product-123',
  name: 'MacBook Pro 16"',
  description: 'Laptop profesional de Apple',
  sku: 'APPLE-MBP16-001',
  barcode: '9876543210987',
  price: 2499.00,
  cost: 1800.00,
  stock: 15,
  minStock: 2,
  maxStock: 30,
  category: 'Laptops',
  brand: 'Apple',
  weight: 2.0,
  dimensions: {
    length: 35.57,
    width: 24.81,
    height: 1.68,
    unit: 'cm'
  },
  isActive: true,
  isDigital: false,
  tags: ['laptop', 'macbook', 'professional'],
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
  tenantId: 'tenant-123'
}

try {
  // Validando datos que vienen de la base de datos usando el esquema base
  const validatedProductFromDB = ProductSchema.parse(productFromDB)
  console.log('✅ Producto de BD validado:', validatedProductFromDB.name)
  console.log('   - ID:', validatedProductFromDB.id)
  console.log('   - Creado:', validatedProductFromDB.createdAt)
  console.log('   - Tenant:', validatedProductFromDB.tenantId)
} catch (error) {
  console.error('❌ Error validando producto de BD:', error)
}

// ========================================
// EJEMPLO 4: MANEJO DE ERRORES Y VALIDACIONES
// ========================================

console.log('\n⚠️  DEMOSTRACIÓN DE MANEJO DE ERRORES...')

// Datos inválidos para demostrar validaciones
const invalidProductData = {
  name: '', // Nombre vacío - debería fallar
  sku: 'A'.repeat(150), // SKU demasiado largo - debería fallar
  price: -100, // Precio negativo - debería fallar
  stock: -5, // Stock negativo - debería fallar
  email: 'invalid-email' // Email inválido - debería fallar
}

try {
  CreateProductSchema.parse(invalidProductData)
  console.log('❌ No debería llegar aquí - datos inválidos fueron aceptados')
} catch (error) {
  console.log('✅ Error capturado correctamente:')
  if (error instanceof Error) {
    console.log('   - Mensaje:', error.message)
  }
}

console.log('\n🎉 DEMOSTRACIÓN COMPLETADA')
console.log('\n📋 BENEFICIOS DE ZOD-PRISMA-TYPES:')
console.log('   ✅ Sincronización automática con la base de datos')
console.log('   ✅ Tipado fuerte con TypeScript')
console.log('   ✅ Validaciones consistentes')
console.log('   ✅ Mantenimiento reducido')
console.log('   ✅ Refactoring seguro')
console.log('   ✅ Flexibilidad para personalizar validaciones')
