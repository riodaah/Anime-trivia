# 🚀 Guía Rápida de Inicio

## Pasos Rápidos para Empezar

### 1. Instalar Dependencias
```bash
# Frontend
npm install

# Cloud Functions
cd functions
npm install
cd ..
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz:
```env
VITE_API_BASE_URL=https://us-central1-anime-trivia-a7bb7.cloudfunctions.net
VITE_WEBHOOK_SECRET=tu-secret-aqui
```

### 3. Iniciar Desarrollo
```bash
npm run dev
```

### 4. Configurar Firebase Functions
```bash
# Configurar webhook secret
firebase functions:config:set webhook.secret="tu-secret-seguro"

# Deploy functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 5. Agregar Videos (Opcional)
Coloca tus videos en `public/videos/`:
- `home-hero-loop.mp4` - Video de fondo del hero
- Optimiza con: `ffmpeg -i input.mp4 -crf 28 -preset veryfast -vf scale=1920:1080 output.mp4`

### 6. Configurar Google AdSense
1. Obtén tu Publisher ID de AdSense
2. Edita `src/components/ui/AdSense.tsx`
3. Reemplaza `ca-pub-XXXXXXXXXX` con tu ID
4. Descomenta los componentes `<AdSense />` en las páginas

### 7. Build y Deploy
```bash
# Build
npm run build

# Deploy completo
npm run deploy

# O solo hosting
firebase deploy --only hosting
```

## 📝 Notas Importantes

- **Videos**: Los videos deben estar en `public/videos/` y referenciados desde ahí
- **Lotties**: Los archivos Lottie deben estar en `src/Lotties/`
- **Sonidos**: Los sonidos deben estar en `public/sounds/`
- **Firestore Rules**: Configura las reglas de seguridad en la consola de Firebase
- **Webhook Make**: Usa la URL de la función `webhookAnimeNews` para publicar posts automáticamente

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Configurar variables de entorno
3. ✅ Probar en desarrollo (`npm run dev`)
4. ✅ Configurar Firebase Functions
5. ✅ Agregar videos y assets
6. ✅ Configurar AdSense
7. ✅ Deploy a producción

¡Listo para empezar! 🎮✨


