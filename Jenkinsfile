pipeline {
  agent any
  tools { nodejs 'Node'}
  parameters{
    string(name:'persona_a_saludar', defaultValue: 'user', description: 'Nombre persona a saludar' )
  }
  stages {
    stage('execution') {
      steps {
        sh "node index.js '${params.persona_a_saludar}";
      }
    }
  }
}
