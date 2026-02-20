# F&B AI Platform — Admin Console Specification

> **Authority:** Aligned with the Stakeholder Document (Section 7: UX Design Blueprint - Admin console).
> **Purpose:** Internal tool for platform operators to manage compliance, data quality, support escalations, and network performance.

---

## Table of Contents

1. [Supplier KYC & Verification](#1-supplier-kyc--verification)
2. [Catalog QA & SKU Normalization](#2-catalog-qa--sku-normalization)
3. [Dispute Resolution Center](#3-dispute-resolution-center)
4. [Platform Analytics](#4-platform-analytics)
5. [Audit Logs & Role Management](#5-audit-logs--role-management)

---

## 1. Supplier KYC & Verification

### Objective
Ensure only legitimate and compliant suppliers operate on the platform, preventing fraud and setting appropriate credit guardrails.

### Features
* **Review Queue:** Dashboard showing pending registrations with calculated risk scores.
* **Document Verification:** Secure viewer for Trade Licenses, Emirates ID (Signatory), and VAT Certificates.
* **Approval Workflow:**
  * Statuses: `Pending`, `Needs More Info`, `Approved`, `Rejected`.
  * Support for reviewer reason codes and internal notes.
* **Category Permissions:** Assign verified suppliers to approved categories (e.g., Seafood, Dry Goods) to restrict unauthorized selling outside their specialization.

---

## 2. Catalog QA & SKU Normalization

### Objective
Maintain the integrity of the Normalized SKU catalog, ensuring true "apples-to-apples" pricing comparisons for restaurants.

### Features
* **Duplication Scanner:** Nightly job that flags potential duplicate SKUs uploaded by suppliers.
* **Unit Mismatch Alerts:** Identifies inconsistencies (e.g., Supplier A uploads "10kg", Supplier B uploads "1000g") and forces normalization.
* **Manual Override AI Tool:** Admin interface to review the Weaviate vector search results (confidence < 0.80) and manually link or separate SKUs.
* **Category Taxonomy Management:** Ability to add, merge, or deprecate categories/subcategories globally.

---

## 3. Dispute Resolution Center

### Objective
A centralized workflow to handle escalations between Restaurants and Suppliers (e.g., 3-Way mismatches, uncredited returns, or delivery no-shows) that AI could not auto-resolve.

### Features
* **Ticketing System:** Links directly to the disputed Purchase Order, GRN, and Invoice.
* **Evidence Viewer:** Side-by-side view of GRN photos (damaged goods/shortages) vs. Supplier claims.
* **Resolution Actions:**
  * Force Credit Note generation.
  * Adjust Invoice amounts manually.
  * Refund to Platform Wallet / Credit Card.
* **Supplier Penalty Tracking:** Log infractions against supplier SLAs (affecting their Marketplace ranking).

---

## 4. Platform Analytics

### Objective
Provide internal stakeholders (Management, Operations, Sales) with a macro view of marketplace health.

### Features
* **Network Velocity:** Gross Merchandise Value (GMV), Order Volume, and Average Order Value (AOV).
* **AI Efficacy Metrics:**
  * Percentage of POs generated via Smart Cart vs Manual.
  * Quote response time (AI vs Human).
  * Flash Deal conversion rates.
* **Supply-Side Health:**
  * Fulfillment success rate.
  * Average delivery delays.
  * Supplier churn risk.
* **Demand-Side Health:**
  * Restaurant ordering frequency.
  * Average food cost savings enabled by AI.

---

## 5. Audit Logs & Role Management

### Objective
Enterprise-grade security and compliance via immutable records of systemic and human actions.

### Features
* **Universal Audit Trail:** Every configuration change, KYC approval, transaction modification, and forced dispute resolution is logged.
* **Log Schema:** Timestamp, User ID / Agent ID, Action Type, Previous State, New State.
* **Role-Based Access Control (RBAC):**
  * Super Admin: Full system access.
  * Compliance Officer: Read/Write KYC, Read Audit Logs.
  * Catalog Manager: Read/Write SKU Engine, Categories.
  * Support Agent: Read/Write Dispute Resolution.
