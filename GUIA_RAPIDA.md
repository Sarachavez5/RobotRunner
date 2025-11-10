# 🚀 Guía Rápida - RobotRunner

## ⚡ Probar el Juego AHORA

```bash
npm run dev
```

Abre http://localhost:3000 y juega en tu navegador.

---

## 📱 Generar el .aab en 5 Pasos

### 1️⃣ Compilar
```bash
npm run build
```

### 2️⃣ Sincronizar
```bash
npx cap sync android
```

### 3️⃣ Abrir Android Studio
```bash
npx cap open android
```

### 4️⃣ En Android Studio
- Espera el **Gradle Sync**
- Ve a: **Build > Generate Signed Bundle / APK**
- Selecciona: **Android App Bundle**
- Crea o selecciona tu keystore
- Tipo: **release**
- Click **Finish**

### 5️⃣ Ubicar tu .aab
```
RobotRunner/android/app/release/app-release.aab
```

**¡Listo para subir a Play Store!** 🎉

---

## 🎮 Cómo Jugar

- **Objetivo:** Completar los 5 niveles llegando a 5000 metros
- **Control:** Toca la pantalla o ESPACIO para saltar
- **Obstáculos:** 5 tipos diferentes (cajas, púas, barriles, voladores)
- **Easter Egg:** Batería naranja = Modo turbo invencible (10s)
- **Niveles:**
  - 0-1000m: Nivel 1 - Fábrica Oscura
  - 1000-2000m: Nivel 2 - Zona Industrial
  - 2000-3000m: Nivel 3 - Planta Nuclear
  - 3000-4000m: Nivel 4 - Fundición
  - 4000-5000m: Nivel 5 - Reactor Final
  - 5000m: ¡Victoria!

---

## ❓ Problemas Comunes

### "npx command not found"
```bash
npm install
```

### "Android folder not found"
```bash
npx cap add android
```

### No se ve en Android Studio
1. File > Open
2. Selecciona la carpeta `android` dentro de RobotRunner

---

## 📞 Más Información

- **Instrucciones completas:** Ver [INSTRUCCIONES.md](INSTRUCCIONES.md)
- **Documentación:** Ver [README.md](README.md)

---

**Desarrollado por:** Sara Chavez, Cristian Usme, Maria Gomez  
**Tecnología:** Phaser 3 + Capacitor + TypeScript

