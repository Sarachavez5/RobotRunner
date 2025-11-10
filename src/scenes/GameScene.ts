import Phaser from 'phaser';
import { StorageManager } from '../utils/StorageManager';

// Interfaz para definir los obstáculos del nivel
interface LevelChunk {
  distance: number; // Distancia desde el inicio donde aparece
  obstacles: Array<{
    x: number;        // Distancia horizontal desde el punto de spawn
    y: number;        // Altura (negativa desde el suelo)
    type: string;     // Tipo de obstáculo
    isPlatform?: boolean; // Si es plataforma o no
  }>;
}

export class GameScene extends Phaser.Scene {
  private robot!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.GameObjects.TileSprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.Group;
  private gaps!: Phaser.GameObjects.Group;
  private deathZone: number = 0;
  
  // 👻 Colliders para poder desactivarlos durante invencibilidad
  private platformCollider!: Phaser.Physics.Arcade.Collider;
  private obstacleCollider!: Phaser.Physics.Arcade.Collider;
  
  private lives: number = 3;
  private distance: number = 0;
  private currentLevel: number = 1;
  private baseSpeed: number = 300;
  private currentSpeed: number = 300;
  
  private isJumping: boolean = false;
  private isInvincible: boolean = false;
  private invincibilityTimer: number = 0; // 👻 Tiempo restante de invencibilidad
  private coyoteTime: number = 0; // Tiempo desde que dejó el suelo
  private jumpBuffer: number = 0; // Buffer para presionar salto antes de tocar suelo
  
  private livesText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  
  private isPaused: boolean = false;
  private pauseText!: Phaser.GameObjects.Text;
  
  // Sistema de chunks predefinidos
  private levelChunks!: LevelChunk[];
  private currentChunkIndex: number = 0;
  private spawnedChunks: Set<number> = new Set();
  
