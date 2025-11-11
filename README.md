# 🤖 Robot Runner

**Juego de plataformas auto-runner tipo Geometry Dash** desarrollado con Phaser 3 + Capacitor para Android

---

## 📖 Descripción

Robot Runner es un emocionante juego de plataformas auto-runner inspirado en Geometry Dash, donde controlas un robot que debe atravesar 3 niveles llenos de obstáculos. Salta púas, esquiva bloques, sube plataformas y ¡hasta vuela en el nivel final! El robot corre automáticamente mientras tú controlas los saltos y el vuelo. El juego aumenta progresivamente en dificultad y velocidad, culminando en un desafío épico de vuelo en el Reactor Final.

### ✨ Características Principales

- **🎯 3 Niveles Únicos** - Cada uno con su propio ambiente, color y dificultad
  - **Nivel 1: Fábrica Oscura** (0-720m) - Aprendizaje básico
  - **Nivel 2: Zona Industrial** (720-2000m) - Plataformas y escaleras
  - **Nivel 3: Reactor Final** (2000-3000m) - ¡Incluye modo de vuelo!
  
- **✈️ Modo de Vuelo** - En el nivel 3, el robot puede volar esquivando obstáculos aéreos
- **❤️ Sistema de Vidas** - 3 vidas, pierde una al chocar con obstáculos
- **⭐ Sistema de Estrellas** - Gana 1-3 estrellas según las vidas que te queden al completar
- **📊 Tabla de Puntajes** - Top 10 mejores distancias guardadas localmente
- **⏸️ Pausa** - Botón de pausa funcional para móviles y tecla ESC para PC
- **🎵 Sonidos Dinámicos** - Efectos de salto, daño y victoria generados con Web Audio API
- **📱 Optimizado para Móviles** - Orientación vertical, controles táctiles
- **🎨 6 Escenas** - Splash, Menú, Juego, Victoria, Game Over, Puntajes, Créditos

---

