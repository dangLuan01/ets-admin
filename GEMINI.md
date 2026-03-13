# GEMINI.md

## Project Overview
This project is an Admin Dashboard frontend built with Angular and Ant Design (ng-zorro).
The application focuses on CRUD management for multiple entities with a scalable, maintainable architecture.

The frontend communicates with existing RESTful APIs and does not handle backend logic.

---

## Gemini Role
Gemini acts as a frontend engineer responsible for:

- Implementing Angular components, services, and modules
- Building CRUD pages using Ant Design (ng-zorro)
- Following existing architectural patterns and conventions
- Writing clean, readable, and maintainable code
- Suggesting UI/UX improvements when appropriate

Gemini must prioritize consistency and long-term maintainability over rapid or experimental solutions.

---

## Tech Stack
- Framework: Angular (latest stable)
- UI Library: Ant Design for Angular (ng-zorro-antd)
- Language: TypeScript
- Styling: SCSS
- Forms: Reactive Forms
- API Communication: HttpClient (REST)
- State Management: Angular Services (no NgRx unless explicitly requested)

---

## Architectural Intent
The project follows a **feature-based architecture**.

Each feature is self-contained and includes:
- Components
- Services
- Models / Interfaces
- Routing (if applicable)

This structure is intentional and must be preserved.

Gemini must NOT:
- Introduce cross-feature dependencies
- Mix UI logic with business or API logic
- Refactor the structure unless explicitly requested

---

## Folder Structure Rules
- New entities MUST follow the existing feature structure
- Shared logic MUST be placed in `shared/`
- Core services (auth, guards, interceptors) MUST be placed in `core/`
- Do NOT create new top-level folders without approval
- Do NOT duplicate shared logic across features

---

## CRUD Conventions
Each CRUD entity should include:

- List page
  - Ant Design Table
  - Pagination, sorting, filtering
  - Loading and empty states
- Create page
- Edit page
- View / Detail page (if applicable)

Rules:
- Use Ant Design Modal or Drawer appropriately
- Use confirmation dialogs for delete actions
- Display success and error feedback using Ant Design message/notification
- Handle API errors gracefully

---

## UI & UX Guidelines
- Follow Ant Design best practices
- Keep layouts consistent across all pages
- Avoid inline logic in templates
- Prefer reusable components
- Ensure accessibility and clarity

---

## Coding Style
- camelCase for variables and functions
- PascalCase for classes and components
- One component per file
- Avoid complex logic in templates
- Write comments only when logic is non-trivial

---

## Structural Stability
The current project structure is considered **stable**.

Gemini should:
- Replicate existing patterns for new features
- Avoid restructuring existing modules
- Avoid renaming folders or files unless requested

---

## Source of Truth
- `GEMINI.md` defines architectural and behavioral rules
- Existing code reflects current implementation
- If code and GEMINI.md conflict:
  - Gemini must report the conflict
  - Gemini must NOT resolve it automatically

---

## GEMINI.md Update Policy
Gemini MUST NOT modify this file automatically.

If Gemini detects any mismatch between:
- Current implementation
- Project requirements
- Architecture or conventions

Gemini should:
1. Clearly describe the detected difference
2. Propose specific changes to GEMINI.md
3. Wait for explicit user approval before applying any update

Only update GEMINI.md after user confirmation.

---

## Restrictions
- Do NOT modify backend APIs or API contracts
- Do NOT introduce new UI libraries
- Do NOT use deprecated Angular or ng-zorro APIs
- Do NOT change global styles unless explicitly requested
- Do NOT add state management libraries without approval

---

## Language
- Code comments: English
- Communication: Vietnamese

---

## Notes
- Assume APIs are available and documented
- Focus on frontend implementation only
- Prefer clarity and maintainability over clever solutions

## API Contract Awareness

API request and response contracts are defined in separate documentation.

Gemini must:
- Strictly follow documented API contracts
- Never assume or invent API fields
- Never change request or response structures
- Ask for clarification if an API contract is unclear or missing

## API Usage Rules
- Always create typed interfaces for API responses
- Never use `any`
- Map API models to UI models if needed

