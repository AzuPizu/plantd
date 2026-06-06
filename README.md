# PLANT'D – Full-Stack Plant Management System

### Project Overview
PLANT'D is a modern MERN-stack application designed to help users manage their plant collections, track care schedules, and monitor plant health. This project was developed as a submission for the **Software Construction & Development** course, focusing on full-stack integration, RESTful API design, cloud deployment, and architectural separation.

---

## Live Deployments
The application is fully hosted in a decoupled cloud environment:
- **Frontend Client:** [https://plantd-app.vercel.app/](https://plantd-app.vercel.app/)
- **Backend Production API:** [https://plantd-kappa.vercel.app](https://plantd-kappa.vercel.app)

---

## Technology Stack
- **Frontend:** React.js (Create React App) & Tailwind CSS
- **Backend:** Node.js & Express.js (Deployed via Vercel Serverless Functions)
- **Database:** MongoDB Atlas (Cloud Cluster)
- **Media Storage:** Cloudinary API

---

## Project Structure
- `/frontend`: React application containing the user interface, state management, and view routing.
- `/backend`: Node.js server handling RESTful API endpoints, serverless route configuration, and MongoDB integration.
- `vercel.json`: Deployment configuration mapping for seamless serverless backend execution.

---

## Cloud Architecture & Production Setup
Instead of relying on a traditional stateful server environment, PLANT'D has been optimized for modern cloud native hosting:
1. **Serverless Backend:** The Express backend is configured using `vercel.json` to automatically compile into isolated, state-on-demand **Vercel Serverless Functions**.
2. **Global Database Network:** Connection pooling is managed securely via **MongoDB Atlas**, with dynamic network access configurations enabling seamless handling of cloud traffic.
3. **Decoupled Asset Management:** Plant images are uploaded directly to the **Cloudinary API**, removing heavy binary storage loads from the hosting server.

---

## Local Development (Optional Docker Execution)

For local testing, debugging, or grading purposes, the project still contains containerization assets to spin up an identical local environment.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Environment Setup
Create a `.env` file inside the `/backend` directory containing your respective local environment credentials (`MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

### 3. Execution
Run the following command in the absolute root directory of the project:
```bash
docker compose up --build