# Pràctica Jenkins

En aquesta pràctica aplicarem una sèrie de millores sobre un projecte creat amb next.js.

## Què és Jenkins?

![Jenkins logo](/public/Jenkins.png)

Servidor de codi obert que es pot utilitzar per automatitzar tot tipus de tasques relacionades amb la creació, prova i lliurament o implementació de programari.

Jenkins fa servir l'arquitectura mestre/esclau:

- Un node mestre s'encarrega de programar els treballs, assignar esclaus i enviar compilacions als esclaus per executar els treballs. També farà un seguiment de l'estat de l'esclau (fora de línia o en línia) i recuperarà les respostes dels resultats de la compilació dels esclaus i les mostrarà a l’eixida de la consola.
- Un node esclau rep peticions d'un node màster i executa els treballs de construcció que aquest li envia.

## Què farem en aquesta pràctica?

La pràctica consistirà en fer diversos stages dins d'un Jenkinsfile. Aquestos seran:

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

Comencem creant el nostre Jenkinsfile:

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
    string(name: 'chat_id', defaultValue: '172897049', description: 'ChatID de telegram al qual notificarem el resultat de cada stage executat')
  }
  stages {
```

- pipeline: Es la capçalera del nostre pipeline.
- agent: Fa referéncia a la màquina que ejecutarem el nostre entorn de Jenkins, en aquest cas any(qualsevol).
- tools: Indiquem les ferramentes adicionals que anem a utilitzar al nostre Pipeline, en aquest cas Node.
- enviroment: Ací crearem totes les nostres variables que anem a utilitzar en tot el pipeline.
- parameters: Són els paràmeters que defeneixen els inputs que anem a utilitzar.
- stages: Ací possarem tots els stages que anem a realitzar.

### Vista Build Monitor

Per a mostrar la vista de Build Monitor, primer anem a instal·lar el plugin de Build Monitor desde el gestor de plugins:
![Build monitor view plugin](/docs/img/Build_package.png)

Una vegada instal·lat, procedim a configurar-lo creant una nova vista:
![Configuració Build monitor view](/docs/img/Nueva_vista.png)
![Creació vista](/docs/img/Nueva_vista_2.png)

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
