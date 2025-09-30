-- CreateEnum
CREATE TYPE "ElevatorClientType" AS ENUM ('INDIVIDUAL', 'COMPANY', 'PROPERTY_MANAGER', 'CONSTRUCTOR', 'ARCHITECT', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "ElevatorClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ElevatorStatus" AS ENUM ('OPERATIONAL', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE', 'UNDER_INSPECTION', 'DECOMMISSIONED', 'EMERGENCY_STOP');

-- CreateEnum
CREATE TYPE "InstallationStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'TESTING', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenanceContractType" AS ENUM ('PREVENTIVE', 'FULL_SERVICE', 'EMERGENCY_ONLY', 'INSPECTION_ONLY');

-- CreateEnum
CREATE TYPE "MaintenanceContractStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED', 'PENDING_RENEWAL');

-- CreateEnum
CREATE TYPE "ElevatorMaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY', 'INSPECTION', 'MODERNIZATION');

-- CreateEnum
CREATE TYPE "ElevatorMaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PENDING_PARTS');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('PERIODIC', 'ANNUAL', 'POST_INSTALLATION', 'POST_MODERNIZATION', 'SPECIAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InspectionResult" AS ENUM ('PASSED', 'FAILED', 'CONDITIONAL', 'PENDING_CORRECTIONS');

-- CreateEnum
CREATE TYPE "TechnicianLevel" AS ENUM ('APPRENTICE', 'JUNIOR', 'INTERMEDIATE', 'SENIOR', 'MASTER', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "TechnicianStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TRAINING');

-- CreateEnum
CREATE TYPE "WorkOrderType" AS ENUM ('MAINTENANCE', 'REPAIR', 'INSTALLATION', 'INSPECTION', 'MODERNIZATION', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "WorkOrderPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'CLOSED');

-- CreateTable
CREATE TABLE "elevator_clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'México',
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "clientType" "ElevatorClientType" NOT NULL DEFAULT 'INDIVIDUAL',
    "industry" TEXT,
    "annualRevenue" DECIMAL(65,30),
    "status" "ElevatorClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "elevator_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elevators" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL,
    "speed" DECIMAL(65,30) NOT NULL,
    "motorType" TEXT,
    "controlSystem" TEXT,
    "doorType" TEXT,
    "carDimensions" TEXT,
    "shaftDimensions" TEXT,
    "machineLocation" TEXT,
    "driveType" TEXT,
    "buildingName" TEXT NOT NULL,
    "buildingAddress" TEXT NOT NULL,
    "buildingType" TEXT,
    "floorLocation" TEXT,
    "shaftNumber" TEXT,
    "status" "ElevatorStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "installationDate" TIMESTAMP(3),
    "commissioningDate" TIMESTAMP(3),
    "lastInspection" TIMESTAMP(3),
    "nextInspection" TIMESTAMP(3),
    "maintenanceFrequency" TEXT,
    "warrantyExpiry" TIMESTAMP(3),
    "manufacturingYear" INTEGER,
    "certificationNumber" TEXT,
    "certificationExpiry" TIMESTAMP(3),
    "regulatoryBody" TEXT,
    "notes" TEXT,
    "specifications" JSONB,
    "documents" JSONB,
    "photos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "elevators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installations" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualEndDate" TIMESTAMP(3),
    "status" "InstallationStatus" NOT NULL DEFAULT 'PLANNED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "projectManager" TEXT,
    "teamMembers" TEXT[],
    "budget" DECIMAL(65,30),
    "actualCost" DECIMAL(65,30),
    "siteAddress" TEXT NOT NULL,
    "siteContact" TEXT,
    "sitePhone" TEXT,
    "elevatorType" TEXT NOT NULL,
    "numberOfElevators" INTEGER NOT NULL,
    "milestones" JSONB,
    "permits" JSONB,
    "notes" TEXT,
    "documents" JSONB,
    "photos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "elevatorId" TEXT,

    CONSTRAINT "installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_contracts" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "contractName" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "contractType" "MaintenanceContractType" NOT NULL DEFAULT 'PREVENTIVE',
    "frequency" TEXT NOT NULL,
    "visitsPerYear" INTEGER NOT NULL,
    "monthlyFee" DECIMAL(65,30),
    "annualFee" DECIMAL(65,30),
    "emergencyRate" DECIMAL(65,30),
    "sparesIncluded" BOOLEAN NOT NULL DEFAULT false,
    "serviceScope" JSONB,
    "responseTime" TEXT,
    "coverage" TEXT,
    "status" "MaintenanceContractStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "terms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "maintenance_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL,
    "recordNumber" TEXT NOT NULL,
    "maintenanceType" "ElevatorMaintenanceType" NOT NULL DEFAULT 'PREVENTIVE',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "description" TEXT,
    "findings" TEXT,
    "workPerformed" TEXT,
    "status" "ElevatorMaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'NORMAL',
    "technicianIds" TEXT[],
    "hoursWorked" DECIMAL(65,30),
    "sparePartsUsed" JSONB,
    "totalCost" DECIMAL(65,30),
    "checklist" JSONB,
    "testResults" JSONB,
    "photos" JSONB,
    "signature" TEXT,
    "clientFeedback" TEXT,
    "notes" TEXT,
    "nextAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "elevatorId" TEXT NOT NULL,
    "contractId" TEXT,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL,
    "inspectionNumber" TEXT NOT NULL,
    "inspectionType" "InspectionType" NOT NULL DEFAULT 'PERIODIC',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "inspectionDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "inspector" TEXT NOT NULL,
    "inspectorLicense" TEXT,
    "regulatoryBody" TEXT,
    "status" "InspectionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "result" "InspectionResult",
    "score" INTEGER,
    "findings" TEXT,
    "defects" JSONB,
    "recommendations" TEXT,
    "correctiveActions" TEXT,
    "certificateNumber" TEXT,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "certificateUrl" TEXT,
    "checklist" JSONB,
    "photos" JSONB,
    "documents" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "elevatorId" TEXT NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elevator_technicians" (
    "id" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialization" TEXT[],
    "certifications" JSONB,
    "experience" INTEGER,
    "skillLevel" "TechnicianLevel" NOT NULL DEFAULT 'JUNIOR',
    "status" "TechnicianStatus" NOT NULL DEFAULT 'ACTIVE',
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "photo" TEXT,
    "documents" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "elevator_technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elevator_spare_parts" (
    "id" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT,
    "supplier" TEXT,
    "compatibleBrands" TEXT[],
    "compatibleModels" TEXT[],
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 5,
    "maxStock" INTEGER,
    "location" TEXT,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30),
    "dimensions" TEXT,
    "warranty" TEXT,
    "notes" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "elevator_spare_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "workOrderNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderType" "WorkOrderType" NOT NULL DEFAULT 'MAINTENANCE',
    "priority" "WorkOrderPriority" NOT NULL DEFAULT 'NORMAL',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT[],
    "estimatedHours" DECIMAL(65,30),
    "actualHours" DECIMAL(65,30),
    "estimatedCost" DECIMAL(65,30),
    "actualCost" DECIMAL(65,30),
    "workPerformed" TEXT,
    "findings" TEXT,
    "resolution" TEXT,
    "materials" JSONB,
    "photos" JSONB,
    "documents" JSONB,
    "signature" TEXT,
    "clientFeedback" TEXT,
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "elevatorId" TEXT,
    "installationId" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "elevators_serialNumber_key" ON "elevators"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "installations_projectNumber_key" ON "installations"("projectNumber");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_contracts_contractNumber_key" ON "maintenance_contracts"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_records_recordNumber_key" ON "maintenance_records"("recordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "inspections_inspectionNumber_key" ON "inspections"("inspectionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "elevator_technicians_employeeNumber_key" ON "elevator_technicians"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "elevator_technicians_email_key" ON "elevator_technicians"("email");

-- CreateIndex
CREATE UNIQUE INDEX "elevator_spare_parts_partNumber_key" ON "elevator_spare_parts"("partNumber");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_workOrderNumber_key" ON "work_orders"("workOrderNumber");

-- AddForeignKey
ALTER TABLE "elevator_clients" ADD CONSTRAINT "elevator_clients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elevators" ADD CONSTRAINT "elevators_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elevators" ADD CONSTRAINT "elevators_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "elevator_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installations" ADD CONSTRAINT "installations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installations" ADD CONSTRAINT "installations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "elevator_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installations" ADD CONSTRAINT "installations_elevatorId_fkey" FOREIGN KEY ("elevatorId") REFERENCES "elevators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_contracts" ADD CONSTRAINT "maintenance_contracts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_contracts" ADD CONSTRAINT "maintenance_contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "elevator_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_elevatorId_fkey" FOREIGN KEY ("elevatorId") REFERENCES "elevators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "maintenance_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_elevatorId_fkey" FOREIGN KEY ("elevatorId") REFERENCES "elevators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elevator_technicians" ADD CONSTRAINT "elevator_technicians_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elevator_spare_parts" ADD CONSTRAINT "elevator_spare_parts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_elevatorId_fkey" FOREIGN KEY ("elevatorId") REFERENCES "elevators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "installations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
