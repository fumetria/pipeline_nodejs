pipeline {
  agent none
  tools { nodejs 'Node'}
  stages {
    stage('linter') {
      agent any
      steps {
        sh 'npm install'
        sh 'npm run lint'
      }
    }
    stage('test') {
      agent any
      steps {
        sh 'npm run build'
        sh 'npm run cypress'
      }
    stage('build) {
      agent any
      steps{
        sh 'npm run start'
      }
    }
  }
}
