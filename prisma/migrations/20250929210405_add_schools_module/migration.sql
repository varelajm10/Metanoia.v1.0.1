-- CreateEnum
CREATE TYPE "SchoolGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "SchoolStudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'EXPELLED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "SchoolRelationship" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'GRANDPARENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SchoolTeacherStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "SchoolEmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'SUBSTITUTE');

-- CreateEnum
CREATE TYPE "SchoolEnrollmentStatus" AS ENUM ('ENROLLED', 'WITHDRAWN', 'TRANSFERRED', 'GRADUATED', 'EXPELLED');

-- CreateEnum
CREATE TYPE "SchoolGradeType" AS ENUM ('NUMERICAL', 'LETTER', 'PASS_FAIL', 'DESCRIPTIVE');

-- CreateEnum
CREATE TYPE "SchoolAttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'SICK');

-- CreateEnum
CREATE TYPE "SchoolPaymentType" AS ENUM ('ENROLLMENT', 'TUITION', 'TRANSPORT', 'CAFETERIA', 'LIBRARY', 'UNIFORM', 'MATERIALS', 'EXTRACURRICULAR', 'OTHER');

-- CreateEnum
CREATE TYPE "SchoolPaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SchoolIncidentType" AS ENUM ('BEHAVIORAL', 'ACADEMIC', 'ATTENDANCE', 'BULLYING', 'VIOLENCE', 'THEFT', 'OTHER');

-- CreateEnum
CREATE TYPE "SchoolSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SchoolDisciplinaryStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SchoolLibraryBookStatus" AS ENUM ('AVAILABLE', 'CHECKED_OUT', 'RESERVED', 'MAINTENANCE', 'LOST', 'DAMAGED');

-- CreateEnum
CREATE TYPE "SchoolLoanStatus" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE', 'LOST');

-- CreateEnum
CREATE TYPE "SchoolRouteStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SchoolTransportAssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SchoolMealType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACK', 'DINNER');

-- CreateEnum
CREATE TYPE "SchoolCafeteriaPlan" AS ENUM ('FULL', 'PARTIAL', 'NONE');

-- CreateEnum
CREATE TYPE "SchoolCafeteriaAssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SchoolEvaluationType" AS ENUM ('ANNUAL', 'SEMESTER', 'QUARTERLY', 'OBSERVATION', 'PEER_REVIEW');

