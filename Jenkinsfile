pipeline {
  agent any
  tools { nodejs 'Node'}
  stages {
    stage('Petició de dades') {
      input {
          message "Introdueix les següents dades: "
          ok "Enviar"
          parameters {
              string(name: 'EXECUTOR', defaultValue: 'usuari', description: 'nom de la persona que executa la pipeline')
              string(name: 'MOTIU', defaultValue: 'perque sí', description: 'motiu pel qual estem executant la pipeline')
              string(name: 'CHAT_ID', defaultValue: '000', description: 'ChatID de telegram al qual notificarem el resultat de cada stage executat')
          }
      }
      steps {
          echo "Benvingut ${EXECUTOR}."
      }
    }
    stage('Linter') {
      steps {
        sh "npm install"
        sh "npm run lint"
        script {
          def linter_status = sh (
            returnStdout: true
          ).trim()

          echo "El resultado del linter_stage es: ${linter_status}."

        }
      }
    }
    stage('Test'){
      steps {
        sh "npm test"
      }
    }
  }
}
