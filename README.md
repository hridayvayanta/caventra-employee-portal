# CAVENTRA — Employee Management Portal
> **Ideas to Impact** · Internal Operations & Team Workspaces

A high-impact, refined employee management portal engineered for **CAVENTRA — Ideas to Impact**. Designed specifically for static hosting on **GitHub Pages** with a clean, decoupled service architecture ready for managed backend integration.

---

## 1. Visual Identity & Design Heritage

The portal preserves and extends the design language established in the Caventra studio reference:
- **Color Palette**:
  - Deep Space Canvas: `#0b0e11` / `#0f1316`
  - Elevated Card Background: `#14181c` / `#1a2026`
  - Structural Lines & Borders: `#23282f` / `#2e353f`
  - Primary Champagne Gold: `#c9b8a0`
  - Metallic Highlight Gold: `#f3e6d1` / `#e3d3bc`
  - Subtle Gold Glow: `rgba(201, 184, 160, 0.15)`
- **Typography**:
  - Display / Headings: `Syne`, `Outfit`, sans-serif
  - Interface / Body: `Outfit`, `Manrope`, -apple-system, sans-serif
- **Brand Assets**:
  - Authentic Caventra 3D Ribbon Emblem and Wordmark (`logo.png`, `logo-nav.png`, `favicon.png`) directly from the studio assets.
  - No synthetic placeholders or redrawn logos.

---

## 2. Core Features & Capabilities

### Shared Single Login Gate
- **Single Public Entrypoint**: All users open the same URL and authenticate through one unified interface.
- **Dynamic Role-Based Redirection**: Authenticated users are automatically routed to their designated workspace based on their verified role (`super_admin` vs `employee`).
- **Show/Hide Password**: Clear accessibility toggle and loading states.
- **Employee Registration**: Applicants select their department (**Sales**, **Coding**, or **HR**) and submit credentials.
- **Pending Review Gate**: Newly registered accounts are locked in a pending approval state. Pending applicants cannot access company projects or sensitive team data until explicitly approved by a Super Admin.

### Super-Admin Workspace
1. **Company Overview**:
   - Organization-wide metrics: Total approved employees, pending review queue, total tasks, tasks in progress, completed milestones, and overdue items.
   - Department breakdown: Live completion percentage rings and workforce allocation across Sales, Coding, and HR.
   - Priority alerts: Highlighted view of blocked deliverables and overdue deadlines.
2. **Employee Management**:
   - Approve or reject pending registrations with audit logging.
   - Reassign employees across departments.
   - Activate or deactivate employee accounts with destructive confirmation modals.
   - Role enforcement preventing privilege escalation.
3. **Department Management**:
   - Dedicated views for **Coding**, **Sales**, and **HR**.
   - Team member roster with active task workloads.
   - Department-specific task tracking and recent work update feeds.
   - Quick "+ Create Task for [Department]" action.
4. **Task Management**:
   - Create, edit, and reassign tasks.
   - Configure title, scope description, department, assignee, priority (Low, Medium, High, Urgent), and target deadline.
   - Track task statuses: `To Do`, `In Progress`, `Blocked`, and `Completed`.
   - Review employee deliverable submissions and external links (GitHub PRs, Figma, docs).
5. **Activity Feed**:
   - Immutable timeline of organizational audit events: employee registrations, account approvals, task creations, reassignments, status transitions, and progress updates.

### Employee Workspace
- **Personalized Header**: Welcome banner with employee name, department pill, and current date.
- **Personal Metric Counters**: My Assigned Tasks, In Progress, To Do, Blocked, Completed, and Overdue indicators.
- **Task Milestones**: Interactive cards detailing scope, priority, deadline countdowns, and blockers.
- **Progress Submission Engine**:
  - Move tasks through lifecycle states (`To Do` → `In Progress` → `Completed`, or flag as `Blocked`).
  - Log progress notes and blocker explanations.
  - Submit deliverable links (GitHub pull requests, staging links, documentation).
  - Complete historical log of all previous updates.
- **Department Team Directory**: View fellow colleagues and department leadership within the employee's functional area.
- **Company Announcements**: Studio all-hands updates and engineering standards.

