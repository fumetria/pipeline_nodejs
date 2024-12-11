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

- Notification job: Aquest job s'encarregarà de notificar-mos mitjançant un email amb els resultats de tots els job d'aquest GitHub Action.

Per últim, modificarem el nostre perfil amb metriques de GitHub.

Comencem creant el nostre workflow.yml:
