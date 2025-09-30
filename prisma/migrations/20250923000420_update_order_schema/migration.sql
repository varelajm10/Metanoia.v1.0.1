/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'REFUNDED');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';

-- AlterTable
ALTER TABLE "order_items" 
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing data
UPDATE "order_items" SET "unitPrice" = "price", "total" = "subtotal";

-- Drop old columns
ALTER TABLE "order_items" DROP COLUMN "price", DROP COLUMN "subtotal";

-- AlterTable
ALTER TABLE "orders" 
ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT DEFAULT 'CASH',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 16;

-- Update existing data
UPDATE "orders" SET "taxAmount" = "tax", "taxRate" = 16;

-- Drop old column
ALTER TABLE "orders" DROP COLUMN "tax";
