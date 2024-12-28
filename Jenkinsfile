pipeline {
  agent any
  tools { nodejs 'Node'}
  stages {
    stage('execution') {
      parameters{
        string(name:'persona_a_saludar', defaultValue: 'user', description: 'Nombre persona a saludar' )
      }
      steps {
        sh "node index.js '${params.persona_a_saludar}";
      }
    }
  }
}
