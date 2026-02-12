# Issue #19: Custom Work Order Numbering Plan

## Goal
Implement a hierarchical work order numbering system based on Project Number.
Format: `[ProjectNo]-WO-[Sequence]` for Jobs, and `[JobNo]-SUB-[StepSequence]` for Sub-steps.

## Tasks
- [ ] **Data Model Analysis**: Confirm `projectNo` usage. (Done: It's a string field).
- [ ] **Update `generateJobNumber`**:
    - Modify `apps/web/lib/utils/job-number.ts`.
    - Add logic to check for `projectNo`.
    - If `projectNo` exists, find the highest `WO` index for that project and increment.
    - Format: `${projectNo}-WO-${seq.toString().padStart(2, '0')}`.
    - Fallback: Keep `JOB-YYYY-XXXX` if no `projectNo`.
- [ ] **Update `formatTaskNumber`**:
    - Change output format to include `-SUB-` for steps/substeps as requested.
    - Example: `...-WO-03` -> `...-WO-03-SUB-01`.
- [ ] **Update `createJobAction`**:
    - In `apps/web/lib/actions/jobs.ts`, pass `validated.data.projectNo` to `generateJobNumber`.
- [ ] **Verify**:
    - Create a job with a Project Number. Check generated Job No.
    - Check Step numbers in UI (if displayed via this helper).

## Verification
- [ ] Create a job with Project `PRJ-TEST`. JobNo should be `PRJ-TEST-WO-01`.
- [ ] Create another job with Project `PRJ-TEST`. JobNo should be `PRJ-TEST-WO-02`.
- [ ] Check Step naming: `PRJ-TEST-WO-01-SUB-01`.