## 🚀 Instalación y Configuración

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 16+** - [Descargar](https://nodejs.org/)
- **npm** o **yarn** - Viene con Node.js
- **Java JDK 17+** - [Descargar](https://adoptium.net/) (solo para compilar Android)
- **Android Studio** - [Descargar](https://developer.android.com/studio) (solo para compilar Android)
  - SDK API Level 35 (Android 15)
  - Build Tools

### 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/RobotRunner.git
cd RobotRunner
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Probar en el navegador**
```bash
npm run dev
```
El juego se abrirá en `http://localhost:5173`

4. **Compilar para producción**
```bash
npm run build
```

### 📱 Compilar para Android

1. **Sincronizar con Capacitor**
```bash
npx cap sync android
```

2. **Abrir en Android Studio**
```bash
npx cap open android
```

3. **Compilar desde Android Studio**
   - Selecciona `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - El APK se generará en `android/app/build/outputs/apk/`

---

## 📱 Generar APK/AAB

Ver **[INSTRUCCIONES.md](INSTRUCCIONES.md)** para el proceso completo de:
- Compilación del proyecto
- Generación de .aab para Play Store
- Firma de la aplicación
- Publicación en Google Play

---

## 🎯 Sistema de Niveles

### Nivel 1: Fábrica Oscura (0 - 720m)
- **Color:** Azul oscuro
- **Velocidad:** Normal (300px/s base, +35%)
- **Obstáculos:** Púas, bloques pequeños y grandes, plataformas
- **Dificultad:** ⭐ Fácil - Tutorial

### Nivel 2: Zona Industrial (720m - 2000m)
- **Color:** Verde neón
- **Velocidad:** +35% más rápido
- **Obstáculos:** Escaleras ascendentes, bloques múltiples, plataformas elevadas
- **Dificultad:** ⭐⭐ Medio - Requiere timing

### Nivel 3: Reactor Final (2000m - 3000m)
- **Color:** Rojo/Naranja
- **Velocidad:** +30% más rápido
- **Características especiales:**
  - ✈️ **Zona de Vuelo (2450m - 2900m)**: El robot vuela automáticamente
  - Obstáculos flotantes que debes esquivar volando
  - Control vertical: mantén presionado para subir, suelta para bajar
  - Aterrizaje después de la zona de vuelo
- **Dificultad:** ⭐⭐⭐ Difícil - Requiere dominio del vuelo

**🏆 Victoria:** Llegar a 3000 metros completando los 3 niveles

**⭐ Sistema de Estrellas:**
- 3 estrellas: Completar con 3 vidas
- 2 estrellas: Completar con 2 vidas  
- 1 estrella: Completar con 1 vida

---

## 🎮 Controles

### Controles de Movimiento
- **💻 PC:** 
  - `ESPACIO` - Saltar / Subir (en modo vuelo)
  - `ESC` - Pausar/Reanudar
- **📱 Móvil:** 
  - `Toca la pantalla` - Saltar / Subir (en modo vuelo)
  - `Botón de pausa ||` - Pausar/Reanudar (esquina superior derecha)

### Modo de Vuelo (Nivel 3)
- **Mantén presionado** para subir
- **Suelta** para bajar
- El robot se inclina según la dirección del vuelo
- Esquiva los obstáculos flotantes

### Menú de Pausa
- **CONTINUAR** - Reanuda el juego
- **IR AL MENÚ** - Vuelve al menú principal

---

## 📂 Estructura del Proyecto

```
RobotRunner/
├── src/
│   ├── main.ts                    # Configuración de Phaser
│   ├── scenes/                    # Todas las escenas del juego
│   │   ├── BootScene.ts          # Carga inicial
│   │   ├── SplashScene.ts        # Pantalla de bienvenida (3s)
│   │   ├── MenuScene.ts          # Menú principal
│   │   ├── GameScene.ts          # Lógica principal del juego
│   │   ├── GameOverScene.ts      # Pantalla de derrota
│   │   ├── VictoryScene.ts       # Pantalla de victoria con estrellas
│   │   ├── ScoresScene.ts        # Tabla de mejores puntajes
│   │   └── CreditsScene.ts       # Créditos del juego
│   └── utils/
│       └── StorageManager.ts     # Persistencia con Capacitor Preferences
├── android/                       # Proyecto Android (Capacitor)
├── www/                           # Build de producción
├── capacitor.config.ts            # Configuración de Capacitor
├── tsconfig.json                  # Configuración de TypeScript
├── vite.config.ts                 # Configuración de Vite
└── package.json                   # Dependencias del proyecto
```

---

## 🛠️ Comandos Disponibles

### Desarrollo Web
```bash
npm run dev              # Servidor de desarrollo (localhost:5173)
npm run build            # Compilar para producción
npm run preview          # Vista previa del build de producción
```

### Desarrollo Android
```bash
npx cap sync android     # Sincronizar cambios con Android (build + copy)
npx cap copy android     # Copiar solo los archivos web
npx cap open android     # Abrir proyecto en Android Studio
npx cap run android      # Compilar y ejecutar en dispositivo/emulador
```

### Gestión de Dependencias
```bash
npm install              # Instalar todas las dependencias
npm update               # Actualizar dependencias
npm outdated             # Ver dependencias desactualizadas
```

---

## 📊 Características Técnicas

### Motor de Juego
- **Framework:** Phaser 3.80.1
- **Física:** Arcade Physics
  - Gravedad: 980 px/s²
  - Velocidad de salto: -580 px/s
  - Velocidad de vuelo: hasta 1200 px/s
- **Resolución:** 720x1280 (orientación portrait)
- **FPS Target:** 60 FPS

### Plataforma Móvil
- **Framework:** Ionic Capacitor 6.2.0
- **Target API:** 35 (Android 15)
- **Min API:** 24 (Android 7.0)
- **Almacenamiento:** Capacitor Preferences (persistencia local)
- **Orientación:** Vertical fija (portrait)

### Tecnologías
- **TypeScript 5.6.3** - Lenguaje principal
- **Vite 5.4.21** - Build tool y dev server
- **Web Audio API** - Generación de efectos de sonido
- **Phaser Graphics** - Renderizado de formas y sprites

---

## 🎮 Mecánicas del Juego

### Sistema de Colisiones
- **Invencibilidad temporal:** 1 segundo después de recibir daño
- **Efecto visual:** El robot parpadea durante la invencibilidad
- **Coyote Time:** 0.15s para saltar después de dejar una plataforma
- **Jump Buffer:** 0.1s para registrar saltos antes de tocar el suelo

### Obstáculos
- **🔺 Púas (obstacle3):** Pequeñas, en el suelo
- **📦 Bloques Pequeños (obstacle1):** Saltables
- **📦 Bloques Grandes (obstacle2):** Más difíciles de saltar
- **🟦 Plataformas:** Permiten saltos múltiples

### Progresión de Velocidad
- Nivel 1: 300 px/s base → 405 px/s (+35%)
- Nivel 2: 300 px/s base → 405 px/s (+35%)
- Nivel 3: 300 px/s base → 390 px/s (+30%)

---

## 🐛 Solución de Problemas

### El juego no carga en el navegador
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error al compilar para Android
```bash
# Limpiar y sincronizar de nuevo
npx cap sync android
npx cap open android
# Luego en Android Studio: Build > Clean Project
```

### Los puntajes no se guardan
- Verifica que Capacitor Preferences esté instalado: `npm list @capacitor/preferences`
- En navegador web, se usa localStorage automáticamente

---

## 📄 Licencia

Proyecto académico desarrollado para el curso de Aplicaciones Móviles - 2025

**Universidad:** Universidad del Valle  
**Curso:** Aplicaciones Móviles - Octavo Semestre

---

## 👥 Créditos

**Desarrolladores:**
- Sara Chavez
- Cristian Usme
- Maria Gomez

**Tecnologías Utilizadas:**
- [Phaser 3](https://phaser.io/) - Motor de juego HTML5
- [Capacitor](https://capacitorjs.com/) - Framework nativo cross-platform
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje tipado
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- [Ionic](https://ionicframework.com/) - Framework de componentes móviles

---

## 🎉 ¡Gracias por Jugar!

Si tienes preguntas o encuentras algún bug, por favor abre un issue en el repositorio.

Para información detallada sobre cómo compilar y publicar en Google Play, consulta [INSTRUCCIONES.md](INSTRUCCIONES.md)
