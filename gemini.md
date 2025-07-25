# Documentación de la Aplicación Anime Trivia

Esta aplicación es un juego de trivia de anime desarrollado con React y TypeScript. Utiliza Firebase para la gestión de preguntas y puntuaciones, React-Bootstrap para la interfaz de usuario y React-Lottie para animaciones.

## Estructura del Proyecto

El proyecto sigue una estructura típica de una aplicación React, con los componentes principales en `src/components/`.

```
C:/Users/damor/Desktop/juego de trivia/anime-trivia/
├───public/
│   ├───index.html
│   └───questions.json (posiblemente obsoleto o fallback)
├───src/
│   ├───App.css
│   ├───App.tsx (Componente principal)
│   ├───firebase.ts (Configuración de Firebase)
│   ├───index.css
│   ├───index.tsx (Punto de entrada de React)
│   ├───components/
│   │   ├───GameScreen.tsx (Pantalla de juego)
│   │   ├───GuessCharacterScreen.tsx (Componente adicional/en desarrollo)
│   │   ├───Leaderboard.tsx (Tabla de posiciones)
│   │   ├───LoadingScreen.tsx (Pantalla de carga)
│   │   ├───StartScreen.tsx (Pantalla de inicio)
│   │   └───Timer.tsx (Temporizador)
│   ├───Images/ (Activos de imagen)
│   ├───Lotties/ (Archivos de animación Lottie)
│   └───Preguntas/ (Archivos de preguntas locales, posiblemente usados para `uploadQuestions.js`)
├───package.json
├───firebase.json
├───uploadQuestions.js (Script para subir preguntas a Firebase)
└───...otros archivos de configuración y módulos
```

## Tecnologías Utilizadas

*   **React**: Biblioteca de JavaScript para construir interfaces de usuario.
*   **TypeScript**: Superset de JavaScript que añade tipado estático.
*   **Firebase**: Plataforma de desarrollo de Google utilizada para:
    *   **Firestore**: Base de datos NoSQL para almacenar preguntas y puntuaciones.
    *   **Hosting**: Para desplegar la aplicación web.
*   **React-Bootstrap**: Framework de UI para React que implementa componentes de Bootstrap.
*   **React-Lottie**: Para renderizar animaciones de Lottie.
*   **Node.js**: Entorno de ejecución para JavaScript (utilizado para scripts y desarrollo).

## Funcionalidades Principales

1.  **Carga de Preguntas**: Las preguntas de trivia se cargan dinámicamente desde una colección `questions` en Firestore.
2.  **Inicio del Juego**: El usuario ingresa un nickname para comenzar.
3.  **Juego de Trivia**:
    *   Se presentan preguntas aleatorias.
    *   Temporizador para cada pregunta.
    *   Verificación de respuestas correctas/incorrectas.
    *   Actualización de puntuación en tiempo real.
    *   El juego termina si el usuario responde incorrectamente o se agota el tiempo.
    *   Animación Lottie para los jugadores en el top 5 al responder correctamente.
4.  **Tabla de Posiciones (Leaderboard)**:
    *   Muestra las puntuaciones de todos los jugadores, ordenadas de mayor a menor.
    *   La puntuación del jugador actual se guarda en Firestore al finalizar el juego.
    *   Paginación para la tabla de posiciones.
5.  **Reiniciar Juego**: Opción para comenzar un nuevo juego desde la tabla de posiciones.
6.  **Pantalla de Carga**: Animación mientras se cargan los datos iniciales.

## Flujo de la Aplicación

1.  **Inicio**: La aplicación carga `App.tsx`.
2.  **Carga de Datos**: `App.tsx` inicia la carga de preguntas y puntuaciones desde Firestore. Mientras tanto, `LoadingScreen.tsx` se muestra.
3.  **Pantalla de Inicio**: Una vez que los datos se cargan, `App.tsx` renderiza `StartScreen.tsx`, donde el usuario ingresa su nickname.
4.  **Juego**: Al iniciar el juego, `App.tsx` cambia el estado a 'playing' y renderiza `GameScreen.tsx`.
    *   `GameScreen.tsx` selecciona una pregunta aleatoria de las cargadas.
    *   `Timer.tsx` inicia la cuenta regresiva.
    *   El usuario selecciona una respuesta.
    *   Si la respuesta es correcta, la puntuación se actualiza y se carga la siguiente pregunta.
    *   Si la respuesta es incorrecta o el tiempo se agota, el juego termina.
5.  **Fin del Juego**: Cuando el juego termina, `App.tsx` cambia el estado a 'gameOver' y renderiza `Leaderboard.tsx`.
    *   La puntuación final del jugador se guarda en la colección `scores` de Firestore.
    *   La tabla de posiciones se actualiza y se muestra.
6.  **Reiniciar**: Desde `Leaderboard.tsx`, el usuario puede optar por reiniciar el juego, volviendo a la `StartScreen.tsx`.

## Configuración de Firebase

El archivo `src/firebase.ts` contiene la configuración para inicializar la aplicación de Firebase. Las credenciales de la API están directamente en el código.

## Script `uploadQuestions.js`

Este script de Node.js (`uploadQuestions.js`) se utiliza para cargar preguntas desde un archivo JSON local (presumiblemente `src/Preguntas/preguntas_anime.json` o similar) a la colección `questions` en Firestore. Requiere un archivo `serviceAccountKey.json` para autenticarse con Firebase Admin SDK.

## Componente `GuessCharacterScreen.tsx`

Este componente parece ser una característica separada o en desarrollo que no está integrada en el flujo principal del juego de trivia. Permite a los usuarios adivinar el nombre de un personaje de anime a partir de una imagen. Tiene su propia lógica de juego y manejo de intentos.

## Estado del Proyecto y Despliegue

*   **Control de Versiones**: El proyecto está bajo control de versiones con Git. El último commit es "feat: Cambia el texto del botón de inicio a 'Jugar'". Hay cambios locales sin commitear y archivos sin seguimiento.
*   **Construcción (Build)**: La aplicación se puede construir exitosamente utilizando `npm run build`. Se generó una advertencia de ESLint en `src/components/GameScreen.tsx` sobre una dependencia faltante en un `useEffect`.
*   **Despliegue a Firebase**: La aplicación se puede desplegar a Firebase Hosting utilizando `npm run deploy`. La URL de despliegue es `https://anime-trivia-a7bb7.web.app`.