pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/iamjetsuenthinley/DSO101.git',
                    credentialsId: '5b343e20-8e3e-4321-be03-1f15c12019ba'
            }
        }

        stage('Install Backend') {
            steps {
                bat 'cd JetsuenThinley_02250350_DSO101_A1\\todo-app\\backend && npm install'
            }
        }

        stage('Install Frontend') {
            steps {
                bat 'cd JetsuenThinley_02250350_DSO101_A1\\todo-app\\frontend && npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'cd JetsuenThinley_02250350_DSO101_A1\\todo-app\\frontend && npm run build'
            }
        }

        stage('Test Backend') {
            steps {
                bat 'cd JetsuenThinley_02250350_DSO101_A1\\todo-app\\backend && npm test'
            }
            post {
                always {
                    junit 'JetsuenThinley_02250350_DSO101_A1/todo-app/backend/junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u jetsuenthinley -p iamgonnabecomeaking@1424'
                    bat 'docker build -t jetsuenthinley/todo-app-backend:latest -f JetsuenThinley_02250350_DSO101_A1\\todo-app\\backend\\Dockerfile JetsuenThinley_02250350_DSO101_A1\\todo-app'
                    bat 'docker build -t jetsuenthinley/todo-app-frontend:latest JetsuenThinley_02250350_DSO101_A1\\todo-app\\frontend'
                    bat 'docker push jetsuenthinley/todo-app-backend:latest'
                    bat 'docker push jetsuenthinley/todo-app-frontend:latest'
                }
            }
        }
    }
}