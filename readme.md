# 🧱 Microservices Architecture Project

This project follows a **microservices-based architecture** consisting of the following services:

- 🧑‍💼 `user-service`
- ✅ `task-service`
- 📣 `notification-service`
- 🗄️ MongoDB (Database)
- 📬 RabbitMQ (Message Broker)

Each service is containerized using **Docker**, and the entire system is orchestrated using **Docker Compose**.

---

## 🚀 How to Run This Project

Running this project manually without Docker can be complex and resource-intensive, requiring the installation of multiple dependencies and services individually.

The recommended approach is to use **Docker and Docker Compose**, which simplifies the process significantly.

---

### 🛠️ Prerequisites

1. **Install Docker Desktop & Docker Compose**  
   👉 [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Verify Docker Installation**

   Open a terminal or command prompt and run the following commands to verify that Docker and Docker Compose are installed correctly:

   ```bash
   docker --version
   docker compose version

3. **Clone Github Repository**
    ```bash
   git clone https://github.com/anukool23/task-management-microservice.git

4. **Navigate to folder/directory where Repository is cloned** 
    ```bash
    cd task-management-microservice

5. **From the directory of the project (where the docker-compose.yml file is located), run:** 
    ```bash
    docker compose up --build -d

This command will:
Build Docker images for all services
Start all containers in the background (-d)
Automatically set up MongoDB and RabbitMQ

6. **To stop the application**
    ```bash
   docker compose down

**Verifying Services**
MongoDB: Port 27017

RabbitMQ Dashboard: http://localhost:15672

Username: guest | Password: guest

User Service: http://localhost:3000

Task Service: http://localhost:3001

Notification Service: http://localhost:3002


## 📚 Useful Links
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Node.js Documentation](https://nodejs.org/en/docs)
