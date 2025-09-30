-- Optimización de índices para performance
-- Fecha: 2024-12-20
-- Descripción: Índices para mejorar consultas de customers y relaciones

-- Índices para tabla customers
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_tenant_active" ON "customers" ("tenantId", "isActive");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_tenant_created" ON "customers" ("tenantId", "createdAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_tenant_email" ON "customers" ("tenantId", "email");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_tenant_name" ON "customers" ("tenantId", "name");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_tenant_phone" ON "customers" ("tenantId", "phone");

-- Índices para búsquedas de texto
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_name_search" ON "customers" USING gin (to_tsvector('spanish', "name"));
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_email_search" ON "customers" USING gin (to_tsvector('spanish', "email"));

-- Índices para tabla orders
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_orders_customer_tenant" ON "orders" ("customerId", "tenantId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_orders_tenant_created" ON "orders" ("tenantId", "createdAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_orders_tenant_status" ON "orders" ("tenantId", "status");

-- Índices para tabla invoices
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_invoices_customer_tenant" ON "invoices" ("customerId", "tenantId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_invoices_tenant_created" ON "invoices" ("tenantId", "createdAt" DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_invoices_tenant_status" ON "invoices" ("tenantId", "status");

-- Índices para estadísticas
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_stats_active" ON "customers" ("tenantId", "isActive", "createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_stats_monthly" ON "customers" ("tenantId", "createdAt");

-- Índices para relaciones
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_orders_customer_count" ON "orders" ("customerId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_invoices_customer_count" ON "invoices" ("customerId");

-- Índices compuestos para consultas complejas
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_complex_search" ON "customers" ("tenantId", "isActive", "createdAt" DESC, "name");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_customers_email_unique" ON "customers" ("tenantId", "email") WHERE "email" IS NOT NULL;

-- Análisis de tablas para optimización
ANALYZE "customers";
ANALYZE "orders";
ANALYZE "invoices";

