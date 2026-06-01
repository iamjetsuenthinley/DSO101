# DSO101: Continuous Integration and Continuous Deployment

**BE in Software Engineering**  
Royal University of Bhutan, College of Science and Technology

**Student:** Pema Losel Maurer  
**Student ID:** 02240353

---

## Introduction

Continuous Integration (CI) and Continuous Deployment (CD) are popular practices used in modern software development to automate the building, testing, and deployment of applications. CI focuses on regularly merging and verifying code changes, while CD automates the delivery of those changes to a working environment.

This repository covers three practicals that build up CI/CD knowledge step by step — starting with basic Docker commands, then containerizing a Flask web application and publishing it to Docker Hub, and finally setting up Jenkins inside a Docker container.

---

## Practical 1: Exploring Basic Docker Commands

### Objective

Learn the basics of Docker by pulling images from Docker Hub, running containers, and understanding how containers behave when started, paused, or stopped.

### Tools Used

- Docker
- Docker Hub
- Terminal / Command Line

### Procedure

1. Pulled basic images (Ubuntu, Hello World) from Docker Hub.
2. Ran the Hello World container to verify Docker installation.
3. Ran the Ubuntu image in interactive mode to explore the container environment.
4. Used the `sleep` command to keep a container running for a set duration.
5. Ran containers in detached mode so the terminal remained free.
6. Checked which containers were running and which had stopped.
7. Stopped running containers, removed stopped containers, and deleted unused images.

### Result

Successfully used basic Docker commands to pull images, run containers in various modes, and clean up afterwards. This provided a solid foundation for the subsequent practicals.

---

## Practical 2: Containerizing a Flask Application and Publishing to Docker Hub

### Objective

Take a simple Python Flask web application, package it into a Docker container, run it locally on port 8080, and push the image to Docker Hub for public access.

### Tools Used

- Python / Flask
- Docker
- Docker Hub
- Localhost (port 8080)

### Procedure

**Step 1 – Creating the Flask Application**  
Created a simple Flask web application in Python to serve as the project to containerize and deploy.

**Step 2 – Writing the Dockerfile**  
Created a `Dockerfile` with the following configuration:
- Base image: lightweight Python 3.10
- Set a working directory inside the container
- Copied all project files into the container
- Installed Flask as a dependency
- Exposed port 8080
- Set the Flask app as the startup command

**Step 3 – Building and Running the Docker Image**  
Built the Docker image from the Dockerfile, then ran it as a container with port 8080 mapped from the container to the host. The Flask app was accessible in a browser at `localhost:8080`.

**Step 4 – Pushing the Image to Docker Hub**  
Tagged the image with the Docker Hub username and pushed it to the Docker Hub repository, making it publicly available.

### Result

The Flask application was successfully containerized, run locally on port 8080, and published to Docker Hub. This demonstrated how a real application can be packaged and shared — a core part of any CI/CD pipeline.

---

## Practical 3: Setting Up Jenkins with Docker and Persistent Local Storage

### Objective

Set up Jenkins inside a Docker container, expose it on port 8080, and mount a local folder as persistent storage so Jenkins data is preserved across container restarts and removals.

### Tools Used

- Docker
- Jenkins (LTS Docker image)
- Local file system (host folder)

### Procedure

**Step 1 – Pulling the Jenkins Docker Image**  
Pulled the official Jenkins LTS image from Docker Hub — the most stable and recommended version for general use.

**Step 2 – Creating a Local Folder for Jenkins Storage**  
Created a local folder named `jenkins_home` on the host machine to permanently store Jenkins data including jobs, settings, build history, and plugins. Without this, all data would be lost when the container is removed.

**Step 3 – Running the Jenkins Container with the Mounted Folder**  
Ran the Jenkins container in detached (background) mode with:
- Port 8080 exposed for browser access at `localhost:8080`
- The local `jenkins_home` folder mounted to Jenkins' internal storage path using a Docker volume mount
- A custom container name for easy management

> **Note:** Both the Flask application (Practical 2) and Jenkins use port 8080. Only one should run at a time to avoid a port conflict.

### Result

Jenkins was successfully installed and started inside a Docker container, accessible at port 8080. The mounted local folder ensured all Jenkins data persisted across container lifecycle events, providing a working CI/CD server ready for future automation.

---

## Conclusion

These three practicals built a clear understanding of CI/CD in practice:

- **Practical 1** — Learned Docker fundamentals and container lifecycle management.
- **Practical 2** — Containerized a real Flask app and shared it via Docker Hub, demonstrating image portability.
- **Practical 3** — Set up Jenkins with persistent storage inside Docker, the foundation for automated CI/CD pipelines.

The next step would be to write a `Jenkinsfile` that automatically builds, tests, and deploys the application whenever source code changes are pushed.