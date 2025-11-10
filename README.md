# 🤖 RobotRunner

**Endless Runner Game** desarrollado con Phaser 3 + Capacitor para Android

---

## 📖 Descripción

RobotRunner es un juego endless runner donde un robot debe correr y esquivar obstáculos dentro de una fábrica futurista. El jugador toca la pantalla para saltar, evitando obstáculos mientras la velocidad aumenta progresivamente.

### 🎮 Características

- **3 Niveles** con progresión continua tipo Subway Surfers
- **3 Vidas** - Pierde una vida al chocar con obstáculos
- **Sistema de Puntajes** - Top 10 mejores distancias guardadas
- **Easter Egg** - Batería que otorga modo turbo invencible
- **5 Escenas** - Splash, Menú, Juego, Puntajes, Créditos
- **Sonidos** - Generados con Web Audio API
- **Optimizado para móviles** - Orientación vertical

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+
- Java JDK 17+
- Android Studio con SDK API 35

### Instalación

```bash
# Instalar dependencias
npm install

# Probar en navegador
npm run dev

# Compilar para producción
npm run build

# Abrir en Android Studio
npx cap open android
```

---

## 📱 Generar APK/AAB

Ver **[INSTRUCCIONES.md](INSTRUCCIONES.md)** para el proceso completo de:
- Compilación del proyecto
- Generación de .aab para Play Store
- Firma de la aplicación
- Publicación en Google Play

---

## 🎯 Sistema de Niveles

| Nivel | Distancia | Velocidad | Ambiente |
|-------|-----------|-----------|----------|
| 1 | 0 - 1000m | Normal | Azul/Gris |
| 2 | 1000 - 2000m | +30% | Verde/Neón |
| 3 | 2000 - 3000m | +60% | Rojo/Naranja |

**Victoria:** Llegar a 3000 metros completando los 3 niveles

---

## 🎮 Controles

- **PC:** Presiona ESPACIO para saltar
- **Móvil:** Toca la pantalla para saltar

---

## 👥 Créditos

**Desarrolladores:**
- Sara Chavez
- Cristian Usme
- Maria Gomez

**Tecnologías:**
- [Phaser 3](https://phaser.io/) - Motor de juego
- [Capacitor](https://capacitorjs.com/) - Empaquetado nativo
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje
- [Vite](https://vitejs.dev/) - Build tool

---

## 📂 Estructura del Proyecto

```
RobotRunner/
├── src/
│   ├── main.ts              # Configuración de Phaser
│   ├── scenes/              # Todas las escenas del juego
│   │   ├── BootScene.ts
│   │   ├── SplashScene.ts
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   ├── GameOverScene.ts
│   │   ├── VictoryScene.ts
│   │   ├── ScoresScene.ts
│   │   └── CreditsScene.ts
│   └── utils/
│       ├── StorageManager.ts  # Persistencia de datos
│       └── SoundManager.ts    # Sistema de audio
├── android/                  # Proyecto Android
├── www/                      # Build de producción
└── capacitor.config.ts       # Configuración de Capacitor
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (localhost:3000)
npm run build            # Compilar para producción
npm run preview          # Vista previa del build

# Capacitor
npx cap sync android     # Sincronizar cambios
npx cap open android     # Abrir Android Studio
npx cap copy android     # Copiar solo assets
```

---

## 📊 Características Técnicas

- **Motor:** Phaser 3.80.1
- **Física:** Arcade Physics
- **Resolución:** 720x1280 (portrait)
- **Target API:** 35 (Android 15)
- **Min API:** 24 (Android 7.0)
- **Almacenamiento:** Capacitor Preferences
- **Audio:** Web Audio API

---

## 📄 Licencia

Proyecto académico - 2025

---

## 🎉 ¡Gracias por Jugar!

Para más información sobre cómo compilar y publicar, consulta [INSTRUCCIONES.md](INSTRUCCIONES.md)
