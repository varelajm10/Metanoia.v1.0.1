-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "isDigital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxStock" INTEGER,
ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "weight" DECIMAL(10,3);