-- CreateTable
CREATE TABLE "SchoolStudent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "SchoolGender" NOT NULL,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medicalNotes" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zipCode" TEXT,
    "studentCode" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "section" TEXT,
    "enrollmentDate" TIMESTAMP(3) NOT NULL,
    "status" "SchoolStudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolParent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relationship" "SchoolRelationship" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cellPhone" TEXT,
    "workPhone" TEXT,
    "occupation" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "isPrimaryContact" BOOLEAN NOT NULL DEFAULT false,
    "canPickup" BOOLEAN NOT NULL DEFAULT true,
    "emergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolTeacher" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "SchoolGender" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cellPhone" TEXT,
    "teacherCode" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "certifications" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "status" "SchoolTeacherStatus" NOT NULL DEFAULT 'ACTIVE',
    "employmentType" "SchoolEmploymentType" NOT NULL,
    "salary" DECIMAL(65,30),
    "department" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolGradeLevel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolGradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSubject" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "credits" INTEGER,
    "hoursPerWeek" INTEGER,
    "gradeLevelId" TEXT,
    "teacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSchedule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "classroom" TEXT,
    "academicYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolEnrollment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "enrollmentDate" TIMESTAMP(3) NOT NULL,
    "status" "SchoolEnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolGrade" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "gradeValue" DECIMAL(65,30) NOT NULL,
    "maxGradeValue" DECIMAL(65,30) NOT NULL DEFAULT 100,
    "gradeType" "SchoolGradeType" NOT NULL DEFAULT 'NUMERICAL',
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAttendance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "SchoolAttendanceStatus" NOT NULL,
    "arrivalTime" TEXT,
    "departureTime" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolPayment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "paymentType" "SchoolPaymentType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "status" "SchoolPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "concept" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "month" TEXT,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "receiptNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolDisciplinary" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "incidentType" "SchoolIncidentType" NOT NULL,
    "severity" "SchoolSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "status" "SchoolDisciplinaryStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolDisciplinary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolLibraryBook" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "isbn" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT,
    "publishYear" INTEGER,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Español',
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT,
    "status" "SchoolLibraryBookStatus" NOT NULL DEFAULT 'AVAILABLE',
    "coverUrl" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolLibraryBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolLibraryLoan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" "SchoolLoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolLibraryLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolTransportRoute" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "routeCode" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleModel" TEXT,
    "vehicleCapacity" INTEGER NOT NULL,
    "status" "SchoolRouteStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolTransportRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolTransportAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "dropoffTime" TEXT NOT NULL,
    "status" "SchoolTransportAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolTransportAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolCafeteriaMenu" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mealType" "SchoolMealType" NOT NULL,
    "menuName" TEXT NOT NULL,
    "description" TEXT,
    "calories" INTEGER,
    "proteins" DECIMAL(65,30),
    "carbohydrates" DECIMAL(65,30),
    "fats" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolCafeteriaMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolCafeteriaAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "plan" "SchoolCafeteriaPlan" NOT NULL,
    "dietaryRestrictions" TEXT,
    "allergies" TEXT,
    "status" "SchoolCafeteriaAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolCafeteriaAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolEvaluation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL,
    "evaluationType" "SchoolEvaluationType" NOT NULL,
    "evaluator" TEXT NOT NULL,
    "teaching" DECIMAL(65,30) NOT NULL,
    "planning" DECIMAL(65,30) NOT NULL,
    "discipline" DECIMAL(65,30) NOT NULL,
    "communication" DECIMAL(65,30) NOT NULL,
    "overall" DECIMAL(65,30) NOT NULL,
    "comments" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SchoolParentToSchoolStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolStudent_studentCode_key" ON "SchoolStudent"("studentCode");

-- CreateIndex
CREATE INDEX "SchoolStudent_tenantId_idx" ON "SchoolStudent"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolStudent_studentCode_idx" ON "SchoolStudent"("studentCode");

-- CreateIndex
CREATE INDEX "SchoolStudent_status_idx" ON "SchoolStudent"("status");

-- CreateIndex
CREATE INDEX "SchoolParent_tenantId_idx" ON "SchoolParent"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolParent_email_idx" ON "SchoolParent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolTeacher_email_key" ON "SchoolTeacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolTeacher_teacherCode_key" ON "SchoolTeacher"("teacherCode");

-- CreateIndex
CREATE INDEX "SchoolTeacher_tenantId_idx" ON "SchoolTeacher"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolTeacher_teacherCode_idx" ON "SchoolTeacher"("teacherCode");

-- CreateIndex
CREATE INDEX "SchoolTeacher_status_idx" ON "SchoolTeacher"("status");

-- CreateIndex
CREATE INDEX "SchoolGradeLevel_tenantId_idx" ON "SchoolGradeLevel"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolGradeLevel_tenantId_code_key" ON "SchoolGradeLevel"("tenantId", "code");

-- CreateIndex
CREATE INDEX "SchoolSection_tenantId_idx" ON "SchoolSection"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSection_tenantId_code_academicYear_key" ON "SchoolSection"("tenantId", "code", "academicYear");

-- CreateIndex
CREATE INDEX "SchoolSubject_tenantId_idx" ON "SchoolSubject"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSubject_tenantId_code_key" ON "SchoolSubject"("tenantId", "code");

-- CreateIndex
CREATE INDEX "SchoolSchedule_tenantId_idx" ON "SchoolSchedule"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolSchedule_teacherId_idx" ON "SchoolSchedule"("teacherId");

