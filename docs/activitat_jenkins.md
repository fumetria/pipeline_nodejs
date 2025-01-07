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
