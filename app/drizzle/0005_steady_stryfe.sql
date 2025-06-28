ALTER TABLE "site_settings" ALTER COLUMN "phone" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "telegram" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "company_tagline";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "city_name";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "city_locative";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "hero_title";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "hero_subtitle";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "hero_button_text";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "perfect_choice_title";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "perfect_choice_description";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "contact_form_title";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "contact_form_subtitle";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "contact_form_subtitle_highlight";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "form_name_placeholder";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "form_phone_placeholder";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "form_privacy_text";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "form_submit_button";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_home";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_catalog";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_services";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_contacts";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_blog";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "nav_cooperation";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "footer_privacy_policy";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "footer_user_agreement";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "header_connect_button";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "logo_short";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "logo_full_line1";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "logo_full_line2";