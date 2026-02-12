
# PLAN - Issue #31: Centralized Team Reports

## Objective
Create a centralized report page (`/admin/reports/teams`) that allows administrators to compare performance, financial, and workload metrics across all teams in one view.

## Requirements
1.  **Backend Data Access:**
    -   Extend `apps/web/lib/data/teams.ts` with `getAllTeamsReports()` function.
    -   This function should aggregate key metrics for all active teams:
        -   Total Jobs (Completed/Active)
        -   Total Expenses
        -   Total Working Hours
        -   Efficiency Score
        -   Success Rate
2.  **Frontend UI:**
    -   **Page:** `apps/web/app/[locale]/admin/reports/teams/page.tsx`
    -   **Components:**
        -   **Summary Cards:** Aggregate stats for the whole organization.
        -   **Comparison Table:** Sortable table listing all teams with their metrics.
        -   **Visuals:** Progress bars for Efficiency/Success Rate, Color-coded status.
    -   **Navigation:** Ensure it's linked from the main Reports page or Sidebar.

## Implementation Steps
1.  **Update Data Layer:**
    -   Modify `apps/web/lib/data/teams.ts` to implement `getAllTeamsReports`.
2.  **Create UI:**
    -   Create `apps/web/app/[locale]/admin/reports/teams/page.tsx`.
    -   Use `shadcn/ui` components (Table, Card, Badge, Progress).
3.  **Verification:**
    -   Check if the page loads correctly.
    -   Verify the data matches the individual team pages.
