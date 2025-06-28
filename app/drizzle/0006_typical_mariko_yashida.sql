CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
