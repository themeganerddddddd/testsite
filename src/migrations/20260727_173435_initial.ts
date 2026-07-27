import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('owner', 'editor', 'reviewer', 'source_manager', 'newsletter_editor');
  CREATE TYPE "public"."enum_articles_verification_indicators" AS ENUM('identity-verified', 'employment-verified', 'role-verified', 'direct-knowledge-verified', 'supporting-records-reviewed', 'corroborated');
  CREATE TYPE "public"."enum_articles_correction_records_type" AS ENUM('correction', 'clarification', 'update');
  CREATE TYPE "public"."enum_articles_format" AS ENUM('inside-work', 'expert-analysis', 'reported-essay', 'explainer', 'response', 'editorial');
  CREATE TYPE "public"."enum_articles_authorship_type" AS ENUM('named', 'verified-anonymous');
  CREATE TYPE "public"."enum_articles_employer_response_status" AS ENUM('not-requested', 'requested', 'received', 'declined', 'no-response');
  CREATE TYPE "public"."enum_articles_editorial_stage" AS ENUM('pitch', 'under-review', 'accepted', 'editing', 'verification', 'employer-response-requested', 'final-review', 'scheduled', 'published', 'updated', 'rejected', 'withdrawn');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_verification_indicators" AS ENUM('identity-verified', 'employment-verified', 'role-verified', 'direct-knowledge-verified', 'supporting-records-reviewed', 'corroborated');
  CREATE TYPE "public"."enum__articles_v_version_correction_records_type" AS ENUM('correction', 'clarification', 'update');
  CREATE TYPE "public"."enum__articles_v_version_format" AS ENUM('inside-work', 'expert-analysis', 'reported-essay', 'explainer', 'response', 'editorial');
  CREATE TYPE "public"."enum__articles_v_version_authorship_type" AS ENUM('named', 'verified-anonymous');
  CREATE TYPE "public"."enum__articles_v_version_employer_response_status" AS ENUM('not-requested', 'requested', 'received', 'declined', 'no-response');
  CREATE TYPE "public"."enum__articles_v_version_editorial_stage" AS ENUM('pitch', 'under-review', 'accepted', 'editing', 'verification', 'employer-response-requested', 'final-review', 'scheduled', 'published', 'updated', 'rejected', 'withdrawn');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('standard', 'policy', 'topic-landing', 'submission', 'contact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('standard', 'policy', 'topic-landing', 'submission', 'contact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_public_bylines_authorship_type" AS ENUM('named', 'verified-anonymous');
  CREATE TYPE "public"."enum_submissions_submission_type" AS ENUM('pitch', 'draft', 'confidential-info', 'response');
  CREATE TYPE "public"."enum_submissions_contact_preference" AS ENUM('email', 'phone', 'secure-follow-up');
  CREATE TYPE "public"."enum_submissions_current_or_former_employee" AS ENUM('current', 'former', 'contractor', 'other-direct-role', 'not-applicable');
  CREATE TYPE "public"."enum_submissions_evidence_availability" AS ENUM('none', 'describe', 'may-share-later');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'screening', 'follow-up-requested', 'under-review', 'accepted', 'declined', 'converted-to-article', 'closed');
  CREATE TYPE "public"."enum_protected_sources_employment_status" AS ENUM('current', 'former', 'contractor', 'other');
  CREATE TYPE "public"."enum_protected_source_files_category" AS ENUM('identity-documentation', 'employment-verification', 'supporting-material', 'interview-notes', 'other');
  CREATE TYPE "public"."enum_newsletter_subscriptions_status" AS ENUM('active', 'unsubscribed', 'bounced');
  CREATE TYPE "public"."enum_corrections_correction_type" AS ENUM('correction', 'clarification', 'update');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_homepage_lead_mode" AS ENUM('automatic', 'curated');
  CREATE TYPE "public"."enum__homepage_v_version_lead_mode" AS ENUM('automatic', 'curated');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_users_roles",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"last_login" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "articles_verification_indicators" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_articles_verification_indicators",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "articles_correction_records" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"type" "enum_articles_correction_records_type" DEFAULT 'correction',
  	"text" varchar,
  	"material_change" boolean DEFAULT false
  );
  
  CREATE TABLE "articles" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"internal_title" varchar,
  	"public_headline" varchar,
  	"slug" varchar,
  	"subtitle" varchar,
  	"format" "enum_articles_format" DEFAULT 'reported-essay',
  	"primary_topic_id" uuid,
  	"public_byline_id" uuid,
  	"authorship_type" "enum_articles_authorship_type" DEFAULT 'named',
  	"body" jsonb,
  	"hero_image_id" uuid,
  	"hero_image_caption" varchar,
  	"hero_image_credit" varchar,
  	"social_image_id" uuid,
  	"verification_statement" varchar,
  	"evidence_note" varchar,
  	"employer_response_status" "enum_articles_employer_response_status" DEFAULT 'not-requested',
  	"employer_response_content" varchar,
  	"employer_response_date" timestamp(3) with time zone,
  	"essential_reading_eligible" boolean DEFAULT false,
  	"inside_work_eligible" boolean DEFAULT false,
  	"publication_date" timestamp(3) with time zone,
  	"scheduled_publication_date" timestamp(3) with time zone,
  	"updated_date" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"editorial_stage" "enum_articles_editorial_stage" DEFAULT 'pitch',
  	"assigned_editor_id" uuid,
  	"internal_editorial_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" uuid,
  	"tags_id" uuid,
  	"articles_id" uuid,
  	"corrections_id" uuid
  );
  
  CREATE TABLE "_articles_v_version_verification_indicators" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum__articles_v_version_verification_indicators",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "_articles_v_version_correction_records" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"date" timestamp(3) with time zone,
  	"type" "enum__articles_v_version_correction_records_type" DEFAULT 'correction',
  	"text" varchar,
  	"material_change" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_internal_title" varchar,
  	"version_public_headline" varchar,
  	"version_slug" varchar,
  	"version_subtitle" varchar,
  	"version_format" "enum__articles_v_version_format" DEFAULT 'reported-essay',
  	"version_primary_topic_id" uuid,
  	"version_public_byline_id" uuid,
  	"version_authorship_type" "enum__articles_v_version_authorship_type" DEFAULT 'named',
  	"version_body" jsonb,
  	"version_hero_image_id" uuid,
  	"version_hero_image_caption" varchar,
  	"version_hero_image_credit" varchar,
  	"version_social_image_id" uuid,
  	"version_verification_statement" varchar,
  	"version_evidence_note" varchar,
  	"version_employer_response_status" "enum__articles_v_version_employer_response_status" DEFAULT 'not-requested',
  	"version_employer_response_content" varchar,
  	"version_employer_response_date" timestamp(3) with time zone,
  	"version_essential_reading_eligible" boolean DEFAULT false,
  	"version_inside_work_eligible" boolean DEFAULT false,
  	"version_publication_date" timestamp(3) with time zone,
  	"version_scheduled_publication_date" timestamp(3) with time zone,
  	"version_updated_date" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_editorial_stage" "enum__articles_v_version_editorial_stage" DEFAULT 'pitch',
  	"version_assigned_editor_id" uuid,
  	"version_internal_editorial_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" uuid,
  	"tags_id" uuid,
  	"articles_id" uuid,
  	"corrections_id" uuid
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"template" "enum_pages_template" DEFAULT 'standard',
  	"intro" varchar,
  	"content_blocks" jsonb,
  	"hero_kicker" varchar,
  	"hero_image_id" uuid,
  	"hero_caption" varchar,
  	"show_in_navigation" boolean DEFAULT false,
  	"scheduled_publication_date" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_template" "enum__pages_v_version_template" DEFAULT 'standard',
  	"version_intro" varchar,
  	"version_content_blocks" jsonb,
  	"version_hero_kicker" varchar,
  	"version_hero_image_id" uuid,
  	"version_hero_caption" varchar,
  	"version_show_in_navigation" boolean DEFAULT false,
  	"version_scheduled_publication_date" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "topics" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"long_introduction" jsonb,
  	"image_id" uuid,
  	"show_in_navigation" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 100 NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "public_bylines" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"display_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"authorship_type" "enum_public_bylines_authorship_type" DEFAULT 'named' NOT NULL,
  	"short_biography" varchar,
  	"long_biography" jsonb,
  	"portrait_id" uuid,
  	"organization" varchar,
  	"relevant_expertise" varchar,
  	"verification_wording" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "public_bylines_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" uuid
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt_text" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"copyright_or_license" varchar,
  	"prefix" varchar DEFAULT 'public',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_article_url" varchar,
  	"sizes_article_width" numeric,
  	"sizes_article_height" numeric,
  	"sizes_article_mime_type" varchar,
  	"sizes_article_filesize" numeric,
  	"sizes_article_filename" varchar,
  	"sizes_social_url" varchar,
  	"sizes_social_width" numeric,
  	"sizes_social_height" numeric,
  	"sizes_social_mime_type" varchar,
  	"sizes_social_filesize" numeric,
  	"sizes_social_filename" varchar
  );
  
  CREATE TABLE "submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"reference_number" varchar NOT NULL,
  	"submission_type" "enum_submissions_submission_type" NOT NULL,
  	"contributor_name" varchar,
  	"personal_email" varchar NOT NULL,
  	"contact_preference" "enum_submissions_contact_preference" DEFAULT 'email',
  	"current_or_former_employee" "enum_submissions_current_or_former_employee" NOT NULL,
  	"organization" varchar,
  	"general_role" varchar NOT NULL,
  	"proposed_headline" varchar,
  	"what_readers_should_understand" varchar NOT NULL,
  	"personally_observed" varchar NOT NULL,
  	"public_interest_explanation" varchar NOT NULL,
  	"anonymity_reason" varchar,
  	"evidence_availability" "enum_submissions_evidence_availability" NOT NULL,
  	"named_individuals_implicated" boolean DEFAULT false,
  	"active_dispute_or_litigation" boolean DEFAULT false,
  	"complete_draft" varchar,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"assigned_editor_id" uuid,
  	"internal_notes" varchar,
  	"submission_date" timestamp(3) with time zone NOT NULL,
  	"consents_privacy_acknowledged" boolean DEFAULT false NOT NULL,
  	"consents_not_work_device_acknowledged" boolean DEFAULT false NOT NULL,
  	"consents_no_personal_data_acknowledged" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "protected_sources" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"source_code" varchar NOT NULL,
  	"legal_name" varchar NOT NULL,
  	"preferred_name" varchar,
  	"personal_email" varchar NOT NULL,
  	"personal_telephone" varchar,
  	"employer" varchar NOT NULL,
  	"exact_position" varchar NOT NULL,
  	"employment_status" "enum_protected_sources_employment_status" NOT NULL,
  	"identity_verification_method" varchar,
  	"employment_verification_method" varchar,
  	"risk_notes" varchar,
  	"anonymity_request_reasoning" varchar,
  	"potential_conflicts" varchar,
  	"assigned_source_manager_id" uuid NOT NULL,
  	"retention_or_deletion_date" timestamp(3) with time zone,
  	"consent_records" varchar,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "protected_sources_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" uuid
  );
  
  CREATE TABLE "protected_source_files" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"source_id" uuid NOT NULL,
  	"category" "enum_protected_source_files_category" NOT NULL,
  	"original_filename" varchar,
  	"access_notes" varchar,
  	"prefix" varchar DEFAULT 'protected',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "newsletter_subscriptions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_newsletter_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"consent_timestamp" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"unsubscribed_date" timestamp(3) with time zone,
  	"verification_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "corrections" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"article_id" uuid NOT NULL,
  	"public_correction_text" varchar NOT NULL,
  	"correction_type" "enum_corrections_correction_type" DEFAULT 'correction' NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"editor_id" uuid NOT NULL,
  	"material_change" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"articles_id" uuid,
  	"pages_id" uuid,
  	"topics_id" uuid,
  	"tags_id" uuid,
  	"public_bylines_id" uuid,
  	"media_id" uuid,
  	"submissions_id" uuid,
  	"protected_sources_id" uuid,
  	"protected_source_files_id" uuid,
  	"newsletter_subscriptions_id" uuid,
  	"corrections_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"lead_mode" "enum_homepage_lead_mode" DEFAULT 'automatic' NOT NULL,
  	"curated_lead_article_id" uuid,
  	"introductory_copy" varchar DEFAULT 'Verified perspectives from inside the institutions that shape public life.',
  	"newsletter_copy_heading" varchar DEFAULT 'Read the view from inside.',
  	"newsletter_copy_description" varchar DEFAULT 'Receive each new article and an occasional note from the editors.',
  	"announcement_visible" boolean DEFAULT false,
  	"announcement_text" varchar,
  	"announcement_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" uuid,
  	"topics_id" uuid
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_lead_mode" "enum__homepage_v_version_lead_mode" DEFAULT 'automatic' NOT NULL,
  	"version_curated_lead_article_id" uuid,
  	"version_introductory_copy" varchar DEFAULT 'Verified perspectives from inside the institutions that shape public life.',
  	"version_newsletter_copy_heading" varchar DEFAULT 'Read the view from inside.',
  	"version_newsletter_copy_description" varchar DEFAULT 'Receive each new article and an occasional note from the editors.',
  	"version_announcement_visible" boolean DEFAULT false,
  	"version_announcement_text" varchar,
  	"version_announcement_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" uuid,
  	"topics_id" uuid
  );
  
  CREATE TABLE "site_settings_social_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"publication_name" varchar DEFAULT 'PUBLIUS' NOT NULL,
  	"tagline" varchar DEFAULT 'The view from inside.' NOT NULL,
  	"description" varchar DEFAULT 'Verified perspectives from inside the institutions that shape public life.' NOT NULL,
  	"contact_email" varchar DEFAULT 'editors@publius.local' NOT NULL,
  	"logo_settings_wordmark_text" varchar DEFAULT 'PUBLIUS',
  	"logo_settings_logo_id" uuid,
  	"default_social_image_id" uuid,
  	"default_s_e_o_title" varchar DEFAULT 'PUBLIUS',
  	"default_s_e_o_description" varchar DEFAULT 'Verified perspectives from inside the institutions that shape public life.',
  	"footer_copy" varchar DEFAULT 'Publius publishes verified perspectives from people who understand institutions firsthand.',
  	"newsletter_settings_enabled" boolean DEFAULT true,
  	"newsletter_settings_consent_text" varchar,
  	"copyright_notice" varchar DEFAULT 'Copyright (c) 2026 Publius.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_primary_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_footer_navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"order" numeric DEFAULT 100 NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group_label" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_verification_indicators" ADD CONSTRAINT "articles_verification_indicators_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_correction_records" ADD CONSTRAINT "articles_correction_records_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_primary_topic_id_topics_id_fk" FOREIGN KEY ("primary_topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_public_byline_id_public_bylines_id_fk" FOREIGN KEY ("public_byline_id") REFERENCES "public"."public_bylines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_assigned_editor_id_users_id_fk" FOREIGN KEY ("assigned_editor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_corrections_fk" FOREIGN KEY ("corrections_id") REFERENCES "public"."corrections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_verification_indicators" ADD CONSTRAINT "_articles_v_version_verification_indicators_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_correction_records" ADD CONSTRAINT "_articles_v_version_correction_records_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_primary_topic_id_topics_id_fk" FOREIGN KEY ("version_primary_topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_public_byline_id_public_bylines_id_fk" FOREIGN KEY ("version_public_byline_id") REFERENCES "public"."public_bylines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_social_image_id_media_id_fk" FOREIGN KEY ("version_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_assigned_editor_id_users_id_fk" FOREIGN KEY ("version_assigned_editor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_corrections_fk" FOREIGN KEY ("corrections_id") REFERENCES "public"."corrections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "topics" ADD CONSTRAINT "topics_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "public_bylines" ADD CONSTRAINT "public_bylines_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "public_bylines_rels" ADD CONSTRAINT "public_bylines_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."public_bylines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "public_bylines_rels" ADD CONSTRAINT "public_bylines_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assigned_editor_id_users_id_fk" FOREIGN KEY ("assigned_editor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "protected_sources" ADD CONSTRAINT "protected_sources_assigned_source_manager_id_users_id_fk" FOREIGN KEY ("assigned_source_manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "protected_sources_rels" ADD CONSTRAINT "protected_sources_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."protected_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "protected_sources_rels" ADD CONSTRAINT "protected_sources_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "protected_source_files" ADD CONSTRAINT "protected_source_files_source_id_protected_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."protected_sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corrections" ADD CONSTRAINT "corrections_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corrections" ADD CONSTRAINT "corrections_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_public_bylines_fk" FOREIGN KEY ("public_bylines_id") REFERENCES "public"."public_bylines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_protected_sources_fk" FOREIGN KEY ("protected_sources_id") REFERENCES "public"."protected_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_protected_source_files_fk" FOREIGN KEY ("protected_source_files_id") REFERENCES "public"."protected_source_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscriptions_fk" FOREIGN KEY ("newsletter_subscriptions_id") REFERENCES "public"."newsletter_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corrections_fk" FOREIGN KEY ("corrections_id") REFERENCES "public"."corrections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_curated_lead_article_id_articles_id_fk" FOREIGN KEY ("curated_lead_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_curated_lead_article_id_articles_id_fk" FOREIGN KEY ("version_curated_lead_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_accounts" ADD CONSTRAINT "site_settings_social_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_settings_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_social_image_id_media_id_fk" FOREIGN KEY ("default_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_primary_navigation" ADD CONSTRAINT "navigation_primary_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_navigation_links" ADD CONSTRAINT "navigation_footer_navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_navigation" ADD CONSTRAINT "navigation_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "articles_verification_indicators_order_idx" ON "articles_verification_indicators" USING btree ("order");
  CREATE INDEX "articles_verification_indicators_parent_idx" ON "articles_verification_indicators" USING btree ("parent_id");
  CREATE INDEX "articles_correction_records_order_idx" ON "articles_correction_records" USING btree ("_order");
  CREATE INDEX "articles_correction_records_parent_id_idx" ON "articles_correction_records" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_primary_topic_idx" ON "articles" USING btree ("primary_topic_id");
  CREATE INDEX "articles_public_byline_idx" ON "articles" USING btree ("public_byline_id");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_social_image_idx" ON "articles" USING btree ("social_image_id");
  CREATE INDEX "articles_assigned_editor_idx" ON "articles" USING btree ("assigned_editor_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_topics_id_idx" ON "articles_rels" USING btree ("topics_id");
  CREATE INDEX "articles_rels_tags_id_idx" ON "articles_rels" USING btree ("tags_id");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE INDEX "articles_rels_corrections_id_idx" ON "articles_rels" USING btree ("corrections_id");
  CREATE INDEX "_articles_v_version_verification_indicators_order_idx" ON "_articles_v_version_verification_indicators" USING btree ("order");
  CREATE INDEX "_articles_v_version_verification_indicators_parent_idx" ON "_articles_v_version_verification_indicators" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_correction_records_order_idx" ON "_articles_v_version_correction_records" USING btree ("_order");
  CREATE INDEX "_articles_v_version_correction_records_parent_id_idx" ON "_articles_v_version_correction_records" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_primary_topic_idx" ON "_articles_v" USING btree ("version_primary_topic_id");
  CREATE INDEX "_articles_v_version_version_public_byline_idx" ON "_articles_v" USING btree ("version_public_byline_id");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_version_social_image_idx" ON "_articles_v" USING btree ("version_social_image_id");
  CREATE INDEX "_articles_v_version_version_assigned_editor_idx" ON "_articles_v" USING btree ("version_assigned_editor_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_topics_id_idx" ON "_articles_v_rels" USING btree ("topics_id");
  CREATE INDEX "_articles_v_rels_tags_id_idx" ON "_articles_v_rels" USING btree ("tags_id");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
  CREATE INDEX "_articles_v_rels_corrections_id_idx" ON "_articles_v_rels" USING btree ("corrections_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");
  CREATE INDEX "topics_image_idx" ON "topics" USING btree ("image_id");
  CREATE INDEX "topics_updated_at_idx" ON "topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "topics" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "public_bylines_slug_idx" ON "public_bylines" USING btree ("slug");
  CREATE INDEX "public_bylines_portrait_idx" ON "public_bylines" USING btree ("portrait_id");
  CREATE INDEX "public_bylines_updated_at_idx" ON "public_bylines" USING btree ("updated_at");
  CREATE INDEX "public_bylines_created_at_idx" ON "public_bylines" USING btree ("created_at");
  CREATE INDEX "public_bylines_rels_order_idx" ON "public_bylines_rels" USING btree ("order");
  CREATE INDEX "public_bylines_rels_parent_idx" ON "public_bylines_rels" USING btree ("parent_id");
  CREATE INDEX "public_bylines_rels_path_idx" ON "public_bylines_rels" USING btree ("path");
  CREATE INDEX "public_bylines_rels_articles_id_idx" ON "public_bylines_rels" USING btree ("articles_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_article_sizes_article_filename_idx" ON "media" USING btree ("sizes_article_filename");
  CREATE INDEX "media_sizes_social_sizes_social_filename_idx" ON "media" USING btree ("sizes_social_filename");
  CREATE UNIQUE INDEX "submissions_reference_number_idx" ON "submissions" USING btree ("reference_number");
  CREATE INDEX "submissions_assigned_editor_idx" ON "submissions" USING btree ("assigned_editor_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "protected_sources_source_code_idx" ON "protected_sources" USING btree ("source_code");
  CREATE INDEX "protected_sources_assigned_source_manager_idx" ON "protected_sources" USING btree ("assigned_source_manager_id");
  CREATE INDEX "protected_sources_updated_at_idx" ON "protected_sources" USING btree ("updated_at");
  CREATE INDEX "protected_sources_created_at_idx" ON "protected_sources" USING btree ("created_at");
  CREATE INDEX "protected_sources_rels_order_idx" ON "protected_sources_rels" USING btree ("order");
  CREATE INDEX "protected_sources_rels_parent_idx" ON "protected_sources_rels" USING btree ("parent_id");
  CREATE INDEX "protected_sources_rels_path_idx" ON "protected_sources_rels" USING btree ("path");
  CREATE INDEX "protected_sources_rels_articles_id_idx" ON "protected_sources_rels" USING btree ("articles_id");
  CREATE INDEX "protected_source_files_source_idx" ON "protected_source_files" USING btree ("source_id");
  CREATE INDEX "protected_source_files_updated_at_idx" ON "protected_source_files" USING btree ("updated_at");
  CREATE INDEX "protected_source_files_created_at_idx" ON "protected_source_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "protected_source_files_filename_idx" ON "protected_source_files" USING btree ("filename");
  CREATE UNIQUE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions" USING btree ("email");
  CREATE INDEX "newsletter_subscriptions_updated_at_idx" ON "newsletter_subscriptions" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscriptions_created_at_idx" ON "newsletter_subscriptions" USING btree ("created_at");
  CREATE INDEX "corrections_article_idx" ON "corrections" USING btree ("article_id");
  CREATE INDEX "corrections_editor_idx" ON "corrections" USING btree ("editor_id");
  CREATE INDEX "corrections_updated_at_idx" ON "corrections" USING btree ("updated_at");
  CREATE INDEX "corrections_created_at_idx" ON "corrections" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_public_bylines_id_idx" ON "payload_locked_documents_rels" USING btree ("public_bylines_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_protected_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("protected_sources_id");
  CREATE INDEX "payload_locked_documents_rels_protected_source_files_id_idx" ON "payload_locked_documents_rels" USING btree ("protected_source_files_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscriptions_i_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_corrections_id_idx" ON "payload_locked_documents_rels" USING btree ("corrections_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_curated_lead_article_idx" ON "homepage" USING btree ("curated_lead_article_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_articles_id_idx" ON "homepage_rels" USING btree ("articles_id");
  CREATE INDEX "homepage_rels_topics_id_idx" ON "homepage_rels" USING btree ("topics_id");
  CREATE INDEX "_homepage_v_version_version_curated_lead_article_idx" ON "_homepage_v" USING btree ("version_curated_lead_article_id");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_articles_id_idx" ON "_homepage_v_rels" USING btree ("articles_id");
  CREATE INDEX "_homepage_v_rels_topics_id_idx" ON "_homepage_v_rels" USING btree ("topics_id");
  CREATE INDEX "site_settings_social_accounts_order_idx" ON "site_settings_social_accounts" USING btree ("_order");
  CREATE INDEX "site_settings_social_accounts_parent_id_idx" ON "site_settings_social_accounts" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_settings_logo_settings_logo_idx" ON "site_settings" USING btree ("logo_settings_logo_id");
  CREATE INDEX "site_settings_default_social_image_idx" ON "site_settings" USING btree ("default_social_image_id");
  CREATE INDEX "navigation_primary_navigation_order_idx" ON "navigation_primary_navigation" USING btree ("_order");
  CREATE INDEX "navigation_primary_navigation_parent_id_idx" ON "navigation_primary_navigation" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_navigation_links_order_idx" ON "navigation_footer_navigation_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_navigation_links_parent_id_idx" ON "navigation_footer_navigation_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_navigation_order_idx" ON "navigation_footer_navigation" USING btree ("_order");
  CREATE INDEX "navigation_footer_navigation_parent_id_idx" ON "navigation_footer_navigation" USING btree ("_parent_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "articles_verification_indicators" CASCADE;
  DROP TABLE "articles_correction_records" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_verification_indicators" CASCADE;
  DROP TABLE "_articles_v_version_correction_records" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "topics" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "public_bylines" CASCADE;
  DROP TABLE "public_bylines_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "protected_sources" CASCADE;
  DROP TABLE "protected_sources_rels" CASCADE;
  DROP TABLE "protected_source_files" CASCADE;
  DROP TABLE "newsletter_subscriptions" CASCADE;
  DROP TABLE "corrections" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "site_settings_social_accounts" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_primary_navigation" CASCADE;
  DROP TABLE "navigation_footer_navigation_links" CASCADE;
  DROP TABLE "navigation_footer_navigation" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_articles_verification_indicators";
  DROP TYPE "public"."enum_articles_correction_records_type";
  DROP TYPE "public"."enum_articles_format";
  DROP TYPE "public"."enum_articles_authorship_type";
  DROP TYPE "public"."enum_articles_employer_response_status";
  DROP TYPE "public"."enum_articles_editorial_stage";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_verification_indicators";
  DROP TYPE "public"."enum__articles_v_version_correction_records_type";
  DROP TYPE "public"."enum__articles_v_version_format";
  DROP TYPE "public"."enum__articles_v_version_authorship_type";
  DROP TYPE "public"."enum__articles_v_version_employer_response_status";
  DROP TYPE "public"."enum__articles_v_version_editorial_stage";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_public_bylines_authorship_type";
  DROP TYPE "public"."enum_submissions_submission_type";
  DROP TYPE "public"."enum_submissions_contact_preference";
  DROP TYPE "public"."enum_submissions_current_or_former_employee";
  DROP TYPE "public"."enum_submissions_evidence_availability";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_protected_sources_employment_status";
  DROP TYPE "public"."enum_protected_source_files_category";
  DROP TYPE "public"."enum_newsletter_subscriptions_status";
  DROP TYPE "public"."enum_corrections_correction_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_homepage_lead_mode";
  DROP TYPE "public"."enum__homepage_v_version_lead_mode";`);
}
