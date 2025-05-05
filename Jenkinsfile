pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Thirumalaivasangj3/Insurely.git'
            }
        }

        stage('Setup Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run build || echo "No build script defined for backend"'
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Run Tesseract Scripts') {
            steps {
                dir('tesseract') {
                    sh 'python3 ocr_script.py || echo "Replace with your actual OCR entry script"'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Run your tests here'
                // Example: sh 'npm test'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
