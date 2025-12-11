-- Add soft delete fields to Conversation table
ALTER TABLE "Conversation" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Conversation" ADD COLUMN "deletedBy" TEXT;
