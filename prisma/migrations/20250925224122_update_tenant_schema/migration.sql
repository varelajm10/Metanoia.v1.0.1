/*
  Warnings:

  - Added the required column `contactEmail` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionStartDate` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServerClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING');

-- CreateEnum
CREATE TYPE "ServerAlertType" AS ENUM ('CPU_HIGH', 'MEMORY_HIGH', 'DISK_FULL', 'NETWORK_DOWN', 'SERVICE_DOWN', 'CERTIFICATE_EXPIRING', 'BACKUP_FAILED', 'SECURITY_BREACH', 'PERFORMANCE_DEGRADED');

-- CreateEnum
CREATE TYPE "ServerAlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ServerMetricType" AS ENUM ('CPU_USAGE', 'MEMORY_USAGE', 'DISK_USAGE', 'NETWORK_IN', 'NETWORK_OUT', 'UPTIME', 'RESPONSE_TIME', 'TEMPERATURE', 'POWER_CONSUMPTION');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('SCHEDULED', 'EMERGENCY', 'PLANNED', 'PREVENTIVE', 'CORRECTIVE');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "ServerCostType" AS ENUM ('HARDWARE', 'SOFTWARE', 'BANDWIDTH', 'POWER', 'COOLING', 'MAINTENANCE', 'LICENSING', 'SUPPORT', 'BACKUP', 'MONITORING');

-- CreateEnum
CREATE TYPE "CostPeriod" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "NetworkConnectionType" AS ENUM ('DEDICATED', 'SHARED', 'CLOUD', 'HYBRID', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('METRIC_THRESHOLD', 'SERVER_DOWN', 'MAINTENANCE_REMINDER', 'SECURITY_ALERT', 'PERFORMANCE_DEGRADED', 'DISK_SPACE_LOW', 'CERTIFICATE_EXPIRING', 'BACKUP_FAILED');

-- CreateEnum
CREATE TYPE "NotificationSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'SLACK', 'TEAMS', 'WEBHOOK', 'PUSH');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "ServerHealthStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'OFFLINE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "ServerAlertStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL_MARKETING', 'EVENT', 'COLD_CALL', 'ADVERTISEMENT', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURING');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('CUSTOMER', 'PROSPECT', 'PARTNER', 'VENDOR', 'COMPETITOR');

-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL_MARKETING', 'EVENT', 'COLD_CALL', 'ADVERTISEMENT', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('EMAIL', 'PHONE_CALL', 'MEETING', 'DEMO', 'PRESENTATION', 'PROPOSAL', 'FOLLOW_UP', 'NURTURING');

-- CreateEnum
CREATE TYPE "CommunicationDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('ACTIVE', 'CLOSED_WON', 'CLOSED_LOST', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServerAccessType" AS ENUM ('SSH', 'RDP', 'FTP', 'SFTP', 'WEB', 'API', 'DATABASE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ServerAccessLevel" AS ENUM ('READ_ONLY', 'LIMITED', 'STANDARD', 'ADMINISTRATOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ServerUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "ServerAccessAction" AS ENUM ('LOGIN', 'LOGOUT', 'COMMAND_EXECUTION', 'FILE_UPLOAD', 'FILE_DOWNLOAD', 'CONFIGURATION_CHANGE', 'ACCESS_DENIED', 'PASSWORD_CHANGE', 'KEY_ROTATION', 'SUSPENSION', 'ACTIVATION');

-- AlterTable
ALTER TABLE "tenant_modules" ADD COLUMN     "disabledAt" TIMESTAMP(3),
ADD COLUMN     "enabledAt" TIMESTAMP(3),
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT DEFAULT 'admin@metanoia.click',
ADD COLUMN     "contactName" TEXT DEFAULT 'Administrador',
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "email" TEXT DEFAULT 'admin@metanoia.click',
ADD COLUMN     "maxServers" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "maxStorageGB" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "maxUsers" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- Update existing tenants with default values
UPDATE "tenants" SET 
  "email" = COALESCE("email", 'admin@metanoia.click'),
  "contactEmail" = COALESCE("contactEmail", 'admin@metanoia.click'),
  "contactName" = COALESCE("contactName", 'Administrador'),
  "subscriptionStartDate" = COALESCE("subscriptionStartDate", CURRENT_TIMESTAMP);

-- Make required fields NOT NULL after setting defaults
ALTER TABLE "tenants" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "tenants" ALTER COLUMN "contactEmail" SET NOT NULL;
ALTER TABLE "tenants" ALTER COLUMN "contactName" SET NOT NULL;
ALTER TABLE "tenants" ALTER COLUMN "subscriptionStartDate" SET NOT NULL;

-- CreateTable
CREATE TABLE "server_clients" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "status" "ServerClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyFee" DECIMAL(65,30),
    "serviceLevel" TEXT,
    "contractStart" TIMESTAMP(3),
    "contractEnd" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT,
    "type" TEXT NOT NULL,
    "status" "ServerStatus" NOT NULL DEFAULT 'ONLINE',
    "ipAddress" TEXT NOT NULL,
    "port" INTEGER,
    "protocol" TEXT,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "datacenter" TEXT,
    "datacenterCode" TEXT,
    "rack" TEXT,
    "rackPosition" TEXT,
    "provider" TEXT,
    "compliance" TEXT[],
    "operatingSystem" TEXT,
    "cpu" TEXT,
    "ram" TEXT,
    "storage" TEXT,
    "bandwidth" TEXT,
    "powerConsumption" TEXT,
    "temperature" TEXT,
    "sslCertificate" BOOLEAN NOT NULL DEFAULT false,
    "backupEnabled" BOOLEAN NOT NULL DEFAULT false,
    "monitoringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT NOT NULL,
    "installationDate" TIMESTAMP(3),
    "lastMaintenance" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "cost" DECIMAL(65,30),
    "costCurrency" TEXT,
    "costPeriod" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "publicIP" TEXT,
    "privateIP" TEXT,
    "gateway" TEXT,
    "subnet" TEXT,
    "dnsServers" TEXT[],
    "connectionType" TEXT,
    "uptime" TEXT,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_alerts" (
    "id" TEXT NOT NULL,
    "type" "ServerAlertType" NOT NULL,
    "severity" "ServerAlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ServerAlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serverId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_metrics" (
    "id" TEXT NOT NULL,
    "metricType" "ServerMetricType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "unit" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "threshold" DECIMAL(65,30),
    "isAlert" BOOLEAN NOT NULL DEFAULT false,
    "serverId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_windows" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL DEFAULT 'SCHEDULED',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'PLANNED',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "estimatedDuration" INTEGER,
    "notificationsSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationChannels" TEXT[],
    "slaImpact" BOOLEAN NOT NULL DEFAULT false,
    "expectedDowntime" INTEGER,
    "rollbackPlan" TEXT,
    "contactPerson" TEXT,
    "emergencyContact" TEXT,
    "createdBy" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "maintenance_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_costs" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "costType" "ServerCostType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "period" "CostPeriod" NOT NULL DEFAULT 'MONTHLY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "provider" TEXT,
    "invoiceNumber" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" TEXT,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_configs" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "publicIP" TEXT,
    "privateIP" TEXT NOT NULL,
    "gateway" TEXT,
    "subnet" TEXT,
    "dnsServers" TEXT[],
    "bandwidth" TEXT,
    "connectionType" "NetworkConnectionType" NOT NULL DEFAULT 'DEDICATED',
    "isp" TEXT,
    "contractNumber" TEXT,
    "contractEndDate" TIMESTAMP(3),
    "vlan" TEXT,
    "routingTable" JSONB,
    "firewallRules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "network_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_thresholds" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "metricType" "ServerMetricType" NOT NULL,
    "warningThreshold" DECIMAL(65,30),
    "criticalThreshold" DECIMAL(65,30),
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnWarning" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnCritical" BOOLEAN NOT NULL DEFAULT true,
    "notificationChannels" TEXT[],
    "cooldownMinutes" INTEGER NOT NULL DEFAULT 15,
    "lastNotification" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "metric_thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "severity" "NotificationSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_health" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "overallStatus" "ServerHealthStatus" NOT NULL DEFAULT 'HEALTHY',
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpuUsage" DECIMAL(65,30),
    "memoryUsage" DECIMAL(65,30),
    "diskUsage" DECIMAL(65,30),
    "networkIn" DECIMAL(65,30),
    "networkOut" DECIMAL(65,30),
    "uptime" INTEGER,
    "responseTime" DECIMAL(65,30),
    "activeAlerts" INTEGER NOT NULL DEFAULT 0,
    "criticalAlerts" INTEGER NOT NULL DEFAULT 0,
    "warningAlerts" INTEGER NOT NULL DEFAULT 0,
    "loadAverage" DECIMAL(65,30),
    "processes" INTEGER,
    "connections" INTEGER,
    "temperature" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "industry" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER NOT NULL DEFAULT 0,
    "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT,
    "assignedTo" TEXT,
    "lastContact" TIMESTAMP(3),
    "nextFollowUp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DECIMAL(65,30) NOT NULL,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'PROSPECTING',
    "probability" INTEGER NOT NULL DEFAULT 10,
    "closeDate" TIMESTAMP(3),
    "leadId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "company" TEXT,
    "industry" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "website" TEXT,
    "type" "ContactType" NOT NULL DEFAULT 'CUSTOMER',
    "source" "ContactSource" NOT NULL DEFAULT 'WEBSITE',
    "lastContact" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "direction" "CommunicationDirection" NOT NULL,
    "status" "CommunicationStatus" NOT NULL DEFAULT 'COMPLETED',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "leadId" TEXT,
    "opportunityId" TEXT,
    "contactId" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DECIMAL(65,30) NOT NULL,
    "status" "DealStatus" NOT NULL DEFAULT 'ACTIVE',
    "closedDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "opportunityId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_user_accesses" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "department" TEXT,
    "jobTitle" TEXT,
    "accessType" "ServerAccessType" NOT NULL DEFAULT 'SSH',
    "accessLevel" "ServerAccessLevel" NOT NULL DEFAULT 'READ_ONLY',
    "status" "ServerUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "sshKey" TEXT,
    "password" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "lastActivity" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serverId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_user_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_access_logs" (
    "id" TEXT NOT NULL,
    "action" "ServerAccessAction" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "failureReason" TEXT,
    "sessionDuration" INTEGER,
    "commandsExecuted" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAccessId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "server_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metric_thresholds_serverId_metricType_tenantId_key" ON "metric_thresholds"("serverId", "metricType", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "server_health_serverId_key" ON "server_health"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "server_health_serverId_tenantId_key" ON "server_health"("serverId", "tenantId");

-- AddForeignKey
ALTER TABLE "server_clients" ADD CONSTRAINT "server_clients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "server_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_alerts" ADD CONSTRAINT "server_alerts_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_alerts" ADD CONSTRAINT "server_alerts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_metrics" ADD CONSTRAINT "server_metrics_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_metrics" ADD CONSTRAINT "server_metrics_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_windows" ADD CONSTRAINT "maintenance_windows_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_windows" ADD CONSTRAINT "maintenance_windows_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_costs" ADD CONSTRAINT "server_costs_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_costs" ADD CONSTRAINT "server_costs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_configs" ADD CONSTRAINT "network_configs_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_configs" ADD CONSTRAINT "network_configs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_thresholds" ADD CONSTRAINT "metric_thresholds_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_thresholds" ADD CONSTRAINT "metric_thresholds_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_health" ADD CONSTRAINT "server_health_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_health" ADD CONSTRAINT "server_health_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_user_accesses" ADD CONSTRAINT "server_user_accesses_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_user_accesses" ADD CONSTRAINT "server_user_accesses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_access_logs" ADD CONSTRAINT "server_access_logs_userAccessId_fkey" FOREIGN KEY ("userAccessId") REFERENCES "server_user_accesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_access_logs" ADD CONSTRAINT "server_access_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
