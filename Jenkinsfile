pipeline {
  agent none
  stages {
    stage('linter') {
      agent any
      steps {
        npm install
        npm run lint
      }
    }
    stage('test') {
      agent any
      steps {
        npm run build
        npm run start
        npm run cypress
      }
    }
  }
}
