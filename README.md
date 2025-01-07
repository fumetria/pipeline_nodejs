RESULTAT DELS ÚLTIMS TESTS AMB JEST:  ![Test result badge](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg) 
# Pràctica Jenkins

En aquesta pràctica aplicarem una sèrie de millores sobre un projecte creat amb next.js.

## Què és Jenkins?

![Jenkins logo](/public/Jenkins.png)

Servidor de codi obert que es pot utilitzar per automatitzar tot tipus de tasques relacionades amb la creació, prova i lliurament o implementació de programari.

Jenkins fa servir l'arquitectura mestre/esclau:

- Un node mestre s'encarrega de programar els treballs, assignar esclaus i enviar compilacions als esclaus per executar els treballs. També farà un seguiment de l'estat de l'esclau (fora de línia o en línia) i recuperarà les respostes dels resultats de la compilació dels esclaus i les mostrarà a l’eixida de la consola.
- Un node esclau rep peticions d'un node màster i executa els treballs de construcció que aquest li envia.

## Què farem en aquesta pràctica?

La pràctica consistirà en crear un pipeline que durà a terme diversos stages dins d'un Jenkinsfile. Aquestos seran:

- Instal·lar plugin Build Monitor i configurar-lo per a que ens mostre una vista amb totes les tasques ejecutades amb Jenkins.
- Petició de dades stage: En aquest stage demanarem tres valors per pantalla.
- Linter stage: Aquest job analitzarà el nostre codi amb l'objectiu de detectar errors, problemes de format, bones pràctiques i inconsistències segons un conjunt de regles predefinides o configurables.
- Test stage: Ejecutarà els tests que tenim preparats dins del nostre repositori i els implementarem amb Jest per a que ens diga si passaen o no les proves.
- Build stage: Realitzarà el build del projecte per a tindre una versió empaquetada del mateix que posteriorment utilitzare'm per a publicar en Vercel.
- Update_readme stage: Actualitzarem el nostre readme amb una insignia del resultat dels tests realitzats.
- Push_Changes stage: Mitjançant un script farem commit i push al nostre repositori.
- Deploy to Vercel stage: Mitjançant un script publicarem el nostre projecte a la plataforma de Vercel.
- Notify stage: S'encarregarà d'enviar un missatge al bot de telegram per a que ens avise del resultat de tots els stage anteriors.

## Resolució

Comencem creant el nostre Pipeline, fem click en Nueva Tarea i anem omplint els camps necessaris que ens demanen.

![Clic en Nueva Tarea](/docs/img/Nueva_tarea.png)

Posem un titol al pipeline i sel·leccionem pipeline

![Pantalla creació tarea nova](/docs/img/Nueva_tarea_2.png)

Una vegada creat el pipeline, anem a configurar-lo. Procedim a anar al apartat Pipeline i afegim els següents valors:

- Definition: Pipeline script from SCM
- SCM: Git
- Repository URL: Url al nostre repositori
- Credentials: Les credencials que hem afegit anteriorment en la configuració de Jenkins amb les dades d'accés a GitHub
- Branch Specifier: \*/ci_jenkins (El demanat per l'enunciat)
- Script Path: Jenkinsfile (nom del nostre arxiu de pipeline)

![Nova tarea 1](/docs/img/Nueva_tarea_3.png)
![Nova tarea 2](/docs/img/Nueva_tarea_4.png)

Una vegada creat el Pipeline, procedim a crear una vista amb el plugin Build Monitor.

### Vista Build Monitor

Per a mostrar la vista de Build Monitor, primer anem a instal·lar el plugin de Build Monitor desde el gestor de plugins:
![Build monitor view plugin](/docs/img/Build_package.png)

Una vegada instal·lat, procedim a configurar-lo creant una nova vista:
![Configuració Build monitor view](/docs/img/Nueva_vista.png)
![Creació vista](/docs/img/Nueva_vista_2.png)
![Build Monitor View](/docs/img/Build_Monitor.png)

### Creació del Jenkinsfile

Ara anem a crear el nostre Jenkinsfile que posteriorment putjarem a GitHub per a després ejecutar desde Jenkins.

```Groovy

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
    string(name: 'chat_id', defaultValue: '111111111', description: 'ChatID de telegram al qual notificarem el resultat de cada stage executat')
  }
  stages {
```

- pipeline: Es la capçalera del nostre pipeline.
- agent: Fa referéncia a la màquina que ejecutarem el nostre entorn de Jenkins, en aquest cas any(qualsevol).
- tools: Indiquem les ferramentes adicionals que anem a utilitzar al nostre Pipeline, en aquest cas Node.
- enviroment: Ací crearem totes les nostres variables que anem a utilitzar en tot el pipeline.
- parameters: Són els paràmeters que defeneixen els inputs que anem a utilitzar.
- stages: Ací possarem tots els stages que anem a realitzar.

### Dades introduïdes

En aquest stages ens dirà quins són els paràmetres que ha indicat l'usuari.

```Groovy

    stage('Petició de dades') {
      steps {
        echo "Dades introduïdes son: \n EXECUTOR: ${params.executor} \n MOTIU: ${params.motiu} \n CHAT_ID: ${params.chat_id}"
      }
    }

```

### Linter stage

```Groovy

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
        }
      }
    }
```

- steps->sh "npm install": Instal·larà les dependencies del nostre projecte node.
- steps->script: Ejecutarà el comando npm run lint per a que ejecute el Linter per a que busque possibles errors.
  - returnStatus:true : Amb aquest paràmetre ens donarà un valor segons el resultat del Linter.
  - if env.linter_status!= 0 : Amb aquest condicional, assignarem el valor Failure o Success segons si ha fallat o no el nostre Linter a la variable LINTER_RESULT.

Al ejecutar per primera vegada el linter, vorem que ens dona error:

![Linter error in pipeline](/docs/img/Lint_error.png)
![Linter error file](/docs/img/Linter_errors.png)

Com podem observar, l'arxiu _[id].js_ a la ruta _./pages/api/users/_ ens dona error. Procedim a corregir-lo:
![Fix linter errors](/docs/img/Linter_errors_fix.png)
El Linter te la regla de doble cometes, per tant, procedim a canviar les cometes simples per dobles.

### Test stage

```Groovy

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

```

- steps->script: Ejecutarà el comando npm test per a que ejecute els tests fets amb Jest.
  - returnStatus:true : Amb aquest paràmetre ens donarà un valor segons el resultat dels tests.
  - if env.test_status!= 0 : Amb aquest condicional, assignarem el valor Failure o Success segons si ha fallat o no el nostre test a la variable TEST_RESULT.

### Build stage

```Groovy

stage('Build'){
      steps {
        sh "npm run build"
      }
    }

```

- steps->sh: Farem un npm run build per a que ens empaquete tot el repositori per a poder després publicar-lo a Vercel.

### Update readme

```Groovy
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
```

Mitjançant un script de la nostra carpeta jenkinsScripts, inserirem una insignia que representa el resultat dels tests realitzats.

- steps->script: Ejecutarà el comando _node './jenkinsScripts/add_badge.js ${TEST_RESULT}_ per a que ejecute el nostre script.
  - returnStatus:true : Amb aquest paràmetre ens donarà un valor segons el resultat del script.
  - if env.test_status!= 0 : Amb aquest condicional, assignarem el valor Failure o Success segons si ha fallat o no el nostre script a la variable UPDATE_README_RESULT.

_add_badge.js_

```Javascript

const fs = require("node:fs/promises");

async function main() {

    try {
        const test_result = process.argv[2];
        const imgFail = "https://img.shields.io/badge/test-failure-red";
        const imgSuccess = "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg";
        const badge = test_result === "SUCCESS" ? imgSuccess : imgFail;
        const textBadge = `RESULTAT DELS ÚLTIMS TESTS AMB JEST:  ![Test result badge](${badge}) \n`;
        const docsText = await fs.readFile("./docs/activitat_jenkins.md", "utf8");
        await fs.writeFile("./README.md", textBadge);
        await fs.appendFile("./README.md", docsText);
        process.exit(0);
    } catch (error) {
        return error;
    }
}

main();

```

En aquest codi, utilitzarem la dependència de proccess per a agafar l'argument ${TEST_RESULT} que hem afegit i la dependència de fs.promises per a manipular els arxius. Com que la funció fs.writeFile() sobreescriu l'arxiu, anem a fer un fs.appendFile() per a afegir aquesta documentació al README i no es borre cada vegada que s'ejecute aquesta action.

### Push changes

```Groovy

stage('Push_Changes'){
    steps{
        script {
            withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                //MODIFIQUEM PERMISSOS AL SCRIPT PER A PODER EJECUTARLO.
                sh "chmod +x ./jenkinsScripts/push_changes.sh"
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

```

- script->withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]): Injectem les credencials de github al stage. D'aquesta forma evitem que ens aparega el següent error:
  ![Error autenticació](/docs/img/Error_git_push.png)