---

## 3. GitHub Pages Hosting & Technical Architecture

### Hosting Model
This application is configured as a static Single Page Application (SPA) deployable directly to **GitHub Pages** without requiring a custom Node.js/Django backend server.

### Technical Limitation Disclosure
> [!IMPORTANT]
> **Static Hosting Limitation**: GitHub Pages serves static files only and cannot execute server-side authentication, private row-level database authorization, or secure administrative checks.
>
> When deployed without an external managed backend, the portal operates in **Prototype / Evaluation Mode**, storing sandboxed demo data in browser `localStorage`. Client-side authentication checks are used solely for UI demonstration and user-flow evaluation.

### Decoupled Service Layer
The application implements an abstracted service layer (`src/services/storage.ts`):
- **Local Storage Adapter (Default)**: Pre-populated with realistic Caventra founder, engineer, sales, and HR data, ready for immediate evaluation on GitHub Pages.
- **Remote Managed Adapter (Configurable)**: In the demo banner or settings modal, an administrator can configure a managed API endpoint (e.g., Supabase, Firebase, or a private REST API).
- **Zero Hardcoded Secrets**: No secret keys, database credentials, or administrative passwords exist in the client repository.

---

## 4. Demo Evaluation Personas

To test the application immediately on GitHub Pages, use the quick persona switcher in the top banner or enter any of the pre-configured accounts:

| Role | Name | Title | Department | Email | Demo Password |
|---|---|---|---|---|---|
| **Super Admin** | Hriday Vayanta | Founder | Founders / Org Leadership | `hriday@caventra.com` | `Caventra2026!` |
| **Super Admin** | Ved Nimbark | Founder | Founders / Org Leadership | `ved@caventra.com` | `Caventra2026!` |
| **Super Admin** | Sauran Mansuri | Founder | Founders / Org Leadership | `sauran@caventra.com` | `Caventra2026!` |
| **Employee** | Alex Rivera | Senior Full-Stack Engineer | Coding | `alex.rivera@caventra.com` | `Caventra2026!` |
| **Employee** | Sarah Chen | Solutions Sales Director | Sales | `sarah.chen@caventra.com` | `Caventra2026!` |
| **Employee** | Maya Lin | People & Culture Partner | HR | `maya.lin@caventra.com` | `Caventra2026!` |
| **Pending Applicant** | Julian Reed | Developer Applicant | Coding (Applicant) | `julian.reed@applicant.caventra.com` | `Caventra2026!` |

---

## 5. Deployment Instructions for GitHub Pages

### Method 1: Automated GitHub Actions (Recommended)

1. Initialize a Git repository and commit the portal files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Caventra Employee Management Portal"
   ```

2. Create a repository on GitHub (e.g. `caventra-employee-portal`) and push:
   ```bash
   git remote add origin https://github.com/<your-username>/caventra-employee-portal.git
   git branch -M main
   git push -u origin main
   ```

3. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - The included workflow file (`.github/workflows/deploy.yml`) will automatically build and deploy the application.
   - Your portal will be live at: `https://<your-username>.github.io/caventra-employee-portal/`

### Method 2: Manual Build & Deploy via `gh-pages`

```bash
# 1. Install dependencies
npm install

# 2. Build the production bundle
npm run build

# 3. Deploy the dist directory to gh-pages
npx gh-pages -d dist
```

### Custom Domain Configuration (Optional)
If you wish to point a custom domain (such as `portal.caventra.com`):
1. In the repository **Settings** → **Pages**, enter your custom domain under **Custom domain**.
2. Add a `CNAME` record in your DNS provider pointing `portal.caventra.com` to `<your-username>.github.io`.

---

## 6. Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 (with relative asset paths for GitHub Pages subfolder compatibility)
- **Icons**: Lucide React
- **Styling**: Pure CSS design tokens strictly matching the Caventra brand guidelines (`Outfit`, `Syne`, metallic champagne gold `#c9b8a0`)
- **State & Storage**: Abstracted Storage Service with LocalStorage persistence and API adapter bridge
