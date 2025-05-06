pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
        TESSERACT_DIR = 'tesseract'
        PYTHON = 'python3' // adjust to python3.10 or python3.12 if needed
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
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm install

                        echo "Starting frontend..."
                        nohup npm start > frontend.log 2>&1 &
                    '''
                }
            }
        }

        stage('Setup Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        echo "Creating virtual environment..."
                        ${PYTHON} -m venv venv

                        echo "Activating backend venv and installing requirements..."
                        source venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt

                        echo "Starting backend server..."
                        nohup venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
                    '''
                }
            }
        }

        stage('Run Tesseract OCR Script') {
            steps {
                dir("${TESSERACT_DIR}") {
                    sh '''
                        echo "Activating backend environment for OCR..."
                        source ../${BACKEND_DIR}/venv/bin/activate

                        echo "Running OCR script..."
                        python3 ocr_firebase.py
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
