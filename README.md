# PLANT'D – Full-Stack Plant Management System

### Project Overview
PLANT'D is a modern MERN-stack application designed to help users manage their plant collections, track care schedules, and monitor plant health. This project was developed as a final submission for the **Software Construction & Development** course, focusing on full-stack integration, RESTful API design, and containerization.

---

## 🛠 Technology Stack
- **Frontend:** React.js (Create React App)
- **Backend:** Node.js & Express.js
- **Database:** MongoDB
- **Containerization:** Docker & Docker Compose
- **Media Storage:** Cloudinary API

---

## Project Structure
- `/frontend`: React application containing the user interface and routing.
- `/backend`: Node.js server handling RESTful APIs and MongoDB integration.
- `docker-compose.yml`: Orchestration file to run the database, backend, and frontend.
- `mongo-data/`: Local persistent storage for the MongoDB container.

---

## 🚀 Getting Started (Docker Execution)

Follow these instructions to build and run the application using Docker. 

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Virtualization enabled in BIOS.

### 2. Environment Setup
Create a `.env` file in the root directory and add the following (replace Cloudinary placeholders with your keys):
```env
MONGODB_URI=mongodb://mongodb:27017/plantd --OR-- your mongodb connection address.
JWT_SECRET=47f395142925a81c5e75826ce60632ff75c5798505a9bee2a54f04c921c04282
CLOUDINARY_CLOUD_NAME= Your Cloudinary Name
CLOUDINARY_API_KEY= Your Cloudinary API Key
CLOUDINARY_API_SECRET= Your Cloudinary API Secret Key

After creating this file, run command "docker compose up --build" in the terminal of the root folder of the project.