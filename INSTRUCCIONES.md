# 🤖 RobotRunner - Instrucciones de Compilación

## ✅ Proyecto Completado

Tu juego **RobotRunner** está listo con:
- ✅ 5 escenas (Splash, Menu, Juego, Puntajes, Créditos)
- ✅ 3 niveles con progresión continua tipo Subway Surfers
- ✅ Sistema de 3 vidas
- ✅ Easter Egg (batería para modo turbo invencible)
- ✅ Top 10 puntajes guardados con Capacitor Storage
- ✅ Sonidos generados con Web Audio API
- ✅ Configurado para Android API 35

---

## 🎮 Cómo Probar el Juego en Navegador

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

**Controles:**
- Toca la pantalla o presiona ESPACIO para saltar
- Esquiva obstáculos rojos
- Recolecta baterías naranjas para modo turbo

---

## 📱 Cómo Generar el .aab para Play Store

### Paso 1: Abrir en Android Studio

```bash
npx cap open android
```

Esto abrirá el proyecto en Android Studio.

### Paso 2: Esperar Gradle Sync

Cuando Android Studio se abra:
1. Espera a que termine el **Gradle Sync** (barra de progreso abajo)
2. Si hay errores de SDK, haz clic en **"Install missing SDK"** o **"Sync Now"**

### Paso 3: Generar Signed Bundle (AAB)

1. Ve a **Build > Generate Signed Bundle / APK**
2. Selecciona **Android App Bundle**
3. Haz clic en **Next**

### Paso 4: Crear o Seleccionar Keystore

**Si es tu primera vez:**

1. Haz clic en **"Create new..."**
2. Llena los campos:
   - **Key store path:** Elige una ubicación segura (ejemplo: `C:\Users\sarac\robotrunner-key.jks`)
   - **Password:** Crea una contraseña segura (¡GUÁRDALA!)
   - **Alias:** `robotrunner`
   - **Alias password:** Misma contraseña o una diferente
   - **Validity (years):** 25
   - **Certificate:**
     - First and Last Name: Tu nombre
     - Organizational Unit: Tu universidad
     - Organization: Tu universidad
     - City: Tu ciudad
     - State: Tu estado/departamento
     - Country Code: CO (o tu país)
3. Haz clic en **OK**

**Si ya tienes keystore:**
1. Selecciona tu archivo .jks
2. Ingresa las contraseñas

### Paso 5: Seleccionar Variante de Build

1. Selecciona **release**
2. Marca la casilla **"Remember passwords"** (opcional, solo en tu computadora)
3. Haz clic en **Next**
4. Destino: Deja el default o elige tu carpeta
5. Haz clic en **Finish**

### Paso 6: Esperar Compilación

- Verás el progreso en la parte inferior de Android Studio
- Puede tardar 2-10 minutos la primera vez
- Cuando termine, verá un mensaje: **"locate"** o **"analyze"**

### Paso 7: Ubicar el .aab

El archivo estará en:
```
RobotRunner/android/app/release/app-release.aab
```

---

## 🚀 Subir a Play Store

### Requisitos:
1. **Cuenta de Google Play Developer** ($25 USD único pago)
2. Tu archivo **app-release.aab**
3. Íconos de la app (512x512 px)
4. Capturas de pantalla (mínimo 2)

### Pasos en Play Console:

1. Ve a https://play.google.com/console
2. **Crear Aplicación**
   - Nombre: RobotRunner
   - Idioma: Español
   - Tipo: Juego
   - Categoría: Arcade
3. **Panel de Control > Producción**
   - Sube tu .aab
   - Llena la ficha de la tienda:
     - Descripción corta
     - Descripción completa
     - Íconos e imágenes
     - Capturas de pantalla
4. **Clasificación de Contenido**
5. **Público Objetivo**
6. **Enviar a Revisión**

---

## 🔧 Comandos Útiles

