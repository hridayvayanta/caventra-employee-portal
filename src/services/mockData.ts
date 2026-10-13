import { User, Task, ActivityEvent, Announcement } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'hriday@caventra.com',
    fullName: 'Hriday Vayanta',
    role: 'super_admin',
    department: 'Coding',
    status: 'active',
    position: 'Co-Founder & Technical Director',
    joinedAt: '2024-01-15T09:00:00Z',
    location: 'Ahmedabad, India',
    bio: 'Overseeing engineering architecture, systems scaling, and applied AI workflows across Caventra initiatives.'
  },
  {
    id: 'usr-admin-2',
    email: 'ved@caventra.com',
    fullName: 'Ved Nimbark',
    role: 'super_admin',
    department: 'Sales',
    status: 'active',
    position: 'Co-Founder & Client Strategy',
    joinedAt: '2024-01-15T09:00:00Z',
    location: 'Ahmedabad, India',
    bio: 'Leading strategic partnerships, client acquisitions, and venture product roadmaps.'
  },
  {
    id: 'usr-admin-3',
    email: 'sauran@caventra.com',
    fullName: 'Sauran Mansuri',
    role: 'super_admin',
    department: 'HR',
    status: 'active',
    position: 'Co-Founder & Operations Lead',
    joinedAt: '2024-01-15T09:00:00Z',
    location: 'Ahmedabad, India',
    bio: 'Directing studio operations, organizational culture, and resource orchestration.'
  },
  {
    id: 'usr-emp-code-1',
    email: 'alex.rivera@caventra.com',
    fullName: 'Alex Rivera',
    role: 'employee',
    department: 'Coding',
    status: 'active',
    position: 'Senior Full-Stack Engineer',
    joinedAt: '2024-04-10T10:00:00Z',
    location: 'Remote',
    bio: 'Specializing in React, TypeScript, high-throughput Node.js microservices, and reactive real-time systems.'
  },
  {
    id: 'usr-emp-code-2',
    email: 'elena.r@caventra.com',
    fullName: 'Elena Rostova',
    role: 'employee',
    department: 'Coding',
    status: 'active',
    position: 'AI Solutions Engineer',
    joinedAt: '2024-06-01T11:00:00Z',
    location: 'Remote',
    bio: 'Developing generative workflows, vector search pipelines, and LLM integrations for PLINTH and Caventra products.'
  },
  {
    id: 'usr-emp-code-3',
    email: 'dev.patel@caventra.com',
    fullName: 'Dev Patel',
    role: 'employee',
    department: 'Coding',
    status: 'active',
    position: 'Frontend Systems Developer',
    joinedAt: '2024-08-15T09:30:00Z',
    location: 'Ahmedabad, India',
    bio: 'Focused on micro-interactions, responsive UI performance, and component accessibility.'
  },
  {
    id: 'usr-emp-sales-1',
    email: 'sarah.chen@caventra.com',
    fullName: 'Sarah Chen',
    role: 'employee',
    department: 'Sales',
    status: 'active',
    position: 'Solutions Sales Director',
    joinedAt: '2024-03-20T09:00:00Z',
    location: 'London / Remote',
    bio: 'Driving enterprise software contracts, scoping technical discovery, and closing commercial proposals.'
  },
  {
    id: 'usr-emp-sales-2',
    email: 'marcus.v@caventra.com',
    fullName: 'Marcus Vance',
    role: 'employee',
    department: 'Sales',
    status: 'active',
    position: 'Commercial Accounts Lead',
    joinedAt: '2024-07-01T08:30:00Z',
    location: 'Dubai / Remote',
    bio: 'Expanding Middle East and European client networks for digital transformation projects.'
  },
  {
    id: 'usr-emp-hr-1',
    email: 'maya.lin@caventra.com',
    fullName: 'Maya Lin',
    role: 'employee',
    department: 'HR',
    status: 'active',
    position: 'People & Culture Partner',
    joinedAt: '2024-05-12T10:00:00Z',
    location: 'Remote',
    bio: 'Championing engineer onboarding, talent well-being, and continuous performance feedback loops.'
  },
  {
    id: 'usr-emp-hr-2',
    email: 'jordan.h@caventra.com',
    fullName: 'Jordan Hayes',
    role: 'employee',
    department: 'HR',
    status: 'active',
    position: 'Talent Acquisition Specialist',
    joinedAt: '2024-09-01T09:00:00Z',
    location: 'Remote',
    bio: 'Sourcing world-class senior engineers and digital product designers across global tech hubs.'
  },
  {
    id: 'usr-pend-1',
    email: 'julian.reed@applicant.caventra.com',
    fullName: 'Julian Reed',
    role: 'employee',
    department: 'Coding',
    status: 'pending_approval',
    position: 'Full-Stack Developer Applicant',
    joinedAt: '2026-10-12T14:22:00Z',
    location: 'Berlin / Remote',
    bio: 'Awaiting admin credentials verification.'
  },
  {
    id: 'usr-pend-2',
    email: 'priya.sharma@applicant.caventra.com',
    fullName: 'Priya Sharma',
    role: 'employee',
    department: 'Sales',
    status: 'pending_approval',
    position: 'Client Relations Associate Applicant',
    joinedAt: '2026-10-13T08:15:00Z',
    location: 'Mumbai, India',
    bio: 'Awaiting account authorization.'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    title: 'Deploy WebSocket Real-time Sync for PLINTH Floor Plans',
    description: 'Implement bi-directional event dispatching across architects and structural engineers using Celery Redis pub/sub. Verify low latency delta updates on the CAD floor plan canvas.',
    department: 'Coding',
    assigneeId: 'usr-emp-code-1',
    assigneeName: 'Alex Rivera',
    createdBy: 'usr-admin-1',
    createdByName: 'Hriday Vayanta',
    createdAt: '2026-10-08T10:00:00Z',
    deadline: '2026-10-16T18:00:00Z',
    priority: 'Urgent',
    status: 'In Progress',
    updates: [
      {
        id: 'upd-001-1',
        taskId: 'tsk-001',
        authorId: 'usr-emp-code-1',
        authorName: 'Alex Rivera',
        authorRole: 'employee',
        previousStatus: 'To Do',
        newStatus: 'In Progress',
        note: 'Completed benchmark tests with 50 concurrent floor plan editors. Latency is hovering around 38ms. Working on reconnect backoff logic.',
        deliverableUrl: 'https://github.com/caventra/plinth-core/pull/142',
        timestamp: '2026-10-10T15:30:00Z'
      }
    ]
  },
  {
    id: 'tsk-002',
    title: 'LLM Fine-tuning for Bill of Quantities (BOQ) Parser',
    description: 'Evaluate open weights model for extracting cost line-items from architectural blueprints and converting them directly into structured JSON schemas.',
    department: 'Coding',
    assigneeId: 'usr-emp-code-2',
    assigneeName: 'Elena Rostova',
    createdBy: 'usr-admin-1',
    createdByName: 'Hriday Vayanta',
    createdAt: '2026-10-05T09:00:00Z',
    deadline: '2026-10-18T17:00:00Z',
    priority: 'High',
    status: 'In Progress',
    updates: [
      {
        id: 'upd-002-1',
        taskId: 'tsk-002',
        authorId: 'usr-emp-code-2',
        authorName: 'Elena Rostova',
        authorRole: 'employee',
        previousStatus: 'To Do',
        newStatus: 'In Progress',
        note: 'Dataset of 2,400 annotated architectural blueprints formatted. Synthetic validation set currently scoring 94.2% F1 on itemized materials.',
        timestamp: '2026-10-09T11:20:00Z'
      }
    ]
  },
  {
    id: 'tsk-003',
    title: 'The Wheel Master: PDF Invoice Engine Performance Profiling',
    description: 'Resolve memory bottleneck when generating multi-page client repair job cards with high-resolution alloy wheel condition photos via jsPDF.',
    department: 'Coding',
    assigneeId: 'usr-emp-code-3',
    assigneeName: 'Dev Patel',
    createdBy: 'usr-admin-1',
    createdByName: 'Hriday Vayanta',
    createdAt: '2026-10-02T11:00:00Z',
    deadline: '2026-10-14T20:00:00Z',
    priority: 'Urgent',
    status: 'Blocked',
    blockReason: 'Awaiting Web Worker image downscaling utility from image processing pipeline to prevent UI freeze on iOS Safari.',
    updates: [
      {
        id: 'upd-003-1',
        taskId: 'tsk-003',
        authorId: 'usr-emp-code-3',
        authorName: 'Dev Patel',
        authorRole: 'employee',
        previousStatus: 'In Progress',
        newStatus: 'Blocked',
        note: 'Mobile Safari runs out of heap memory when rendering 4K tire damage scans. Flagged blocker for worker allocation.',
        timestamp: '2026-10-11T16:45:00Z'
      }
    ]
  },
  {
    id: 'tsk-004',
    title: 'Deliver Ironforge Store Stripe Checkout Multi-currency Integration',
    description: 'Complete cross-border currency conversions and automatic tax calculation for fitness equipment orders originating in the UK, EU, and UAE.',
    department: 'Coding',
    assigneeId: 'usr-emp-code-1',
    assigneeName: 'Alex Rivera',
    createdBy: 'usr-admin-1',
    createdByName: 'Hriday Vayanta',
    createdAt: '2026-09-25T10:00:00Z',
    deadline: '2026-10-06T18:00:00Z',
    priority: 'High',
    status: 'Completed',
    completionNotes: 'Stripe Tax integration verified in test environment. Multi-currency conversions live across GBP, EUR, and AED. Unit tests passing 100%.',
    deliverableUrl: 'https://staging.ironforge-store.caventra.app',
    updates: [
      {
        id: 'upd-004-1',
        taskId: 'tsk-004',
        authorId: 'usr-emp-code-1',
        authorName: 'Alex Rivera',
        authorRole: 'employee',
        previousStatus: 'In Progress',
        newStatus: 'Completed',
        note: 'Final staging deployment complete. All webhook events verified.',
        deliverableUrl: 'https://staging.ironforge-store.caventra.app',
        timestamp: '2026-10-06T14:10:00Z'
      }
    ]
  },
  {
    id: 'tsk-005',
    title: 'Prepare Enterprise RFP Pitch for Middle East ConTech Firm',
    description: 'Structure commercial proposal and architectural roadmap demonstrating PLINTH adoption for multi-site commercial tower builds.',
    department: 'Sales',
    assigneeId: 'usr-emp-sales-1',
    assigneeName: 'Sarah Chen',
    createdBy: 'usr-admin-2',
    createdByName: 'Ved Nimbark',
    createdAt: '2026-10-07T12:00:00Z',
    deadline: '2026-10-17T17:00:00Z',
    priority: 'Urgent',
    status: 'In Progress',
    updates: [
      {
        id: 'upd-005-1',
        taskId: 'tsk-005',
        authorId: 'usr-emp-sales-1',
        authorName: 'Sarah Chen',
        authorRole: 'employee',
        previousStatus: 'To Do',
        newStatus: 'In Progress',
        note: 'Executive summary and pricing tier structure drafted. Awaiting technical SLA appendix from engineering team.',
        deliverableUrl: 'https://docs.caventra.internal/rfp/dubai-aec-2026.pdf',
        timestamp: '2026-10-11T10:00:00Z'
      }
    ]
  },
  {
    id: 'tsk-006',
    title: 'Q4 Inbound Enterprise Pipeline Qualification & Review',
    description: 'Review and qualify the 38 bespoke software inquiries received via caventra.com. Prioritize high-match applied AI and ERP prospects.',
    department: 'Sales',
    assigneeId: 'usr-emp-sales-2',
    assigneeName: 'Marcus Vance',
    createdBy: 'usr-admin-2',
    createdByName: 'Ved Nimbark',
    createdAt: '2026-10-09T08:00:00Z',
    deadline: '2026-10-15T19:00:00Z',
    priority: 'Medium',
    status: 'To Do',
    updates: []
  },
  {
    id: 'tsk-007',
    title: 'Divine Bridal Boutique Case Study & Client Signoff',
    description: 'Consolidate conversion analytics and customer journey findings from the Divine Bridal e-commerce release into our published showcase.',
    department: 'Sales',
    assigneeId: 'usr-emp-sales-1',
    assigneeName: 'Sarah Chen',
    createdBy: 'usr-admin-2',
    createdByName: 'Ved Nimbark',
    createdAt: '2026-10-01T10:00:00Z',
    deadline: '2026-10-12T17:00:00Z',
    priority: 'Low',
    status: 'Completed',
    completionNotes: 'Client testimonial recorded and approved. 34% checkout bounce rate reduction documented.',
    updates: [
      {
        id: 'upd-007-1',
        taskId: 'tsk-007',
        authorId: 'usr-emp-sales-1',
        authorName: 'Sarah Chen',
        authorRole: 'employee',
        previousStatus: 'In Progress',
        newStatus: 'Completed',
        note: 'Published to Caventra case study repository.',
        timestamp: '2026-10-12T15:00:00Z'
      }
    ]
  },
  {
    id: 'tsk-008',
    title: 'Q4 Engineering Performance Evaluations & Growth Framework',
    description: 'Roll out 360-degree feedback templates for Coding team engineers. Coordinate calibration calls with technical directors.',
    department: 'HR',
    assigneeId: 'usr-emp-hr-1',
    assigneeName: 'Maya Lin',
    createdBy: 'usr-admin-3',
    createdByName: 'Sauran Mansuri',
    createdAt: '2026-10-04T09:00:00Z',
    deadline: '2026-10-20T18:00:00Z',
    priority: 'High',
    status: 'In Progress',
    updates: [
      {
        id: 'upd-008-1',
        taskId: 'tsk-008',
        authorId: 'usr-emp-hr-1',
        authorName: 'Maya Lin',
        authorRole: 'employee',
        previousStatus: 'To Do',
        newStatus: 'In Progress',
        note: 'Evaluation criteria shared with department leads. 8 of 12 self-reviews submitted to date.',
        timestamp: '2026-10-10T09:15:00Z'
      }
    ]
  },
  {
    id: 'tsk-009',
    title: 'Global Employee Onboarding Handbook 2026 Update',
    description: 'Incorporate new security protocols, GitHub CI/CD access requirements, and updated time-zone synchronization policies for distributed team members.',
    department: 'HR',
    assigneeId: 'usr-emp-hr-2',
    assigneeName: 'Jordan Hayes',
    createdBy: 'usr-admin-3',
    createdByName: 'Sauran Mansuri',
    createdAt: '2026-10-06T11:00:00Z',
    deadline: '2026-10-15T16:00:00Z',
    priority: 'Medium',
    status: 'In Progress',
    updates: [
      {
        id: 'upd-009-1',
        taskId: 'tsk-009',
        authorId: 'usr-emp-hr-2',
        authorName: 'Jordan Hayes',
        authorRole: 'employee',
        previousStatus: 'To Do',
        newStatus: 'In Progress',
        note: 'Security guidelines reviewed with Hriday. Finalizing section on remote workspace ergonomics.',
        timestamp: '2026-10-12T11:30:00Z'
      }
    ]
  },
  {
    id: 'tsk-010',
    title: 'Verify Candidate Pipeline for Senior Rust / Distributed Systems Role',
    description: 'Screen technical test submissions for our upcoming infrastructure optimization project.',
    department: 'HR',
    assigneeId: 'usr-emp-hr-2',
    assigneeName: 'Jordan Hayes',
    createdBy: 'usr-admin-3',
    createdByName: 'Sauran Mansuri',
    createdAt: '2026-10-11T14:00:00Z',
    deadline: '2026-10-19T18:00:00Z',
    priority: 'High',
    status: 'To Do',
    updates: []
  }
];

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-001',
    timestamp: '2026-10-13T08:15:00Z',
    type: 'employee_registered',
    actorId: 'usr-pend-2',
    actorName: 'Priya Sharma',
    actorRole: 'employee',
    targetId: 'usr-pend-2',
    targetName: 'Priya Sharma',
    department: 'Sales',
    description: 'Submitted registration for Sales Department. Awaiting super-admin approval.'
  },
  {
    id: 'act-002',
    timestamp: '2026-10-12T15:00:00Z',
    type: 'task_completed',
    actorId: 'usr-emp-sales-1',
    actorName: 'Sarah Chen',
    actorRole: 'employee',
    targetId: 'tsk-007',
    targetName: 'Divine Bridal Boutique Case Study & Client Signoff',
    department: 'Sales',
    description: 'Marked task as Completed with client signoff confirmation.'
  },
  {
    id: 'act-003',
    timestamp: '2026-10-12T14:22:00Z',
    type: 'employee_registered',
    actorId: 'usr-pend-1',
    actorName: 'Julian Reed',
    actorRole: 'employee',
    targetId: 'usr-pend-1',
    targetName: 'Julian Reed',
    department: 'Coding',
    description: 'Submitted registration for Coding Department. Awaiting super-admin approval.'
  },
  {
    id: 'act-004',
    timestamp: '2026-10-11T16:45:00Z',
    type: 'task_blocked',
    actorId: 'usr-emp-code-3',
    actorName: 'Dev Patel',
    actorRole: 'employee',
    targetId: 'tsk-003',
    targetName: 'The Wheel Master: PDF Invoice Engine Performance Profiling',
    department: 'Coding',
    description: 'Flagged task as Blocked: iOS Safari memory limitation awaiting worker pipeline.'
  },
  {
    id: 'act-005',
    timestamp: '2026-10-10T15:30:00Z',
    type: 'task_status_changed',
    actorId: 'usr-emp-code-1',
    actorName: 'Alex Rivera',
    actorRole: 'employee',
    targetId: 'tsk-001',
    targetName: 'Deploy WebSocket Real-time Sync for PLINTH Floor Plans',
    department: 'Coding',
    description: 'Updated status to In Progress: Latency benchmark at 38ms.'
  },
  {
    id: 'act-006',
    timestamp: '2026-10-09T08:00:00Z',
    type: 'task_created',
    actorId: 'usr-admin-2',
    actorName: 'Ved Nimbark',
    actorRole: 'super_admin',
    targetId: 'tsk-006',
    targetName: 'Q4 Inbound Enterprise Pipeline Qualification & Review',
    department: 'Sales',
    description: 'Created and assigned new priority task to Marcus Vance.'
  },
  {
    id: 'act-007',
    timestamp: '2026-10-08T10:00:00Z',
    type: 'task_created',
    actorId: 'usr-admin-1',
    actorName: 'Hriday Vayanta',
    actorRole: 'super_admin',
    targetId: 'tsk-001',
    targetName: 'Deploy WebSocket Real-time Sync for PLINTH Floor Plans',
    department: 'Coding',
    description: 'Created and assigned urgent task to Alex Rivera.'
  },
  {
    id: 'act-008',
    timestamp: '2026-10-06T14:10:00Z',
    type: 'task_completed',
    actorId: 'usr-emp-code-1',
    actorName: 'Alex Rivera',
    actorRole: 'employee',
    targetId: 'tsk-004',
    targetName: 'Deliver Ironforge Store Stripe Checkout Multi-currency Integration',
    department: 'Coding',
    description: 'Marked task as Completed after verifying multi-currency test transactions.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-001',
    title: 'Caventra Studio All-Hands — Q4 Product Architecture & Milestones',
    content: 'Join our studio-wide sprint sync this Friday at 15:00 UTC. We will review PLINTH pilot feedback, showcase new AI workflows, and welcome our newest team members.',
    authorName: 'Hriday Vayanta',
    department: 'All',
    date: '2026-10-12',
    priority: 'important'
  },
  {
    id: 'anc-002',
    title: 'Coding Standards: Mandatory Type Safety & Bundle Size Budgets',
    content: 'All frontend pull requests must now adhere to the zero-warning bundle limits. Ensure all async operations are wrapped in clean error boundaries.',
    authorName: 'Alex Rivera',
    department: 'Coding',
    date: '2026-10-10',
    priority: 'normal'
  },
  {
    id: 'anc-003',
    title: 'Enterprise Client Lead Pipeline Milestone Achieved',
    content: 'Outstanding work from the Sales team — 14 new qualified enterprise discovery conversations scheduled for next month across ConTech and retail tech.',
    authorName: 'Ved Nimbark',
    department: 'Sales',
    date: '2026-10-09',
    priority: 'normal'
  }
];
