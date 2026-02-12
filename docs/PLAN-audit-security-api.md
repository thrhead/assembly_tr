# Plan: Audit Logs, Security & API Docs

## Context
User wants to implement "Audit Logs" (Option A from Brainstorm) and "Option C" (Security, API Docs, Webhook Resilience) to elevate the project to Enterprise standards.

**Selected Options:**
1.  **Audit Logs:** Track who did what.
2.  **Security Hardening:** Input sanitization.
3.  **API Documentation:** Swagger/OpenAPI.
4.  **Webhook Resilience:** Ensure retries survive server restarts.

## Phase 1: Audit Logging Infrastructure
**Goal:** Create a reliable system to track critical user actions.

- [ ] **1.1 Utilities**
    - Create `apps/web/lib/audit.ts`.
    - Function: `logAudit(userId: string, action: string, resource: string, details: object)`.
    - Use existing `SystemLog` model (level="AUDIT").
- [ ] **1.2 Integration**
    - Audit Critical Actions in `apps/web/app/api/...`:
        - Job Creation/Update/Delete.
        - User Creation/Update.
        - Team Assignments.
        - Approval/Rejection events.
- [ ] **1.3 UI (Optional for V1)**
    - Minimal Admin View to query `SystemLog` where `level="AUDIT"`.

## Phase 2: Security Hardening
**Goal:** Protect against XSS and injection attacks using `isomorphic-dompurify`.

- [ ] **2.1 Sanitization Utility**
    - Create `apps/web/lib/security.ts`.
    - Export `sanitize(input: string): string`.
    - Configure aggressive stripping of dangerous tags.
- [ ] **2.2 Middleware/Zod Integration**
    - Create a Zod refinement or helper `z.string().transform(sanitize)`.
    - Apply to rich-text fields (e.g., Job Description, Comments).

## Phase 3: API Documentation
**Goal:** Auto-generated Swagger UI for `/api/v1/*`.

- [ ] **3.1 Configuration**
    - Configure `swagger-jsdoc` in `apps/web/lib/swagger.ts`.
    - Define reusable schemas (Job, User, Error).
- [ ] **3.2 Route Implementation**
    - Create `apps/web/app/api/docs/route.ts` (GET) to serve OpenAPI JSON.
    - Create `apps/web/app/docs/page.tsx` using `swagger-ui-react`.
- [ ] **3.3 Annotation**
    - Add JSDoc comments (`@openapi`) to key API routes (`jobs`, `auth`).

## Phase 4: Webhook Resilience
**Goal:** Ensure pending webhooks aren't lost if the server restarts.

- [ ] **4.1 Recovery Job**
    - Create `apps/web/app/api/cron/webhooks/route.ts`.
    - Logic: Find `WebhookLog` where `status='PENDING'` AND `nextAttemptAt <= NOW()`.
    - Loop and call `deliverWebhook(log.id)`.
- [ ] **4.2 Vercel Cron Config**
    - Add `crons` entry to `vercel.json` (running every 10 mins).

## Verification Plan
- **Audit:** Perform an action (e.g., Update Job) -> Check `SystemLog` table.
- **Security:** Submit `<script>alert(1)</script>` in description -> Verify saved text is sanitized.
- **Docs:** Visit `/docs` -> See interactive API UI.
- **Webhooks:** Manually trigger a failed webhook -> Restart server -> Trigger Cron -> specific log should be processed.
