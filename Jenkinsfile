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
        
        script {
          env.linter_status = sh(script: "npm run lint", returnStatus: true)
          if (env.linter_status == 0){
            env.LINTER_RESULT = 'SUCCESS'
          } else {
            env.LINTER_RESULT = 'FAILURE'
          }
          echo "Linter_status: ${env.linter_status}"
          echo "El resultado del linter_stage es: ${env.LINTER_RESULT}."

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
