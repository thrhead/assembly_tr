# Mobile Application Manual Test Plan (V2.0)

**Platform:** iOS / Android (via Expo)
**Context:** Field Worker Operations & Mobile-specific Features
**Date:** 2026-01-27

## 🛠️ How to Run
1. Navigate to mobile directory: `cd apps/mobile`
2. Start the development server: `npx expo start`
3. Scan QR code with Expo Go (Android) or use Simulator (iOS).

---

## 1. Feature: Job Execution & Compliance
**Goal:** Ensure workers adhere to the new strict validation rules (photos, mandatory steps).

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **MOB-01** | **Mandatory Photo Validation** | Job with Sub-steps assigned to Worker. | 1. Open Job Details.<br>2. Expand a Step.<br>3. Try to check (complete) a Sub-step *without* a photo. | Alert triggers: "Bu iş emrini kapatabilmeniz için öncelikle en az 1 adet fotoğraf yüklemeniz gerekmektedir". Checkbox stays empty. | |
| **MOB-02** | **Photo Upload & Completion** | Same as above. | 1. Tap Camera icon on Sub-step.<br>2. Capture/Select photo.<br>3. Wait for upload success.<br>4. Tap Checkbox. | Sub-step marks as completed (Green check). | |
| **MOB-03** | **Job Completion Blocking** | Job has incomplete steps. | 1. Scroll to footer.<br>2. Tap "İşi Bitir" (Complete Job). | Alert triggers: "Bu montajı tamamlayarak kapatmak için tüm alt iş emirlerini tamamlamanız gerekiyor". | |
| **MOB-04** | **Signature & Location** | All steps completed. | 1. Tap "İşi Bitir".<br>2. Select "İmza Al" (Get Signature).<br>3. Sign on pad and Save. | Signature modal closes. Confirmation prompt appears. Final job status includes signature image and GPS coords. | |

## 2. Feature: Role-Based Access (Security)
**Goal:** Verify that Admins cannot perform Worker actions to prevent data corruption.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **MOB-05** | **Admin Read-Only View** | Logged in as `ADMIN`. | 1. Open any Job Detail page.<br>2. Look for checkboxes and camera icons. | Checkboxes are disabled (opacity reduced). Camera icons are **hidden**. | |
| **MOB-06** | **Admin Specific Actions** | Logged in as `ADMIN`. | 1. Look at the header and footer actions. | Header shows "Delete" (Trash icon). Footer shows "Approve/Reject" buttons instead of "Start Job". | |

## 3. Feature: Expense Management
**Goal:** Validate the expense creation flow.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **MOB-07** | **Add Expense with Receipt** | Job Details open. | 1. Scroll to "Giderler" (Expenses).<br>2. Tap "+".<br>3. Fill Amount, Category.<br>4. Attach Receipt Photo. | Expense saved successfully. Appears in list immediately. | |

## 4. Feature: Localization (i18n)
**Goal:** Ensure language switching works instantly without app reload.

| ID | Test Case | Pre-conditions | Steps | Expected Result | Pass/Fail |
|:---:|:---|:---|:---|:---|:---|
| **MOB-08** | **Language Switch (TR/EN)** | Settings Screen. | 1. Switch Language to English.<br>2. Go to Job Details. | Tabs show "Expenses", "Teams". Status shows "Pending". | |
| **MOB-09** | **Date Formatting** | English Mode active. | 1. Check a date field (Started At). | Date format follows MM/DD/YYYY or international standard (not Turkish format). | |

---

## 📝 Execution Log

| Date | Tester Name | Device/OS | Version | Notes |
|:---|:---|:---|:---|:---|
| | | | 2.0.0 | |
