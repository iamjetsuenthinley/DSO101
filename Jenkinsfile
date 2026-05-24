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
                    credentialsId: 'github-creds'
            }
        }

        stage('Install Backend') {
            steps {
                sh 'cd JetsuenThinley_02250350_DSO101_A1/todo-app/backend && npm install'
            }
        }

        stage('Install Frontend') {
            steps {
                sh 'cd JetsuenThinley_02250350_DSO101_A1/todo-app/frontend && npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd JetsuenThinley_02250350_DSO101_A1/todo-app/frontend && npm run build'
            }
        }

        stage('Test Backend') {
            steps {
                sh 'cd JetsuenThinley_02250350_DSO101_A1/todo-app/backend && npm test'
            }
            post {
                always {
                    junit 'JetsuenThinley_02250350_DSO101_A1/todo-app/backend/junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.build('jetsuenthinley/todo-app:latest')
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        docker.image('jetsuenthinley/todo-app:latest').push()
                    }
                }
            }
        }
    }
}