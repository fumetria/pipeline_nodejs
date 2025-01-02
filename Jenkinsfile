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
        script{
          env.EXECUTOR = params.EXECUTOR
          env.MOTIU = params.MOTIU
        }
        echo "Benvingut ${EXECUTOR}."
      }
    }
    stage('Linter') {
      steps {
        sh "npm install"
        
        script {
          env.linter_status = sh(script: "npm run lint", returnStatus: true)
          if (env.linter_status != '0'){
            env.LINTER_RESULT = 'FAILURE'
          } else {
            env.LINTER_RESULT = 'SUCCESS'
          }
          echo "Linter_status: ${env.linter_status}"
          echo "El resultado del linter_stage es: ${env.LINTER_RESULT}."

        }
      }
    }
    stage('Test'){
      steps {
        script {
          env.test_status = sh(script: "npm test", returnStatus: true)
          if (env.test_status != '0'){
            env.TEST_RESULT = 'FAILURE'
          } else {
            env.TEST_RESULT = 'SUCCESS'
          }
        }
      }
    }
    stage('Build'){
      steps {
        sh "npm run build"
      }
    }
    stage('Update_Readme'){
      steps {
        script {
          env.update_readme_status = sh(script: "node './jenkinsScripts/index.js' ${env.TEST_RESULT}", returnStatus: true)
          if (env.update_readme_status != '0'){
            env.UPDATE_README_RESULT = 'FAILURE'
          } else {
            env.UPDATE_README_RESULT = 'SUCCESS'
          }
        }
      }
    }
    stage('Push_Changes'){
      steps{
        script{
          sh "git config user.email fulin789@gmail.com"
          sh "git config user.name Fu Jun"
          sh "git checkout ci_jenkins"
          sh "git add ."
          sh "git commit -m 'Pipeline executada per ${env.EXECUTOR}. Motiu: ${env.MOTIU}'"
        }
      }
    }
  }
}

