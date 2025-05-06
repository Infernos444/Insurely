pipeline {
    agent any

    environment {
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'

                    echo 'Starting frontend...'
                    sh 'nohup npm start &'
                }
            }
        }

        stage('Setup Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo 'Removing old venv if exists...'
                    sh 'rm -rf venv'

                    echo 'Creating new virtual environment...'
                    sh 'python3 -m venv venv'

                    echo 'Activating backend venv and installing requirements...'
                    sh '''
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Run Tesseract OCR Script') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo 'Running OCR script...'
                    sh '''
                        . venv/bin/activate
                        python ocr.py
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
