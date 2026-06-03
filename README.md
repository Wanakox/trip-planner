# Trip Planner

A full-stack web application for planning, organizing and tracking personal trips.

Trip Planner is designed to help users centralize the complete travel planning process in a single platform: destinations, dates, budgets, accommodation, transport, daily activities, checklists, notes, files, maps and travel memories.

The project is planned as a modern client-server application with a **React + TypeScript** frontend, a **FastAPI** backend, a **PostgreSQL** database and a **Docker-based deployment**.

> This project is currently under active design and development as my final degree project in Computer Engineering.

---

## Project Status

Current stage:

- [x] Project idea and scope defined
- [x] Main functional requirements identified
- [x] System architecture selected
- [x] Technology stack defined
- [x] Initial documentation prepared
- [ ] Database model implementation
- [ ] Backend API implementation
- [ ] Frontend implementation
- [ ] Docker Compose setup
- [ ] Deployment on Raspberry Pi 5

---

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Material UI |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL |
| Authentication | JWT |
| Maps | Leaflet, OpenStreetMap |
| Background Tasks | Redis, RQ |
| PDF Generation | WeasyPrint |
| Deployment | Docker, Docker Compose, Raspberry Pi 5 |
| Modeling & Design | UML, Figma, AUP, Scrumban |

---

## Main Features

### Trip Management

Users will be able to create, edit, logically delete and organize trips with information such as destination, dates, status, budget, transport, accommodation and travel documentation.

### Daily Planning

Each trip can be structured into daily plans, including activities, places to visit, descriptions and relevant notes.

### Budget and Expenses

The system will calculate minimum trip costs, track variable expenses and compare the real cost against the planned budget.

### Checklists

Users can create travel checklists and manage tasks by status and priority.

### Travel Memories

Completed trips can include notes, ratings, photos, files, maps and timelines.

### Search and Filtering

Trips can be searched and filtered by name, dates, destination, budget, duration, status and favorites.

### User Management

The application includes user registration, login, profile management, preferences and JWT-based authentication.

### Future Integrations

Planned integrations include Google Calendar for travel reminders and external flight search APIs such as Skyscanner or Kiwi.

---

## Architecture Overview

The system follows a decoupled client-server architecture:

```text
React + TypeScript SPA
        |
        | REST API
        v
FastAPI Backend
        |
        | SQLAlchemy ORM
        v
PostgreSQL Database
```

The application is planned to be deployed using Docker Compose, making the environment portable, reproducible and easier to run on a Raspberry Pi 5.

More details are available in [`docs/architecture/architecture.md`](docs/architecture/architecture.md).

---

## Planned Repository Structure

```text
trip-planner/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── docs/
│   ├── architecture/
│   ├── design/
│   ├── diagrams/
│   ├── references/
│   └── requirements/
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## Documentation

- [Functional Requirements](docs/requirements/features.md)
- [Architecture](docs/architecture/architecture.md)
- [Design Decisions](docs/design/design-decisions.md)

---

## Roadmap

- [x] Define project scope
- [x] Define main functional blocks
- [x] Select architecture and technology stack
- [ ] Design database schema
- [ ] Create backend project structure
- [ ] Implement user authentication with JWT
- [ ] Implement trip CRUD endpoints
- [ ] Create frontend project with React and Vite
- [ ] Implement main dashboard
- [ ] Connect frontend with backend API
- [ ] Add checklist and expense modules
- [ ] Add map visualization
- [ ] Add PDF export
- [ ] Dockerize the application
- [ ] Deploy on Raspberry Pi 5

---

## Why This Project?

The idea for this project comes from a real personal need: organizing trips during an Erasmus experience. Planning transport, accommodation, budgets, activities, documents and memories across different tools can become fragmented and difficult to manage.

Trip Planner aims to centralize the travel planning process in a single application while applying a clean, scalable and maintainable software architecture.

---

## What This Project Demonstrates

This project is intended to demonstrate practical software engineering skills, including:

- Full-stack web application design
- REST API architecture
- Relational database modeling
- Authentication and authorization
- Docker-based deployment
- Modular frontend and backend organization
- Technical documentation
- Requirements analysis
- Agile planning and iterative development

---

## Repository Description

```text
Full-stack travel planning web application built with React, FastAPI, PostgreSQL and Docker.
```

```text
react typescript fastapi python postgresql docker docker-compose sqlalchemy jwt-authentication material-ui leaflet openstreetmap full-stack rest-api travel-planner portfolio-project
```

---

## Author

**Juan García Moreno**  
Computer Engineering student  
GitHub: [@Wanakox](https://github.com/Wanakox)
