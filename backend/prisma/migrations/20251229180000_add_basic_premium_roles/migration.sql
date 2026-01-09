-- AlterEnum: Migrate from USER to BASIC/PREMIUM
-- PostgreSQL requires creating a new enum type when changing values

-- Step 1: Remove the default value from the column
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- Step 2: Create the new enum type with desired values
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'BASIC', 'PREMIUM');

-- Step 3: Update the column to use the new enum type
-- Convert USER to BASIC during the type change
ALTER TABLE "users" 
ALTER COLUMN "role" TYPE "UserRole_new" 
USING (
    CASE 
        WHEN "role"::text = 'USER' THEN 'BASIC'::"UserRole_new"
        WHEN "role"::text = 'ADMIN' THEN 'ADMIN'::"UserRole_new"
        ELSE 'BASIC'::"UserRole_new"
    END
);

-- Step 4: Drop the old enum type
DROP TYPE "UserRole";

-- Step 5: Rename the new enum type to the original name
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- Step 6: Set the new default value
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'BASIC'::"UserRole";
