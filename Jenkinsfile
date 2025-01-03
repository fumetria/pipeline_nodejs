pipeline {
  agent any
  tools { nodejs 'Node'}
  environment {
    EXECUTOR = ""
    MOTIU = ""
    CHAT_ID = ""
    LINTER_RESULT= ""
    TEST_RESULT = ""
    UPDATE_README_RESULT = ""
    PUSH_CHANGES_RESULT = ""
  }
  parameters {
    string(name: 'executor', defaultValue: 'usuari', description: 'Nom de la persona que executa la pipeline')
    string(name: 'motiu', defaultValue: 'Ejecutant pipeline de Jenkins', description: 'Motiu pel qual estem executant la pipeline')
    string(name: 'chat_id', defaultValue: '000', description: 'ChatID de telegram al qual notificarem el resultat de cada stage executat')
  }
  stages {
    stage('Petició de dades') {
      steps {
        echo "Dades introduïdes son: \n EXECUTOR: ${params.executor} \n MOTIU: ${params.motiu} \n CHAT_ID: ${params.chat_id}"
      }
    }
    stage('Linter') {
      steps {
        sh "npm install"
        script {
          env.linter_status = sh(script: "npm run lint", returnStatus: true)
          if (env.linter_status != '0'){
            LINTER_RESULT = 'FAILURE'
          } else {
            LINTER_RESULT = 'SUCCESS'
          }
          echo "Linter_status: ${env.linter_status}"
          echo "El resultado del linter_stage es: ${LINTER_RESULT}."

        }
      }
    }
    stage('Test'){
      steps {
        script {
          env.test_status = sh(script: "npm test", returnStatus: true)
          if (env.test_status != '0'){
            TEST_RESULT = 'FAILURE'
          } else {
            TEST_RESULT = 'SUCCESS'
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
          env.update_readme_status = sh(script: "node './jenkinsScripts/index.js' ${TEST_RESULT}", returnStatus: true)
          if (env.update_readme_status != '0'){
            UPDATE_README_RESULT = 'FAILURE'
          } else {
            UPDATE_README_RESULT = 'SUCCESS'
          }
        }
      }
    }
    stage('Push_Changes'){
      steps{
        // withCredentials([usernamePassword(credentialsId: '7e1fdf2d-56bc-433b-859f-1047570ec6de', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]){
        //   sh "git config --global user.name ${GIT_USERNAME}"
        //   sh "git config --global user.password ${GIT_PASSWORD}"
        //   sh "git add ."
        //   sh "git commit -m 'Pipeline executada per ${params.executor}. Motiu: ${params.motiu}'"
        //   sh "git push --set-upstream origin ci_jenkins"
        // }
        script {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          withCredentials([usernamePassword(credentialsId: '7e1fdf2d-56bc-433b-859f-1047570ec6de', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
            env.push_changes_status = sh(script: "./jenkinsScripts/push_changes.sh ${GIT_USERNAME} ${GIT_PASSWORD} ${params.executor} ${params.motiu}", returnStatus: true)
            if (env.test_status != '0'){
              PUSH_CHANGES_RESULT = 'FAILURE'
            } else {
              PUSH_CHANGES_RESULT = 'SUCCESS'
            }
          }
        }
      }
      }
    }
  }
}

