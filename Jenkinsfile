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
    VERCEL_TOKEN = credentials('vercel_token')
    BOT_TOKEN = credentials('bot_token')
  }
  parameters {
    string(name: 'executor', defaultValue: 'usuari', description: 'Nom de la persona que executa la pipeline')
    string(name: 'motiu', defaultValue: 'Ejecutant pipeline de Jenkins', description: 'Motiu pel qual estem executant la pipeline')
    string(name: 'chat_id', defaultValue: '172897049', description: 'ChatID de telegram al qual notificarem el resultat de cada stage executat')
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
          env.update_readme_status = sh(script: "node './jenkinsScripts/add_badge.js' ${TEST_RESULT}", returnStatus: true)
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
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          withCredentials([usernamePassword(credentialsId: '7e1fdf2d-56bc-433b-859f-1047570ec6de', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
            //MODIFIQUEM PERMISSOS AL SCRIPT PER A PODER EJECUTARLO.
            sh "chmod +x ./jenkinsScripts/push_changes.sh"
            env.push_changes_status = sh(script: "./jenkinsScripts/push_changes.sh ${GIT_USERNAME} ${GIT_PASSWORD} ${params.executor} ${params.motiu}", returnStatus: true)
            if (env.test_status != '0'){
              PUSH_CHANGES_RESULT = 'FAILURE'
            } else {
              PUSH_CHANGES_RESULT = 'SUCCESS'
            }
          }
          echo "Push_changes Result: ${PUSH_CHANGES_RESULT}"
          }
        }
      }
    }
    stage('Deploy to Vercel'){
      steps{
        script{
          if(LINTER_RESULT == "SUCCESS" && TEST_RESULT == "SUCCESS" && UPDATE_README_RESULT == "SUCCESS" && PUSH_CHANGES_RESULT == "SUCCESS"){
            sh "npm i -g vercel"
            sh "vercel --yes --token ${VERCEL_TOKEN} --name pipeline-nodejs"
          }
        }
      }
    }
    stage('Notification'){
      steps{
        sh "node ./jenkinsScripts/notify_telegram.js ${params.chat_id} ${BOT_TOKEN} ${LINTER_RESULT} ${TEST_RESULT} ${UPDATE_README_RESULT} ${PUSH_CHANGES_RESULT}"
      }
    }
  }
}

