# SiteSync: Construction Resource Scheduler

A high-performance, grid-based scheduling application designed for construction management. SiteSync allows dispatchers to manage employee assignments, vehicle logistics, and site priorities through an interactive daily matrix.

## 📋 Features

### 🏗️ Interactive Scheduling Grid
* **Dual-Axis Management:** Y-axis displays Construction Sites; X-axis displays Employees.
* **Click-to-Assign:** Toggle employee assignments via interactive cell clicks.
* **Hover Clarity:** Dynamic row and column highlighting for error-free navigation in large grids.
* **Persistent Drafting:** Today’s schedule automatically clones to tomorrow's draft.
* **Staged Saves:** Changes are only published to the live database after clicking the **Save** button.

### 🚦 Intelligent Business Rules
* **Vacation Sync (Blue):** Automatically pulls data from the Vacation Planner. Employees on leave are locked and cannot be scheduled.
* **Status Color Coding:**
    * 🟩 **Green:** Scheduled employees.
    * 🟥 **Red:** Unscheduled/Empty construction sites.
* **Conflict Alerts:** Real-time warnings for double-scheduling employees or assigning the same vehicle to multiple sites.

### 🔧 Site & Logistics Management
* **Priority Engine:** Sites are sorted by priority (high to low). Sites marked `Priority 0` are automatically archived from the grid.
* **Logistics:** * "Come to warehouse" (Yes/No) checkbox per site.
    * Multi-vehicle assignment via dropdown menus.
* **Communication:** Support for daily site-specific comments that merge with permanent site instructions for field staff.

## 🛠️ Tech Stack (Suggested)
* **Frontend:** React/Next.js or Vue.js
* **Backend:** Node.js / PostgreSQL
* **State Management:** TanStack Query (React Query) for handling staged "Save" states.
* **Styling:** Tailwind CSS

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL (v14+)