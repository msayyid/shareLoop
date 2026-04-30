# ShareLoop

> A community item sharing platform — lend, swap, or give away things with your neighbours.

ShareLoop is a full-stack web application built for the **Software Engineering** module (CMP-N204-0) at the **University of Roehampton**. The project addresses the cost-of-living crisis and household waste by letting local residents share physical items with each other through three non-financial exchange modes: **lending**, **swapping**, and **giving away**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Team — Version 0.1](#team--version-01)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Continuous Integration](#continuous-integration)
- [Project Management](#project-management)
- [Sprint Progress](#sprint-progress)
- [Ethics & Academic Integrity](#ethics--academic-integrity)
- [AI Use](#ai-use)
- [License](#license)

---

## Overview

Many people buy items they only use once or twice — drills, ladders, textbooks, baby clothes, party outfits — and then leave them to gather dust or throw them away. At the same time, neighbours often have exactly what others need but no easy way to find each other.

ShareLoop creates a circular economy at the neighbourhood level by connecting people who **have** items with people who **need** them, at no financial cost to either party. Every exchange falls into one of three modes:

| Mode | What it means |
| --- | --- |
| **Lending** | Temporary borrowing. The item returns to the owner and to the platform's available pool when the request is marked complete. |
| **Swapping** | A permanent trade between two users. |
| **Giving away** | A free gift, no expectation of return. |

Each user has a public profile with a bio, location, listings, and a rating history that builds trust over time.

---

## Features

**Accounts & profiles**

- Registration and login with `bcrypt` password hashing
- Session-based authentication with route-level middleware protection
- Editable profile (name, bio, location, profile picture, password)
- Public user pages showing listings, average rating, and reviews

**Listings**

- Create, edit, delete listings with image upload (`multer`)
- Title, description, category, condition, exchange type, availability
- Ownership checks on every mutation route

**Discovery**

- Paginated browse pages for both listings and users
- Search by keyword, filter by exchange type / condition / availability / category, sort by recency
- Categories and tags navigation

**Request lifecycle**

- Request → Accept / Decline → Complete (or Cancel)
- Automatic decline of competing requests when one is accepted
- Lending requests automatically return the item to availability when completed
- Inbox views for both sides: *Requests Received* (owner) and *My Requests* (requester)

**Messaging**

- In-app chat tied to each request, with near-real-time updates via AJAX polling
- "Start a chat" without committing to a request, for pre-request questions
- Per-user chat list and unread state tracking

**Ratings & trust**

- 1–5 star rating with optional comment after a completed exchange
- Average rating and review history shown on every profile
- Database-level constraint preventing double-rating the same exchange

**Notifications**

- Generated for new requests, accepted/declined requests, and new messages
- Header dropdown with unread count, polled via AJAX
- Click-through to mark as read and navigate to the relevant page

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Pug templates
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Auth & sessions:** `bcryptjs`, `express-session`
- **File uploads:** `multer`
- **DevOps:** Docker, Docker Compose, GitHub Actions
- **Project management:** GitHub Projects (Kanban)

---

## Team — Version 0.1

| Name | Role | GitHub |
| --- | --- | --- |
| Mukhammadsaiid Norbaev | Backend / Coordinator | [@msayyid](https://github.com/msayyid) |
| Azlan Rashid | Frontend | [@azlanr1](https://github.com/azlanr1) |
| Eyob Mamo Abebe | Database | [@eyobabebe93](https://github.com/eyobabebe93) |
| Suphachok Salee | Organisation / Documentation | [@kimmi007](https://github.com/kimmi007) |

**Communication**

- Primary: WhatsApp
- Backup: University of Roehampton email
- Stand-ups: weekly during scheduled lab time

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git
- (Optional, for local non-Docker testing) Node.js 20+

### Run with Docker

```bash
git clone https://github.com/msayyid/shareLoop.git
cd shareLoop/pg-sd2
docker-compose up
```

Once the containers are up:

- App: <http://localhost:3000>
- MySQL: `localhost:3306`

All four team members have run the project successfully through Docker on their own machines.

### Stopping

```bash
docker-compose down
```

---

## Project Structure

```
shareLoop/
├── .github/
│   └── workflows/
│       └── node.yml             # Node CI workflow
├── pg-sd2/                      # Application root
│   ├── app.js                   # Express app entry point, routes, middleware
│   ├── package.json
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── app/
│   │   ├── views/               # Pug templates
│   │   └── static/
│   │       ├── css/
│   │       ├── js/
│   │       └── images/
│   │           ├── listings/    # Listing photos uploaded by users
│   │           └── profiles/    # Profile pictures
│   ├── models/                  # Data access layer
│   │   ├── user.js
│   │   ├── listing.js
│   │   ├── category.js
│   │   ├── request.js
│   │   ├── rating.js
│   │   ├── message.js
│   │   └── notification.js
│   └── services/
│       └── db.js                # MySQL connection / query helper
└── README.md
```

---

## Continuous Integration

A GitHub Actions workflow named **Node CI** runs automatically on every push and pull request targeting `main`. The workflow:

1. Checks out the repository
2. Sets up Node.js 20
3. Installs dependencies with `npm install`
4. Runs a basic build verification step

See [`.github/workflows/node.yml`](.github/workflows/node.yml) for the full configuration.

---

## Project Management

We use a **Scrum-style** workflow with weekly stand-ups and four sprints. Tasks live on a public GitHub Projects Kanban board.

- **Kanban board:** <https://github.com/users/msayyid/projects/2/views/1>
- Columns: Backlog → To Do → In Progress → Ready → In Review → Done

---

## Sprint Progress

- ✅ **Sprint 1** — Setup & Planning (repo scaffolding, project description, personas, code of conduct, Docker dev environment)
- ✅ **Sprint 2** — Requirements & Design (user stories, use case diagram, ERD, wireframes, activity diagrams)
- ✅ **Sprint 3** — Core Development (database schema, listings list/detail, users list/profile, categories, tags)
- ✅ **Sprint 4** — Advanced Features (auth, full request lifecycle, in-app messaging, ratings & trust, notifications, search & filter, profile management, CI workflow)

---

## Ethics & Academic Integrity

The project considers ethical issues throughout, including:

- **Privacy & data protection** in line with UK GDPR — minimal personal data, hashed passwords, location stored only at area level
- **User safety & trust** — ratings system, ownership checks, restriction of message access to participants of a request
- **Accessibility & inclusion** — clear navigation, age-agnostic design, no financial barrier to participation
- **Fair participation** — no monetisation; the platform is co-operative by design

---

## AI Use

In line with the module's AI policy, AI tools have been used only for:

- Debugging
- Explanation of unfamiliar concepts
- Writing assistance for documentation

AI has **not** been used to generate complete features. All submitted code is fully understood by the contributors who authored it.

---

## License

This project is developed for educational purposes only as part of the University of Roehampton Software Engineering module (CMP-N204-0). It is not licensed for commercial use.
