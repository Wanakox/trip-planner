# Design Decisions

This document summarizes the main design decisions planned for Trip Planner.

---

## 1. Layered Architecture

The system follows a layered architecture to separate responsibilities clearly.

Expected backend layers:

```text
API routes
Service layer
Repository / DAO layer
Database models
Database
```

Benefits:

- Better maintainability.
- Easier testing.
- Reduced coupling.
- Clear separation between business logic and persistence.
- Easier future refactoring.

---

## 2. REST API

The backend exposes a REST API consumed by the frontend.

Main reasons:

- Simple and widely used communication model.
- Good fit for CRUD-based applications.
- Easy integration with frontend frameworks.
- Automatic documentation through FastAPI.

---

## 3. DAO Pattern

The DAO pattern is used to encapsulate database access.

Benefits:

- Keeps SQLAlchemy-specific logic away from business services.
- Makes persistence logic easier to test and replace.
- Reduces duplication in database operations.

---

## 4. DTO Pattern

DTOs are used to transfer data between layers and to the frontend.

Benefits:

- Avoid exposing internal persistence models directly.
- Improve API consistency.
- Make validation clearer.
- Reduce coupling between database entities and response objects.

In FastAPI, this role can be covered using Pydantic schemas.

---

## 5. JWT Authentication

JWT is planned for authentication and authorization.

Benefits:

- Stateless authentication.
- Suitable for REST APIs.
- Easy integration with frontend applications.
- Common approach in modern web applications.

---

## 6. Docker-Based Deployment

Docker and Docker Compose are used to run the full system.

Benefits:

- Reproducible environment.
- Easier local setup.
- Easier deployment on Raspberry Pi 5.
- Isolation between services.

---

## 7. Agile Process

The development process combines AUP and Scrumban ideas.

Planned approach:

- Incremental implementation.
- Prioritized backlog.
- Small development iterations.
- Continuous refinement of requirements.
- Technical documentation updated as the project evolves.

---

## 8. UI Design

Figma is planned for interface prototyping.

Material UI is selected to speed up frontend development and provide reusable components with a consistent visual style.