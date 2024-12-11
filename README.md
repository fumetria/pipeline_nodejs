RESULTAT DELS ÚLTIMS TESTS 
 ![Test result badge](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg) 
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

```

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

![error GitHub Action]('./docs/img/error_linter_1.png')

Per tant, procedirem a corregir els errors que ens indica el log. Comencem per el primer error a la ruta **./pages/api/users/[id].js**:

![correcció arxiu id.js]('./docs/img/error_linter_2.png')

Després passem al segon error ./pages/api/users/index.js:

![correcció arxiu index.js]('./docs/img/error_linter_3.png')

Amb estes correccions fetes, ja no tindrem cap error amb aquest job.
