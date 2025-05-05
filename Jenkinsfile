pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Thirumalaivasangj3/Insurely.git'
            }
        }

        stage('Setup Backend') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
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
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                        python3 ocr_script.py || echo "Replace with your actual OCR entry script"
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Run your tests here'
                // Add actual test command like: sh 'pytest tests/'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                // Add deployment logic (e.g., Docker, systemctl, etc.)
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