  private levelColors = [
    { bg: 0x1a1a2e, ground: 0x16213e, name: 'Fábrica Oscura' },      // Nivel 1: Azul oscuro
    { bg: 0x0f4c75, ground: 0x1b262c, name: 'Zona Industrial' },     // Nivel 2: Azul metálico
    { bg: 0xff6348, ground: 0xe55039, name: 'Reactor Final' }        // Nivel 3: Naranja/Rojo - FINAL
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(): void {
    // RESETEAR TODAS LAS VARIABLES al reiniciar el juego
    this.lives = 3;
    this.distance = 0;
    this.currentLevel = 1;
    this.baseSpeed = 300;
    this.currentSpeed = 300;
    this.isJumping = false;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.isPaused = false;
    this.currentChunkIndex = 0;
    this.spawnedChunks = new Set();
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
    
    // Crear los patrones del nivel
    this.createLevelDesign();
  }
  
  private createLevelDesign(): void {
    const { height } = this.cameras.main;
    
    // NIVEL 1: Patrones espaciados y respirables (0-1000m)
    // Como Geometry Dash - ritmo constante pero con espacio para reaccionar
    this.levelChunks = [
      // Intro muy suave (80m)
      {
        distance: 80,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Caja (140m)
      {
        distance: 140,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Primera púa (200m)
      {
        distance: 200,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' }
        ]
      },
      
      // Dos cajas bien separadas (260m)
      {
        distance: 260,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' },
          { x: 280, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Plataforma con púas (310m) - Primera introducción a la mecánica
      {
        distance: 310,
        obstacles: [
          { x: 150, y: height - 190, type: 'platform', isPlatform: true }, // Plataforma corrida a la derecha
          { x: 150, y: height - 115, type: 'obstacle3' },  // Púa 1 (debajo de plataforma)
          { x: 240, y: height - 115, type: 'obstacle3' }   // Púa 2 (más separada)
        ]
      },
      
      // Caja (360m) - Más lejos para dar tiempo
      {
        distance: 360,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Primera plataforma simple (380m)
      {
        distance: 380,
        obstacles: [
          { x: 80, y: height - 180, type: 'platform', isPlatform: true } // Corrida 80px para separar del bloque
        ]
      },
      
      // Plataforma con púas debajo (420m) - OBLIGATORIO usar la plataforma
      {
        distance: 420,
        obstacles: [
          { x: 0, y: height - 200, type: 'platform', isPlatform: true }, // Plataforma
          { x: 0, y: height - 115, type: 'obstacle3' },     // Púa 1
          { x: 100, y: height - 115, type: 'obstacle3' },   // Púa 2 (más separada)
          { x: 200, y: height - 115, type: 'obstacle3' }    // Púa 3 (más separada)
        ]
      },
      
      // Caja después de las púas (470m) - Más lejos
      {
        distance: 470,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },

      // Dos púas bien separadas - Ritmo (500m)
      {
        distance: 500,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' },
          { x: 250, y: height - 115, type: 'obstacle3' }
        ]
      },
      
      // Caja alta (560m)
      {
        distance: 560,
        obstacles: [
          { x: 0, y: height - 140, type: 'obstacle2' }
        ]
      },
      
      // Plataforma con púas (620m) - Segunda zona obligatoria
      {
        distance: 620,
        obstacles: [
          { x: 200, y: height - 210, type: 'platform', isPlatform: true }, // Plataforma corrida
          { x: 200, y: height - 115, type: 'obstacle3' },  // Púa 1
          { x: 290, y: height - 115, type: 'obstacle3' },  // Púa 2
          { x: 380, y: height - 115, type: 'obstacle3' }   // Púa 3 (última púa eliminada)
        ]
      },
      
      // Caja simple (700m)
      {
        distance: 700,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Púa solitaria (750m)
      {
        distance: 750,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' }
        ]
      },
      
      // ÚLTIMA PLATAFORMA sin púas (800m)
      {
        distance: 800,
        obstacles: [
          { x: 150, y: height - 200, type: 'platform', isPlatform: true }
        ]
      },
      
      // Caja simple (850m)
      {
        distance: 850,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // SPRINT FINAL - 3 púas consecutivas (950m) - FINAL DEL NIVEL 1
      {
        distance: 950,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' },     // Púa 1
          { x: 300, y: height - 115, type: 'obstacle3' },   // Púa 2 (300px de espacio)
          { x: 600, y: height - 115, type: 'obstacle3' }    // Púa 3 (300px de espacio) → Nivel 2
        ]
      }
    ];
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Fondo
    this.cameras.main.setBackgroundColor(this.levelColors[0].bg);

    // Agregar elementos visuales de fondo para que se vea más dinámico
    this.createBackgroundElements();

    // Suelo
    this.ground = this.add.tileSprite(width / 2, height - 50, width * 2, 100, 'ground');
    this.physics.add.existing(this.ground, true);

    // Robot con efecto de brillo
    this.robot = this.physics.add.sprite(200, height - 200, 'robot');
    this.robot.setCollideWorldBounds(true);
    
    // ⚡ Gravedad aumentada para caída más rápida (Geometry Dash style)
    if (this.robot.body) {
      this.robot.body.setGravityY(1500);
    }
    
    this.physics.add.collider(this.robot, this.ground);
    
    // Efecto de brillo sutil en el robot
    this.tweens.add({
      targets: this.robot,
      alpha: 0.9,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Grupos de obstáculos, plataformas y huecos
    this.obstacles = this.physics.add.group();
    this.platforms = this.physics.add.group();
    this.gaps = this.add.group();
    
    // Zona de muerte (debajo del suelo)
    this.deathZone = height + 100;

    // UI
    this.createUI();

    // Controles
    this.setupControls();

    // Colisiones
    this.obstacleCollider = this.physics.add.overlap(this.robot, this.obstacles, this.hitObstacle, undefined, this) as Phaser.Physics.Arcade.Collider;
    
    // 👻 Colisión con plataformas que detecta choques laterales
    this.platformCollider = this.physics.add.collider(this.robot, this.platforms, this.hitPlatform as any, undefined, this) as Phaser.Physics.Arcade.Collider;

    // Update loop para distancia, velocidad y spawning de chunks
    this.time.addEvent({
      delay: 100,
      callback: this.updateGame,
      callbackScope: this,
      loop: true
    });
  }

  private createUI(): void {
    const { width, height } = this.cameras.main;

    // Vidas
    this.livesText = this.add.text(20, 20, `Vidas: ${this.lives}`, {
      fontSize: '32px',
      color: '#ff0000',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    });

    // Distancia (puntaje)
    this.distanceText = this.add.text(width - 20, 20, `${this.distance}m`, {
      fontSize: '32px',
      color: '#00ff00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(1, 0);

    // Nivel
    this.levelText = this.add.text(width / 2, 20, `NIVEL ${this.currentLevel}`, {
      fontSize: '40px',
      color: '#00ffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5, 0);

    // Texto de pausa (pequeño, esquina superior derecha, invisible al inicio)
    this.pauseText = this.add.text(width - 20, 70, 'PAUSA\n(ESC para continuar)', {
      fontSize: '20px',
      color: '#ffff00',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0).setVisible(false);
  }

  private setupControls(): void {
    // Toque/click en pantalla
    this.input.on('pointerdown', () => {
      if (!this.isPaused) {
        this.jump();
      }
    });

    // Tecla de espacio
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.isPaused) {
        this.jump();
      }
    });

    // Tecla ESC para pausar/despausar
    this.input.keyboard?.on('keydown-ESC', () => {
      this.togglePause();
    });
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // Pausar el juego
      this.physics.pause();
      this.pauseText.setVisible(true);
    } else {
      // Reanudar el juego
      this.physics.resume();
      this.pauseText.setVisible(false);
    }
  }

  private jump(): void {
    if (this.robot.body) {
      const onGround = this.robot.body.touching.down;
      
      // Resetear isJumping inmediatamente si está en el suelo
      if (onGround) {
        this.isJumping = false;
      }
      
      // Permitir saltar si está en el suelo o acaba de dejarlo (coyote time)
      const canJump = onGround || this.coyoteTime < 150;
      
      if (canJump && !this.isJumping) {
        this.robot.setVelocityY(-1200); // ⚡ Salto alto (-1200) + gravedad aumentada (1500) = altura suficiente con caída rápida
        this.isJumping = true;
        this.coyoteTime = 999; // Resetear coyote time
        
        // Sonido de salto (beep)
        this.playJumpSound();
      } else if (!canJump && !this.isJumping) {
        // 🎯 Jump buffer mejorado de 150ms a 200ms (más perdón)
        this.jumpBuffer = 200;
      }
    }
  }

  private updateGame(): void {
    // No actualizar si está pausado
    if (this.isPaused) {
      return;
    }

    // Actualizar distancia
    this.distance += Math.floor(this.currentSpeed / 100);
    this.distanceText.setText(`${this.distance}m`);

    // Mover el suelo
    this.ground.tilePositionX += this.currentSpeed / 60;

    // Sistema de salto mejorado con coyote time y jump buffering
    if (this.robot.body) {
      const onGround = this.robot.body.touching.down;
      
      if (onGround) {
        this.isJumping = false;
        this.coyoteTime = 0;
        
        // Si hay un salto en el buffer, ejecutarlo
        if (this.jumpBuffer > 0) {
          this.jump();
          this.jumpBuffer = 0;
        }
      } else {
        // Incrementar coyote time cuando está en el aire
        this.coyoteTime += 100; // Se actualiza cada 100ms
      }
      
      // Decrementar jump buffer
      if (this.jumpBuffer > 0) {
        this.jumpBuffer -= 100;
        if (this.jumpBuffer < 0) this.jumpBuffer = 0;
      }
    }

    // Spawnear chunks predefinidos según la distancia
    this.spawnChunks();

    // Limpiar obstáculos que salieron de la pantalla (por la izquierda)
    this.cleanupOffscreenObstacles();

    // Actualizar nivel según distancia
    this.updateLevel();

    // Verificar victoria (3000m completa los 3 niveles)
    if (this.distance >= 3000 && !this.physics.world.isPaused) {
      console.log('✅ Alcanzaste 3000m - Llamando victoria...');
      this.victory();
    }
  }

  private cleanupOffscreenObstacles(): void {
    // Destruir obstáculos que salieron COMPLETAMENTE por la izquierda
    this.obstacles.children.entries.forEach((obstacle: any) => {
      if (obstacle && obstacle.x < -300) {
        obstacle.destroy();
      }
    });

    // Destruir plataformas que salieron por la izquierda
    this.platforms.children.entries.forEach((platform: any) => {
      if (platform && platform.x < -400) {
        platform.destroy();
      }
    });
  }
  
  private spawnChunks(): void {
    // Revisar si hay chunks que deban spawnearse
    for (let i = this.currentChunkIndex; i < this.levelChunks.length; i++) {
      const chunk = this.levelChunks[i];
      
      // Si alcanzamos la distancia del chunk y no lo hemos spawneado
      if (this.distance >= chunk.distance && !this.spawnedChunks.has(i)) {
        this.spawnChunkObstacles(chunk);
        this.spawnedChunks.add(i);
        this.currentChunkIndex = i + 1;
      }
    }
  }
  
  private spawnChunkObstacles(chunk: LevelChunk): void {
    const { width } = this.cameras.main;
    
    // El punto base de spawn debe estar lo suficientemente lejos para que 
    // todos los obstáculos (incluso el que tiene mayor x) aparezcan en pantalla
    const baseSpawnX = width + 100; // 100px de margen desde el borde derecho (aumentado)
    
    // Spawnear cada obstáculo del chunk con su posición relativa
    chunk.obstacles.forEach((obs, index) => {
      const spawnX = baseSpawnX + obs.x;
      
      if (obs.isPlatform) {
        // Crear plataforma
        this.createPlatform(spawnX, obs.y);
      } else {
        // Crear obstáculo normal
        this.createObstacle(spawnX, obs.y, obs.type);
      }
    });
  }

  private updateLevel(): void {
    let newLevel = this.currentLevel;
    let newSpeed = this.baseSpeed;

    // Progresión de 3 niveles
    if (this.distance >= 2000) {
      newLevel = 3;
      newSpeed = this.baseSpeed * 1.3; // Nivel 3 FINAL: +30% velocidad
    } else if (this.distance >= 1000) {
      newLevel = 2;
      newSpeed = this.baseSpeed * 1.35; // Nivel 2: +35% velocidad
    }

    // Modo turbo aumenta velocidad
    if (this.turboMode) {
      newSpeed *= 1.5;
    }

    this.currentSpeed = newSpeed;

    // Cambio de nivel
    if (newLevel !== this.currentLevel) {
      this.currentLevel = newLevel;
      this.showLevelTransition();
      // Por ahora el nivel 1 es el único que tiene diseño fijo
      // Los niveles 2 y 3 se agregarán después
    }
  }

  private showLevelTransition(): void {
    // Pausar el juego
    this.physics.pause();

    // Cambiar color de fondo
    this.cameras.main.setBackgroundColor(this.levelColors[this.currentLevel - 1].bg);

    // Texto de nivel
    const { width, height } = this.cameras.main;
    const levelName = this.levelColors[this.currentLevel - 1].name;
    
    const levelBanner = this.add.text(width / 2, height / 2 - 50, `¡NIVEL ${this.currentLevel}!`, {
      fontSize: '80px',
      color: '#ffff00',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#ff0000',
      strokeThickness: 8
    }).setOrigin(0.5);

    const levelNameText = this.add.text(width / 2, height / 2 + 50, levelName, {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.levelText.setText(`NIVEL ${this.currentLevel}`);

    // Sonido de nivel
    this.playLevelSound();

    // Animación
    levelBanner.setScale(0);
    this.tweens.add({
      targets: levelBanner,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Reanudar después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [levelBanner, levelNameText],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          levelBanner.destroy();
          levelNameText.destroy();
          this.physics.resume();
        }
      });
    });
  }


  private createObstacle(x: number, y: number, type: string): void {
    const obstacle = this.obstacles.create(x, y, type);
    obstacle.setVelocityX(-this.currentSpeed);
    obstacle.body.allowGravity = false;

    // Animación de rotación para barriles
    if (type === 'obstacle4') {
      this.tweens.add({
        targets: obstacle,
        angle: 360,
        duration: 1000,
        repeat: -1
      });
    }
    
    // Efecto de pulsación para obstáculos flotantes
    if (y < this.cameras.main.height - 180) {
      this.tweens.add({
        targets: obstacle,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // NO usar outOfBoundsKill automático - lo manejamos manualmente
    // para evitar que se destruyan prematuramente
  }


  private createPlatform(x: number, y: number): void {
    const platform = this.platforms.create(x, y, 'platform');
    platform.setImmovable(true);
    platform.body.allowGravity = false;
    platform.setVelocityX(-this.currentSpeed);
    
    // NO usar outOfBoundsKill automático - lo manejamos manualmente
  }

  private hitObstacle(robot: any, obstacle: any): void {
    if (this.isInvincible) {
      obstacle.destroy();
      return;
    }

    obstacle.destroy();

    // Perder una vida
    this.lives--;
    this.livesText.setText(`Vidas: ${this.lives}`);

    // Efecto visual
    this.cameras.main.shake(200, 0.01);
    this.robot.setTint(0xff0000);
    
    // Sonido de daño
    this.playHitSound();

    this.time.delayedCall(200, () => {
      this.robot.clearTint();
    });

    // Invencibilidad temporal
    this.isInvincible = true;
    this.time.delayedCall(1000, () => {
      this.isInvincible = false;
    });

    // Game over si no quedan vidas
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // 👻 Nueva función: Detecta choque lateral con plataformas (Geometry Dash style)
  private hitPlatform(robot: any, platform: any): void {
    if (this.isInvincible) {
      // Durante invencibilidad, el robot atraviesa plataformas
      return;
    }

    const robotBody = robot.body as Phaser.Physics.Arcade.Body;
    const platformBody = platform.body as Phaser.Physics.Arcade.Body;

    // Detectar si el choque es LATERAL (no desde arriba)
    const isLateralHit = (robotBody.touching.left && platformBody.touching.right) || 
                         (robotBody.touching.right && platformBody.touching.left);

    if (isLateralHit) {
      // 🚫 PRIMERO: Desactivar colisiones INMEDIATAMENTE para evitar empujón
      if (this.platformCollider) {
        this.platformCollider.active = false;
      }
      if (this.obstacleCollider) {
        this.obstacleCollider.active = false;
      }

      // 📍 Resetear posición X del robot a su posición normal (evita que quede pegado al borde)
      this.robot.x = 200;
      this.robot.setVelocityX(0); // Cancelar cualquier velocidad horizontal

      // ❌ Choque lateral = Perder vida + Invencibilidad
      this.lives--;
      this.livesText.setText(`Vidas: ${this.lives}`);

      // Efecto visual
      this.cameras.main.shake(200, 0.01);
      this.robot.setTint(0xff0000);
      
      // Sonido de daño
      this.playHitSound();

      this.time.delayedCall(200, () => {
        this.robot.clearTint();
      });

      // 👻 Activar invencibilidad temporal (0.2 segundos - ULTRA CORTO)
      this.isInvincible = true;
      this.invincibilityTimer = 200; // 0.2 segundos

      // Efecto de parpadeo (ULTRA CORTO)
      this.tweens.add({
        targets: this.robot,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 2, // 2 repeticiones = ~0.2 segundos
        onComplete: () => {
          this.robot.alpha = 1; // Restaurar opacidad
          this.isInvincible = false;
          this.invincibilityTimer = 0;
          
          // Reactivar colisiones
          if (this.platformCollider) {
            this.platformCollider.active = true;
          }
          if (this.obstacleCollider) {
            this.obstacleCollider.active = true;
          }
        }
      });

      // Game over si no quedan vidas
      if (this.lives <= 0) {
        this.gameOver();
      }
    }
    // Si el choque es desde arriba, actúa como plataforma normal (no hace nada especial)
  }


  private async gameOver(): Promise<void> {
    this.physics.pause();

    // Guardar puntaje
    await StorageManager.saveScore(this.distance, this.currentLevel);

    this.cameras.main.fadeOut(500);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameOverScene', { 
        distance: this.distance, 
        level: this.currentLevel 
      });
    });
  }

  private async victory(): Promise<void> {
    console.log('🎉 VICTORIA! Llegaste a 3000m');
    
    this.physics.pause();

    // Guardar puntaje
    await StorageManager.saveScore(this.distance, this.currentLevel);

    this.cameras.main.fadeOut(500);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('VictoryScene', {
        distance: this.distance,
        level: this.currentLevel
      });
    });
  }

  private createBackgroundElements(): void {
    const { width, height } = this.cameras.main;
    
    // Crear elementos visuales de fondo para darle vida al nivel
    // Ventanas/luces en el fondo
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(100, height - 400);
      const size = Phaser.Math.Between(20, 40);
      
      const light = this.add.rectangle(x, y, size, size, 0x3a506b, 0.3);
      
      // Efecto de parpadeo aleatorio
      this.tweens.add({
        targets: light,
        alpha: 0.6,
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
    
    // Líneas decorativas que se mueven (sensación de velocidad)
    for (let i = 0; i < 5; i++) {
      const line = this.add.graphics();
      line.lineStyle(2, 0x3a506b, 0.5);
      line.beginPath();
      line.moveTo(0, 0);
      line.lineTo(100, 0);
      line.strokePath();
      
      const y = Phaser.Math.Between(200, height - 300);
      line.setPosition(width + 100, y);
      
      // Mover de derecha a izquierda continuamente
      this.tweens.add({
        targets: line,
        x: -200,
        duration: 3000,
        repeat: -1,
        onRepeat: () => {
          line.setPosition(width + 100, Phaser.Math.Between(200, height - 300));
        }
      });
    }
  }

  private playJumpSound(): void {
    // Frecuencia alta para salto
    const oscillator = this.sound.context?.createOscillator();
    const gainNode = this.sound.context?.createGain();
    
    if (oscillator && gainNode && this.sound.context) {
      oscillator.connect(gainNode);
      gainNode.connect(this.sound.context.destination);
      
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(this.sound.context.currentTime + 0.1);
    }
  }

  private playHitSound(): void {
    // Frecuencia baja para daño
    const oscillator = this.sound.context?.createOscillator();
    const gainNode = this.sound.context?.createGain();
    
    if (oscillator && gainNode && this.sound.context) {
      oscillator.connect(gainNode);
      gainNode.connect(this.sound.context.destination);
      
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.value = 0.2;
      
      oscillator.start();
      oscillator.stop(this.sound.context.currentTime + 0.2);
    }
  }

  private playLevelSound(): void {
    // Sonido ascendente para nuevo nivel
    const oscillator = this.sound.context?.createOscillator();
    const gainNode = this.sound.context?.createGain();
    
    if (oscillator && gainNode && this.sound.context) {
      oscillator.connect(gainNode);
      gainNode.connect(this.sound.context.destination);
      
      oscillator.frequency.setValueAtTime(400, this.sound.context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, this.sound.context.currentTime + 0.5);
      gainNode.gain.value = 0.15;
      
      oscillator.start();
      oscillator.stop(this.sound.context.currentTime + 0.5);
    }
  }

}

