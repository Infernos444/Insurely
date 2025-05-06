pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        VENV_DIR = "${env.BACKEND_DIR}/venv"
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
                dir(FRONTEND_DIR) {
                    echo 'Installing frontend dependencies...'
                    sh 'npm install'

                    echo 'Starting frontend...'
                    sh 'nohup npm start &'
                }
            }
        }

        stage('Setup Backend') {
            steps {
                dir(BACKEND_DIR) {
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
                dir(BACKEND_DIR) {
                    echo 'Running Tesseract OCR script...'
                    sh '''
                        . venv/bin/activate
                        python ocr_script.py
                    '''
                }
            }
        }
    }
}
