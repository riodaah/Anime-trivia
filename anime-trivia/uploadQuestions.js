console.log('Iniciando ejecución de uploadQuestions.js...');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de que esta ruta sea correcta
const questionsData = require('./public/questions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadQuestions() {
  console.log('Iniciando la carga de preguntas a Firestore...');
  for (const question of questionsData) {
    try {
      console.log(`Intentando agregar pregunta: "${question.question}"...`);
      const docRef = await db.collection('questions').add(question);
      console.log(`Pregunta "${question.question}" agregada con ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error al agregar la pregunta "${question.question}":`, error);
      console.error("Detalles del error:", error);
    }
  }
  console.log('Carga de preguntas completada.');
}

uploadQuestions().then(() => {
  console.log('Script de carga de preguntas finalizado.');
  process.exit(0);
}).catch(error => {
  console.error('Error fatal en el script de carga:', error);
  process.exit(1);
});
