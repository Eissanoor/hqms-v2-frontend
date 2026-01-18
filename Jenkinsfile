pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']], 
                    extensions: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'Wasim-Jenkins-Credentials', 
                        url: 'https://github.com/Wasim-Zaman/qms-v2-frontend.git'
                    ]],
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies for QMS V2 Frontend..."
                bat 'npm ci' 
            }
        }

        stage('Generate Build') {
            steps {
                echo "Generating build for QMS V2 Frontend..."
                bat 'npm run build' 
            }
        }

         stage('Create web.config') {
            steps {
                script {
                    def webConfigContent = '''<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Router" stopProcessing="true">
          <match url="^(?!.*\\.\\w{2,4}$)(.*)$" />
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>'''

                    writeFile(file: 'dist/web.config', text: webConfigContent)
                }
            }
        }
    }
}
