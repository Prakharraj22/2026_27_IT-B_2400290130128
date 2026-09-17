-- Adds Projects/Experience/Certifications to the Profile, following the
-- same JSONB-array-on-Profile pattern already used for `skills`. These are
-- entirely user-owned (unlike `skills`, which is Resume Module-protected),
-- so no PATCH /profiles/me guard is needed for them.
ALTER TABLE "auth"."profiles" ADD COLUMN "projects" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "auth"."profiles" ADD COLUMN "experience" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "auth"."profiles" ADD COLUMN "certifications" JSONB NOT NULL DEFAULT '[]';
