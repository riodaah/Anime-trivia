# Diagrama de Arquitectura Visual - Trivia de Animales

## Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCCIÓN                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USUARIO    │
│  (Navegador) │
└──────┬───────┘
       │
       │ HTTPS
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19.1.0 + TypeScript                            │   │
│  │  - Componentes: GameScreen, Leaderboard, etc.        │   │
│  │  - React Bootstrap para UI                           │   │
│  │  - React Lottie para animaciones                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          │ Firebase SDK                       │
│                          ▼                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ API Calls
                          │
┌─────────────────────────────────────────────────────────────┐
│              FIREBASE PLATFORM (BaaS)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Firebase Hosting (CDN Global)                       │   │
│  │  - Sirve archivos estáticos del frontend            │   │
│  │  - Distribución global automática                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Cloud Firestore (Base de Datos NoSQL)               │   │
│  │  ┌──────────────────┐  ┌──────────────────┐         │   │
│  │  │ Colección:       │  │ Colección:       │         │   │
│  │  │ 'questions'      │  │ 'scores'         │         │   │
│  │  │ - Preguntas      │  │ - Puntuaciones   │         │   │
│  │  │ - Opciones       │  │ - Nicknames      │         │   │
│  │  │ - Respuestas     │  │ - Timestamps     │         │   │
│  │  └──────────────────┘  └──────────────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              ADMINISTRACIÓN (Desarrollo)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js Script (uploadQuestions.js)                  │   │
│  │  - Firebase Admin SDK                                 │   │
│  │  - Carga preguntas desde JSON local                   │   │
│  │  - Actualiza Firestore                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos Detallado

### 1. Usuario Accede a la Aplicación
```
Usuario → Navegador → Firebase Hosting (CDN) → Descarga React App
```

### 2. Carga de Preguntas
```
React App → Firebase SDK → Firestore API → Colección 'questions' → React App
```

### 3. Usuario Responde Preguntas
```
Usuario → React App (Estado Local) → Validación → Actualización UI
```

### 4. Guardado de Puntuación
```
React App → Firebase SDK → Firestore API → Colección 'scores' → Confirmación
```

### 5. Visualización de Leaderboard
```
React App → Firebase SDK → Firestore API → Query 'scores' ordenado → React App
```

## Tecnologías por Capa

### Capa de Presentación (Frontend)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.1.0 | Framework UI |
| TypeScript | 4.9.5 | Tipado estático |
| React Bootstrap | 2.10.10 | Componentes UI |
| React Lottie | 1.2.10 | Animaciones |
| Firebase SDK | 11.10.0 | Cliente Firebase |

### Capa de Servicios (Backend)
| Servicio | Propósito |
|----------|-----------|
| Firebase Hosting | Hosting estático + CDN |
| Cloud Firestore | Base de datos NoSQL |
| Firebase Admin SDK | Administración de datos |

### Capa de Datos
| Colección | Estructura |
|-----------|------------|
| questions | Preguntas, opciones, respuestas correctas |
| scores | Nickname, puntuación, timestamp |

## Comparación: Desarrollo vs Producción

### Desarrollo
```
┌─────────┐
│ React   │ → npm start → localhost:3000
│ Dev     │
└─────────┘
     │
     └──→ Firebase SDK → Firestore (Producción)
```

### Producción
```
┌─────────┐
│ React   │ → npm run build → Firebase Hosting
│ Build   │
└─────────┘
     │
     └──→ Firebase SDK → Firestore (Producción)
```

## Puntos Clave de la Arquitectura

1. **Frontend**: Single Page Application (SPA) con React
2. **Backend**: Serverless (Firebase BaaS)
3. **Base de Datos**: NoSQL (Firestore)
4. **Hosting**: CDN Global (Firebase Hosting)
5. **Sin servidor propio**: Todo manejado por Firebase


