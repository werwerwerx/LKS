CREATE TABLE "model_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer,
	"photo_url" text
);
--> statement-breakpoint
DROP TABLE "bookings" CASCADE;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "photos" text;--> statement-breakpoint
ALTER TABLE "model_photos" ADD CONSTRAINT "model_photos_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "height";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "experience";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "specialization";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "portfolio_url";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "models" DROP COLUMN "city";