-- CreateIndex
CREATE INDEX "SchoolSchedule_sectionId_idx" ON "SchoolSchedule"("sectionId");

-- CreateIndex
CREATE INDEX "SchoolEnrollment_tenantId_idx" ON "SchoolEnrollment"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolEnrollment_studentId_idx" ON "SchoolEnrollment"("studentId");

-- CreateIndex
CREATE INDEX "SchoolEnrollment_academicYear_idx" ON "SchoolEnrollment"("academicYear");

-- CreateIndex
CREATE INDEX "SchoolGrade_tenantId_idx" ON "SchoolGrade"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolGrade_studentId_idx" ON "SchoolGrade"("studentId");

-- CreateIndex
CREATE INDEX "SchoolGrade_subjectId_idx" ON "SchoolGrade"("subjectId");

-- CreateIndex
CREATE INDEX "SchoolGrade_academicYear_idx" ON "SchoolGrade"("academicYear");

-- CreateIndex
CREATE INDEX "SchoolAttendance_tenantId_idx" ON "SchoolAttendance"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolAttendance_studentId_idx" ON "SchoolAttendance"("studentId");

-- CreateIndex
CREATE INDEX "SchoolAttendance_date_idx" ON "SchoolAttendance"("date");

-- CreateIndex
CREATE INDEX "SchoolPayment_tenantId_idx" ON "SchoolPayment"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolPayment_studentId_idx" ON "SchoolPayment"("studentId");

-- CreateIndex
CREATE INDEX "SchoolPayment_status_idx" ON "SchoolPayment"("status");

-- CreateIndex
CREATE INDEX "SchoolPayment_dueDate_idx" ON "SchoolPayment"("dueDate");

-- CreateIndex
CREATE INDEX "SchoolDisciplinary_tenantId_idx" ON "SchoolDisciplinary"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolDisciplinary_studentId_idx" ON "SchoolDisciplinary"("studentId");

-- CreateIndex
CREATE INDEX "SchoolDisciplinary_incidentDate_idx" ON "SchoolDisciplinary"("incidentDate");

-- CreateIndex
CREATE INDEX "SchoolLibraryBook_tenantId_idx" ON "SchoolLibraryBook"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolLibraryBook_isbn_idx" ON "SchoolLibraryBook"("isbn");

-- CreateIndex
CREATE INDEX "SchoolLibraryBook_category_idx" ON "SchoolLibraryBook"("category");

-- CreateIndex
CREATE INDEX "SchoolLibraryLoan_tenantId_idx" ON "SchoolLibraryLoan"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolLibraryLoan_studentId_idx" ON "SchoolLibraryLoan"("studentId");

-- CreateIndex
CREATE INDEX "SchoolLibraryLoan_bookId_idx" ON "SchoolLibraryLoan"("bookId");

-- CreateIndex
CREATE INDEX "SchoolLibraryLoan_status_idx" ON "SchoolLibraryLoan"("status");

-- CreateIndex
CREATE INDEX "SchoolTransportRoute_tenantId_idx" ON "SchoolTransportRoute"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolTransportRoute_tenantId_routeCode_key" ON "SchoolTransportRoute"("tenantId", "routeCode");

-- CreateIndex
CREATE INDEX "SchoolTransportAssignment_tenantId_idx" ON "SchoolTransportAssignment"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolTransportAssignment_routeId_idx" ON "SchoolTransportAssignment"("routeId");

-- CreateIndex
CREATE INDEX "SchoolTransportAssignment_studentId_idx" ON "SchoolTransportAssignment"("studentId");

-- CreateIndex
CREATE INDEX "SchoolCafeteriaMenu_tenantId_idx" ON "SchoolCafeteriaMenu"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolCafeteriaMenu_date_idx" ON "SchoolCafeteriaMenu"("date");

