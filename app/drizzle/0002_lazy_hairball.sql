CREATE TABLE "app_configuration" (
	"id" serial PRIMARY KEY NOT NULL,
	"tg_contact_id" text
);
--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "photos";