### Desarrollo Web
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
```

### Capacitor
```bash
npx cap sync android    # Sincronizar cambios
npx cap open android    # Abrir Android Studio
npx cap copy android    # Copiar assets
```

### Actualizar Juego después de Cambios
```bash
npm run build
npx cap sync android
```

---

## 📊 Estructura del Proyecto

```
RobotRunner/
├── src/
│   ├── main.ts                 # Configuración principal de Phaser
│   ├── scenes/
│   │   ├── BootScene.ts       # Carga de assets
│   │   ├── SplashScene.ts     # Logo animado
│   │   ├── MenuScene.ts       # Menú principal
│   │   ├── GameScene.ts       # Escena del juego
│   │   ├── GameOverScene.ts   # Pantalla de derrota
│   │   ├── VictoryScene.ts    # Pantalla de victoria
│   │   ├── ScoresScene.ts     # Top 10 puntajes
│   │   └── CreditsScene.ts    # Créditos
│   └── utils/
│       ├── StorageManager.ts  # Gestión de puntajes
│       └── SoundManager.ts    # Gestión de audio
├── android/                    # Proyecto Android nativo
├── www/                        # Build del juego web
├── index.html                  # HTML principal
├── vite.config.ts             # Configuración de Vite
├── capacitor.config.ts        # Configuración de Capacitor
└── package.json               # Dependencias
```

---

## 🎯 Características Implementadas

### ✅ 5 Secciones Obligatorias
1. **Splash Screen** - Logo animado con partículas
2. **Home/Menu** - Botones interactivos (Jugar, Puntajes, Créditos)
3. **Juego** - Gameplay principal con 3 niveles
4. **Puntajes** - Top 10 guardados localmente
5. **Créditos** - Sara Chavez, Cristian Usme, Maria Gomez

### ✅ Sistema de Juego
- **3 Niveles:**
  - Nivel 1: 0-1000m (Azul/Gris, velocidad normal)
  - Nivel 2: 1000-2000m (Verde, +30% velocidad)
  - Nivel 3: 2000-3000m (Rojo, +60% velocidad)
- **3 Vidas:** Pierdes una al chocar con obstáculos
- **Transiciones:** Pausa de 2s al cambiar de nivel
- **Victoria:** Al llegar a 3000m

### ✅ Easter Egg
- **Batería naranja** aparece cada 15 segundos
- Al recolectarla: Modo turbo + invencibilidad por 10 segundos
- Efecto visual amarillo en el robot

### ✅ Persistencia
- Puntajes guardados con `@capacitor/preferences`
- Top 10 mejores distancias
- Funciona offline

### ✅ Sonidos
- Salto: Beep agudo
- Daño: Sonido bajo distorsionado
- Nivel: Tono ascendente
- Power-up: Sonido brillante
- Victoria: Melodía de 4 notas

### ✅ UI/UX
- Diseño vertical (portrait) para móviles
- Botones con efectos hover y presión
- Transiciones animadas entre escenas
- Partículas y efectos visuales

### ✅ Técnico
- **Phaser 3.80** - Motor de juego
- **TypeScript** - Tipado estático
- **Vite** - Build rápido
- **Capacitor 6** - Empaquetado nativo
- **Android API 35** - Última versión estable
- **Target: 720x1280** - Resolución móvil

---

## ⚠️ Solución de Problemas

### Error: "SDK not found"
1. Abre Android Studio
2. Tools > SDK Manager
3. Instala Android API 35

### Error: "Gradle sync failed"
1. En Android Studio: File > Invalidate Caches / Restart
2. Espera a que reindexe

### Error al compilar .aab
1. Verifica que Android API 35 esté instalado
2. En Android Studio: Build > Clean Project
3. Build > Rebuild Project
4. Intenta generar el .aab de nuevo

### El juego no responde en móvil
1. Asegúrate de estar tocando el área del juego
2. Verifica que el modo turbo no esté activo (robot amarillo)

---

## 📞 Contacto

**Desarrolladores:**
- Sara Chavez
- Cristian Usme
- Maria Gomez

**Tecnología:**
- Phaser 3
- Capacitor
- TypeScript

---

## 🎉 ¡Listo para Publicar!

Tu juego está completo y listo para ser subido a la Play Store. Sigue las instrucciones paso a paso y en unas horas estará disponible para que el mundo juegue.

**¡Buena suerte con tu proyecto académico!** 🚀🤖