-- CreateIndex
CREATE INDEX "SchoolCafeteriaAssignment_tenantId_idx" ON "SchoolCafeteriaAssignment"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolCafeteriaAssignment_studentId_idx" ON "SchoolCafeteriaAssignment"("studentId");

-- CreateIndex
CREATE INDEX "SchoolEvaluation_tenantId_idx" ON "SchoolEvaluation"("tenantId");

-- CreateIndex
CREATE INDEX "SchoolEvaluation_teacherId_idx" ON "SchoolEvaluation"("teacherId");

-- CreateIndex
CREATE INDEX "SchoolEvaluation_evaluationDate_idx" ON "SchoolEvaluation"("evaluationDate");

-- CreateIndex
CREATE UNIQUE INDEX "_SchoolParentToSchoolStudent_AB_unique" ON "_SchoolParentToSchoolStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_SchoolParentToSchoolStudent_B_index" ON "_SchoolParentToSchoolStudent"("B");

-- AddForeignKey
ALTER TABLE "SchoolStudent" ADD CONSTRAINT "SchoolStudent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolParent" ADD CONSTRAINT "SchoolParent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTeacher" ADD CONSTRAINT "SchoolTeacher_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolGradeLevel" ADD CONSTRAINT "SchoolGradeLevel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSection" ADD CONSTRAINT "SchoolSection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSection" ADD CONSTRAINT "SchoolSection_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "SchoolGradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "SchoolGradeLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSubject" ADD CONSTRAINT "SchoolSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "SchoolTeacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSchedule" ADD CONSTRAINT "SchoolSchedule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSchedule" ADD CONSTRAINT "SchoolSchedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "SchoolSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSchedule" ADD CONSTRAINT "SchoolSchedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "SchoolTeacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSchedule" ADD CONSTRAINT "SchoolSchedule_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SchoolSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEnrollment" ADD CONSTRAINT "SchoolEnrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEnrollment" ADD CONSTRAINT "SchoolEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEnrollment" ADD CONSTRAINT "SchoolEnrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "SchoolSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolGrade" ADD CONSTRAINT "SchoolGrade_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolGrade" ADD CONSTRAINT "SchoolGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolGrade" ADD CONSTRAINT "SchoolGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "SchoolSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAttendance" ADD CONSTRAINT "SchoolAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPayment" ADD CONSTRAINT "SchoolPayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolPayment" ADD CONSTRAINT "SchoolPayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDisciplinary" ADD CONSTRAINT "SchoolDisciplinary_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDisciplinary" ADD CONSTRAINT "SchoolDisciplinary_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolLibraryBook" ADD CONSTRAINT "SchoolLibraryBook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolLibraryLoan" ADD CONSTRAINT "SchoolLibraryLoan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolLibraryLoan" ADD CONSTRAINT "SchoolLibraryLoan_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "SchoolLibraryBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolLibraryLoan" ADD CONSTRAINT "SchoolLibraryLoan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTransportRoute" ADD CONSTRAINT "SchoolTransportRoute_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTransportAssignment" ADD CONSTRAINT "SchoolTransportAssignment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTransportAssignment" ADD CONSTRAINT "SchoolTransportAssignment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "SchoolTransportRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTransportAssignment" ADD CONSTRAINT "SchoolTransportAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolCafeteriaMenu" ADD CONSTRAINT "SchoolCafeteriaMenu_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolCafeteriaAssignment" ADD CONSTRAINT "SchoolCafeteriaAssignment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolCafeteriaAssignment" ADD CONSTRAINT "SchoolCafeteriaAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEvaluation" ADD CONSTRAINT "SchoolEvaluation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolEvaluation" ADD CONSTRAINT "SchoolEvaluation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "SchoolTeacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolParentToSchoolStudent" ADD CONSTRAINT "_SchoolParentToSchoolStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "SchoolParent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SchoolParentToSchoolStudent" ADD CONSTRAINT "_SchoolParentToSchoolStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "SchoolStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
