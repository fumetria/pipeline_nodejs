# Pràctica - GitHub Actions

En aquesta pràctica aplicarem una sèrie de millores sobre un projecte creat amb next.js que trobarem al següent [link](https://github.com/antoni-gimenez/nodejs-blog-practica.git).

## Què és GitHub Actions?

**GitHub Actions** és una funcionalitat de GitHub que et permet <ins>automatitzar tasques</ins> en els teus projectes de programació, com ara el desplegament, les proves, la compilació i altres fluxos de treball. És una eina d’integració contínua i lliurament continu (CI/CD) directament integrada a GitHub.

## Què farem en aquesta pràctica?

La pràctica consistirà en fer diversos jobs dins d'un workflow. Aquestos seran:

- Linter job: Aquest job analitzarà el nostre codi amb l'objectiu de detectar errors, problemes de format, bones pràctiques i inconsistències segons un conjunt de regles predefinides o configurables.

- Cypress job: Aquest job té com a finalitat ejecutar proves sobre uns test que tenim dins del repositori.

- Modify readme job: Aquest job té com a finalitat modificar el nostre README.md per a que incorpore l'emblema amb el resultat dels tests fets al Cypress job:

- Deploy job: Amb aquest job buscarem desplegar el nostre projecte a la web de Vercel.

- Notification job: Aquest job s'encarregarà de notificar-mos mitjançant un email amb els resultats de tots els jobs d'aquest GitHub Action.

Per últim, modificarem el nostre perfil amb metriques de GitHub.

## Resolució

Comencem creant el nostre workflow.yml:

```OASv2-yaml

name: fumetria_workflow

on:
  push:
    branches:
      - main

jobs:

```

- name: nom del nostre workflow
- on: asignem quan s'ejecuta el nostre workflow
- jobs: ací posarem tots els nostres jobs

Ara anem a afegir els jobs:

### Linter job

```OASv2-yaml

linter_job:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install npm dependencies
        run: npm install

      - name: Run linter
        run: npm run lint

```

- linter_job: nom del job
- runs-on: assignem el runner que volem que ejecute, en aquest cas _ubuntu-latest_
- steps: passos a realitzar
  - Checkout code: acció que permet que descarregue el codi del repositori al entorn on s'esta ejecutant el workflow.
  - Install npm dependencies: fem un _npm install_ per activar les llibreries que anem a utilitzar.
  - Run linter: ejecutem l'script del lint amb un _npm run lint_

Al arrancar per primera vegada el nostre script de linter, vorem que ens dira GitHub que tenim errors:

![error GitHub Action](/docs/img/error_linter_1.png)

Per tant, procedirem a corregir els errors que ens indica el log. Comencem per el primer error a la ruta **./pages/api/users/[id].js**:

![correcció arxiu id.js](/docs/img/error_linter_2.png)

Com ens deia el log del linter, els strings tenen que anar amb doble " i no amb una '. A la linea 18 ens diu que no pot hi haure cap var, amb la qual cosa la canviem per let.

Després passem al segon error ./pages/api/users/index.js:

![correcció arxiu index.js](/docs/img/error_linter_3.png)

Com ens deia el log del linter, els strings tenen que anar amb doble " i no amb una '. A la linea 11 ens diu que la clausula default ha de ser la ultima del switch, per tant, posem el default al final del switch.

Amb estes correccions fetes, ja no tindrem cap error amb aquest job.

### Cypress job

```OASv2-yaml

needs: linter_job
    runs-on: ubuntu-latest

    steps:
      #step 1
      - name: Checkout code
        uses: actions/checkout@v4

      #step 2
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
          wait-on: "http://localhost:3000"
        id: cypress
        continue-on-error: true

      - name: Save test result
        run: echo "${{ steps.cypress.outcome }}" > result.txt

      #step 3
      - name: Create artifact
        uses: actions/upload-artifact@v4
        with:
          name: result.txt
          path: .

```

- needs: indica que ha de esperar al job anterior per a poder ejecutarse, en este cas el linter job.
- steps:
  - Cypress run: Aquest job s'encarregarà d'ejecutar l'action per realitzar els test desitjats.
    - with: Ací indiquem certes variables per a arrancar l'action.
      - build: per a que ejecute el nostre script build.
      - start: per a que ejecute el nostre script start.
    - id: assignem una id a aquest step per a poder accedir posteriorment a les dades d'aquest step.
    - continue-on-error: Per a que continue el nostre workflow encara que falle una part.
  - Save result: accedim al resultat del Cypress run i el guardem dins del fixer result.txt
  - Create artifact: Crea un artefact i el puja, per a posteriorment poder descarregar-lo.

Amb aquesta configuració, tots els test ens donen com a bo.

![Cypress test result](/docs/img/cypress_result.png)

### Modify readme job

```OASv2-yaml

modify_readme_job:
    needs: cypress_job
    runs-on: ubuntu-latest
    continue-on-error: true

    steps:
      #step 1
      - name: Checkout code
        uses: actions/checkout@v4

      #step 2
      - name: Get artifact
        uses: actions/download-artifact@v4
        with:
          name: result.txt

      #step 3
      - name: Set output
        run: echo "::set-output name=cypress_outcome::$(cat result.txt)"
        id: cypress_outcome

      #step 4
      - name: Add badge test result
        uses: ./.github/actions/add_badge_action
        with:
          test_result: ${{steps.cypress_outcome.outputs.cypress_outcome}}

      #step 5
      - name: Commit and Push changes
        uses: EndBug/add-and-commit@v9
        with:
          add: .
          author_name: ${{ secrets.GIT_NAME }}
          author_email: ${{ secrets.GIT_EMAIL }}
          message: "Update test badge result"
          push: true

```

- steps:
  - Get artifact: Recupera l'artefacte creat anteriorment i el guarda com a result.txt
  - Set output: Extrau el resultat dels tests i el guarda en una variable.
  - Add badge test result: Acì introduïrem el resultat del cypress test com a input en una acció on segons el resultat afegirà al README una imatge o altra.

```OASv2-yaml

name: add_badge_action
description: "Adding a badge on readme.MD for test result"
inputs:
  test_result:
    description: "Test result"
    required: true
runs:
  using: "node20"
  main: src/dist/index.js

```

- name: nom de la action.
- description: descripció de la action.
- input: ací posem les variables que anem a introduïr dins de la action.
- runs: entorn amb el cual anem a traballar, en aquest cas utilitzarem node i l'arxiu principal es troba _src/dist/index.js_.

```JavaScript

const core = require('@actions/core');
const fs = require('fs').promises;

async function main() {

    try {
        const testResult = core.getInput('test_result');
        const imgFail = 'https://img.shields.io/badge/test-failure-red';
        const imgSuccess = 'https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg';
        const badge = testResult === 'success' ? imgSuccess : imgFail;
        const textBadge = `RESULTAT DELS ÚLTIMS TESTS \n ![Test result badge](${badge}) \n`;
        const docsText = await fs.readFile('./docs/activitat_gh_actions.md', 'utf8');
        await fs.writeFile('./README.md', textBadge);
        await fs.appendFile('./README.md', docsText);
        process.exit(0);
    } catch (error) {
        core.setFailed(error);
    }

};

main();

```

En aquest codi, utilitzarem la dependència de _@actions/core_ per a agafar els inputs que afegim i la dependència de _fs.promises_ per a manipular els arxius. Com que la funció _fs.writeFile()_ sobreescriu l'arxiu, anem a fer un _fs.appendFile()_ per a afegir aquesta documentació al README i no es borre cada vegada que s'ejecute aquesta action. A més farem un _npm run build_ per a que ens empaquete tot el codi JavaScript del action juntament amb les seves dependències en un únic fitxer.

- Commit and push change: aquest step farà un commit amb els canvis realitzats i farà push automàticament a GitHub.

### Deploy job

```OASv2-yaml

  deploy_job:
    needs: cypress_job
    runs-on: ubuntu-latest
    continue-on-error: true

    steps:
      #step 1
      - name: Checkout code
        uses: actions/checkout@v4
      #step 2
      - name: Deploy in Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }} # Required
          vercel-args: "--prod" #Optional
          vercel-org-id: ${{ secrets.ORG_ID}} #Required
          vercel-project-id: ${{ secrets.PROJECT_ID}} #Required

```

- Deploy in Vercel: Aquest job s'encarregarà de desplegar el nostre projecte al servidor de Vercel.

Per a realitzar aquest job, primerament tindrem que registrar-nos a la plataforma Vercel i generarem un token per a la variable VERCEL_TOKEN.
Desde l'arrel del projecte instal·larem Vercel al projecte per a que ens genere les variables ORG_ID i PROJECT_ID.

![Inicialitzador de Vercel](/docs/img/vercel_init.jpg)

Les variables les trobarem a la carpeta _./vercel_ que ens ha generat. Amb açò fet podrem vorer el nostre projecte desplegat a Vercel quan s'ejecute la action:

![Projecte desplegat a Vercel](/docs/img/deploy_job_vercel.png)

### Notification job

```OASv2-yaml

  notificacion_job:
    needs:
      - linter_job
      - cypress_job
      - deploy_job
      - modify_readme_job
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install

      - name: Send email
        uses: ./.github/actions/send_email_action
        with:
          MAIL_USERNAME: ${{ secrets.MAIL_USERNAME }}
          MAIL_PASSWORD: ${{ secrets.MAIL_PASSWORD }}
          OAUTH_CLIENTID: ${{ secrets.OAUTH_CLIENTID }}
          OAUTH_CLIENT_SECRET: ${{ secrets.OAUTH_CLIENT_SECRET }}
          OAUTH_REFRESH_TOKEN: ${{ secrets.OAUTH_REFRESH_TOKEN }}
          linter_job_result: ${{ needs.linter_job.result }}
          cypress_job_result: ${{ needs.cypress_job.result }}
          modify_readme_job_result: ${{ needs.modify_readme_job.result }}
          deploy_job_result: ${{ needs.deploy_job.result }}

```

- needs: necessitarem de tots els jobs anterior per a poder accedir a les dades que han donat com a _result_.
- Send email: utilitzan la dependència de nodemailer de Node podem configurar un servidor node per a que ens envie un email amb els resultats dels jobs anteriors.

```OASv2-yaml

name: send_email_action
description: "Action for send a notification to the user"
inputs:
  MAIL_USERNAME:
    description: "User email"
    required: true
  MAIL_PASSWORD:
    description: "User password"
    required: true
  OAUTH_CLIENTID:
    description: "Client ID"
    required: true
  OAUTH_CLIENT_SECRET:
    description: "Client secret"
    required: true
  OAUTH_REFRESH_TOKEN:
    description: "Client refresh token"
    required: true
  linter_job_result:
    description: "Linter job result"
    required: true
  cypress_job_result:
    description: "cypress job result"
    required: true
  modify_readme_job_result:
    description: "modify readme job result"
    required: true
  deploy_job_result:
    description: "deploy result"
    required: true
runs:
  using: "node12"
  main: src/dist/index.js

```

Al action.yml especificarem totes les varibles que anem a introduir al nostre fitxer index.js.

```Javascript

async function main() {

    try {
        const MAIL_USERNAME = core.getInput('MAIL_USERNAME');
        const MAIL_PASSWORD = core.getInput('MAIL_PASSWORD');
        const OAUTH_CLIENTID = core.getInput('OAUTH_CLIENTID');
        const OAUTH_CLIENT_SECRET = core.getInput('OAUTH_CLIENT_SECRET');
        const OAUTH_REFRESH_TOKEN = core.getInput('OAUTH_REFRESH_TOKEN');
        const linter_job_result = core.getInput('linter_job_result');
        const cypress_job_result = core.getInput('cypress_job_result');
        const modify_readme_job_result = core.getInput('modify_readme_job_result');
        const deploy_job_result = core.getInput('deploy_job_result');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
                clientId: OAUTH_CLIENTID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN
            }
        });

        let mailOptions = {
            'from': `${MAIL_USERNAME}`,
            'to': `${MAIL_USERNAME}`,
            'subject': 'Resultat del workflow executat',
            'text': `S'ha realitzat un push en la branca main que ha provocat l'execució del workflow fumetria_workflow amb els següents resultats:\n
        \n
        - linter_job: ${linter_job_result}\n
        - cypress_job: ${cypress_job_result}\n
        - add_badge_job: ${modify_readme_job_result}\n
        - deploy_job: ${deploy_job_result}\n
        `
        };

        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Email sent successfully");
                process.exit(0);
            }
        });

    } catch (error) {
        core.setFailed(error);
    }
};
```

Aquest codi ens mostra el funcionament del nodemailer on introduïm els resultats dels jobs anteriors al cos del email i envia el email al email que hem assignat.

![email rebut](/docs/img/email_sended.png)

Com podem observar, hem rebut el email amb els resultats dels jobs.

### Metriques al perfil

Per a afegir metriques al nostre perfil de GitHub amb un action, tenim que crear un repositori amb el nostre nom d'usuari.

Posteriorment crearem un workflow utilitzant el github action _lowlighter/metrics@latest_ i afegirem tots els plugins que ens interese.

```OASv2-yaml
# Visit https://github.com/lowlighter/metrics#-documentation for full reference
name: Metrics
on:
  # Schedule updates (each hour)
  schedule: [{ cron: "0 * * * *" }]
  # Lines below let you run workflow manually and on each commit
  workflow_dispatch:
  push: { branches: ["master", "main"] }
jobs:
  github-metrics:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: lowlighter/metrics@latest
        with:
          # Your GitHub token
          # The following scopes are required:
          #  - public_access (default scope)
          # The following additional scopes may be required:
          #  - read:org      (for organization related metrics)
          #  - read:user     (for user related data)
          #  - read:packages (for some packages related data)
          #  - repo          (optional, if you want to include private repositories)
          token: ${{ secrets.METRICS_TOKEN }}

          # Options
          template: classic
          base: header, activity, community, repositories, metadata
          config_timezone: Europe/Madrid
          plugin_achievements: yes
          plugin_achievements_display: detailed
          plugin_achievements_secrets: yes
          plugin_achievements_threshold: C
          plugin_gists: yes
          plugin_isocalendar: yes
          plugin_isocalendar_duration: half-year
          plugin_languages: yes
          plugin_languages_analysis_timeout: 15
          plugin_languages_analysis_timeout_repositories: 7.5
          plugin_languages_categories: markup, programming
          plugin_languages_colors: github
          plugin_languages_limit: 8
          plugin_languages_recent_categories: markup, programming
          plugin_languages_recent_days: 14
          plugin_languages_recent_load: 300
          plugin_languages_sections: most-used
          plugin_languages_threshold: 0%
```

Fet açò, una vegada ejecutat el job i modificant el README afegint el svg que ens a generat, tindrem unes metriques al nostre perfil.

![Metriques en perfil GitHub](/docs/img/metrics_profile.png)
