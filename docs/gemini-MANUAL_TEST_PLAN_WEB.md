# Web Application Manual Test Plan (V2.0)

**Platform:** Web Dashboard (Next.js / Chrome)
**Context:** Admin Dashboard, Analytics, and Data Management
**Date:** 2026-01-27

## 🛠️ How to Run
1. Navigate to web directory: `cd apps/web`
2. Start the development server: `npm run dev`
3. Open browser: `http://localhost:3000`

---

## 1. Feature: Job Visualization & Analytics
**Goal:** Verify new visual components in Job Details.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **WEB-01** | **Progress Charts** | Job is "In Progress". | 1. Navigate to `Admin > Jobs > [ID]`.<br>2. Click "Grafikler" (Analytics) tab. | Circular chart reflects correct % completion. Bar chart segments (Completed/Blocked) match step data. | |
| **WEB-02** | **Timeline View** | Job has scheduled/started dates. | 1. Click "Zaman Çizelgesi" (Timeline) tab. | Timeline correctly renders Scheduled vs. Actual events. | |
| **WEB-03** | **Estimated Completion** | Active job with partial progress. | 1. Check "Detaylar" (Details) tab > "Tahmini Bitiş". | A future time is calculated and displayed based on current pace (e.g., "15:45"). | |
| **WEB-04** | **Map Coordinates** | Job with lat/long data. | 1. Click "Harita" (Map) tab. | Google Maps (or placeholder) loads centered on the job location pins. | |

## 2. Feature: Reporting & Exports
**Goal:** Test the functionality of new document generation buttons.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **WEB-05** | **Proforma Invoice** | Job Details page. | 1. Click "Proforma İndir" button (Header). | PDF generates and downloads containing Customer info + Service items + Total Price. | |
| **WEB-06** | **Excel Export** | Job Details page. | 1. Click "Excel İndir" button. | `.xlsx` file downloads with job steps and status breakdown. | |
| **WEB-07** | **PDF Report** | Job Details page. | 1. Click "PDF" button. | Detailed Job Report PDF downloads (including photos if applicable). | |

## 3. Feature: Team Management
**Goal:** Validate improved team metrics.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **WEB-08** | **Efficiency Score** | Team with completed jobs. | 1. Navigate to `Admin > Teams > [Team ID]`. | "Verimlilik Skoru" displays a calculated number (0-100). | |
| **WEB-09** | **Member Availability** | Team members assigned to jobs. | 1. Check "Üyeler" list in Team Details. | Status indicators (Busy/Available) reflect current job assignments correctly. | |

## 4. Feature: System Stability
**Goal:** Ensure regression fixes for 500 errors are effective.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **WEB-10** | **Dashboard Load Stress** | Dashboard Main Page. | 1. Refresh page 5 times quickly.<br>2. Switch between "Jobs" and "Teams" tabs rapidly. | No "Internal Server Error" toasts. Data loads consistently. | |
| **WEB-11** | **Edit Job Coordinates** | Job Details > Map Tab. | 1. Enter new Lat/Long.<br>2. Click Save. | Success toast appears. Page reloads (or updates) with new location. No crash. | |

---

## 📝 Execution Log

| Date | Tester Name | Browser | Version | Notes |
|:---|:---|:---|:---|:---|
| | | Chrome / Edge | 2.0.0 | |
