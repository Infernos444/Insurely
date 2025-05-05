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
                        pip install -r requirements.txt || echo "No requirements.txt found"
                    '''
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Run Tesseract Scripts') {
            steps {
                dir('tesseract') {
                    sh '''
                        python3 ocr_script.py || echo "Replace with your actual OCR entry script"
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Run your tests here'
                // Example: sh 'pytest' or similar
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                // You can add actual deployment commands here.
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