- sh "chmod +x ./jenkinsScri...: Modifiquem permisos del nostre script per a evitar problemes d'accés.
- steps->script: Ejecutarà el comando _node './jenkinsScripts/push_changes.sh ${GIT_USERNAME} ${GIT_PASSWORD} ${params.executor} ${params.motiu}'_ per a que ejecute el nostre script.
  - returnStatus:true : Amb aquest paràmetre ens donarà un valor segons el resultat del script.
  - if env.push_changes_status!= 0 : Amb aquest condicional, assignarem el valor Failure o Success segons si ha fallat o no el nostre script a la variable PUSH_CHANGES_RESULT.

_push_changes.sh_

```Shell

#!/bin/bash

git config --global user.name $1
git config --global user.password $2
git add .
git commit -m "Pipeline executada per '$3'. Motiu: '$4'"
git push https://$1:$2@github.com/$1/pipeline_nodejs.git HEAD:ci_jenkins

```

Utilitzant els paràmetres que hem afegit al comando, injectem el nostre usuari i contraseña de GitHub i les variables EXECUTOR i MOTIU als comandos de Git.

### Deploy to Vercel

```Groovy

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
```

- steps->script{if...}: Soles ejecutarà el nostre script per a desplegar en Vercel si les variables de _X_RESULT_ són igual a SUCCESS
- sh "npm i -g vercel": Instal·lem dependéncies de Vercel
- sh "vercel --yes --token ${VERCEL*TOKEN} --name pipeline-nodejs": Despleguem el repositori al projecte que hem creat anteriorment en Vercel \_pipeline-nodejs* amb el token de Vercel que hem creat anteriorment a Vercel.

![Despliegue Vercel](/docs/img/Vercel.png)

### Notify

```Groovy

    stage('Notification'){
      steps{
        sh "node ./jenkinsScripts/notify_telegram.js ${params.chat_id} ${BOT_TOKEN} ${LINTER_RESULT} ${TEST_RESULT} ${UPDATE_README_RESULT} ${PUSH_CHANGES_RESULT}"
      }
    }
```

- steps{sh "node...}: Ejecutem el nostre script per a enviar una notificació desde el bot de Telegram que hem creat anteriorment amb el bot-gestor de BotFather. Afegim les següents variables:
  - params.chat_id: ChatID on eviem els missatges del nostre bot.
  - BOT_TOKEN: Token d'accés al nostre bot.
  - LINTER_RESULT: Resultat del linter stage.
  - TEST_RESULT: Resultat del test stage.
  - UPDATE_README_RESULT: Resultat del update readme stage.
  - PUSH_CHANGES_RESULT: Resultat del push changes stage.

_notify_telegram.js_

```Javascript

const TelegramBot = require("node-telegram-bot-api");
const chatID = process.argv[2];
const botToken = process.argv[3];
const bot = new TelegramBot(botToken, { polling: true });
const message = `
S'ha executat la pipeline de jenkins amb els següents resultats:
- Linter_stage: ${process.argv[4]}
- Test_stage: ${process.argv[5]}
- Update_readme_stage: ${process.argv[6]}
- Deploy_to_Vercel_stage: ${process.argv[7]}
`;
bot.sendMessage(chatID, message)
    .then(data => {
        console.log("Telegram sended");
        process.exit(0);
    })
    .catch(e => process.exit(1));

```

![Missatge bot Telegram](/docs/img/Resultat_pipeline_Telegram.png)

Com podem observar, hem rebut la notificació del bot amb els resultats dels stages.
