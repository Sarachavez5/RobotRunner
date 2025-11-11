import Phaser from 'phaser';
import { StorageManager } from '../utils/StorageManager';


interface LevelChunk {
  distance: number; 
  obstacles: Array<{
    x: number;        
    y: number;        
    type: string;    
    isPlatform?: boolean; 
  }>;
}
// Escena principal del juego
export class GameScene extends Phaser.Scene {
  private robot!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.GameObjects.TileSprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.Group;
  private gaps!: Phaser.GameObjects.Group;
  private portals!: Phaser.Physics.Arcade.Group;
  private deathZone: number = 0;
  
  // Colliders
  private platformCollider!: Phaser.Physics.Arcade.Collider;
  private obstacleCollider!: Phaser.Physics.Arcade.Collider;
  private groundCollider!: Phaser.Physics.Arcade.Collider; // ← nuevo
  
  private lives: number = 3;
  private distance: number = 0;
  private currentLevel: number = 1;
  private baseSpeed: number = 300;
  private currentSpeed: number = 300;
  
  private isJumping: boolean = false;
  private isInvincible: boolean = false;
  private invincibilityTimer: number = 0; // Tiempo restante de invencibilidad
  private coyoteTime: number = 0; // Tiempo para permitir salto después de dejar el suelo
  private jumpBuffer: number = 0; 
  
  private livesText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  
  private isPaused: boolean = false;
  private pauseButton!: Phaser.GameObjects.Container;
  private pauseOverlay!: Phaser.GameObjects.Container;
  
  
  private isFlying: boolean = false;
  private flyMaxSpeed = 1200; // Velocidad máxima durante el vuelo
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private flyZoneEntered: boolean = false;
  private flyZoneExited: boolean = false;
  
  // Nivel y chunks
  private levelChunks!: LevelChunk[];
  private currentChunkIndex: number = 0;
  private spawnedChunks: Set<number> = new Set();
  
  private levelColors = [
    { bg: 0x1a1a2e, ground: 0x16213e, name: 'Fábrica Oscura' },      // Nivel 1
    { bg: 0x0f4c75, ground: 0x1b262c, name: 'Zona Industrial' },     // Nivel 2
    { bg: 0xff6348, ground: 0xe55039, name: 'Reactor Final' }        // Nivel 3
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(): void {
    // Inicializar variables
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
    
    // Crear el diseño del nivel
    this.createLevelDesign();
  }
  
  private createLevelDesign(): void {
    const { height } = this.cameras.main;
    
    // ═══════════════════════════════════════════════════════════
    // 🔴 NIVEL 1 - INTRODUCCIÓN A LAS PÚAS Y PLATAFORMAS (0m - 1000m)
    // Como Geometry Dash
    this.levelChunks = [
      // Bloque inicial (0m)
      {
        distance: 80,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Bloque simple (140m)
      {
        distance: 140,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },
      
      // Púa simple (200m)
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
      
      // Plataforma con púas (620m) - FINAL DEL NIVEL 1
      {
        distance: 620,
        obstacles: [
          { x: 200, y: height - 210, type: 'platform', isPlatform: true }, // Plataforma corrida
          { x: 200, y: height - 115, type: 'obstacle3' },  // Púa 1
          { x: 290, y: height - 115, type: 'obstacle3' },  // Púa 2
          { x: 380, y: height - 115, type: 'obstacle3' }   // Púa 3
        ]
      },

      // 3 PÚAS FINALES - FINAL DEL NIVEL 1 (680m)
      {
        distance: 680,
        obstacles: [
          { x: 180, y: height - 115, type: 'obstacle3' },  // Movida más a la derecha
          { x: 420, y: height - 115, type: 'obstacle3' },  // Más separada
          { x: 660, y: height - 115, type: 'obstacle3' }   // Más separada
        ]
      },

      // ═══════════════════════════════════════════════════════════
      // 🔵 NIVEL 2 - ESCALERA ASCENDENTE (1000m - 2000m)
      // ═══════════════════════════════════════════════════════════

      // ESCALERA ASCENDENTE (930m) - Sin superposiciones (inicio del Nivel 2)
      {
        distance: 930,
        obstacles: [
          // Escalón 1: Plataforma baja
          { x: 0, y: height - 180, type: 'platform', isPlatform: true },
          
          // 2 púas - MOVIDAS MÁS A LA DERECHA
          { x: 200, y: height - 115, type: 'obstacle3' },
          { x: 260, y: height - 115, type: 'obstacle3' },
          
          // Escalón 2: Plataforma media
          { x: 380, y: height - 220, type: 'platform', isPlatform: true },
          
          // 2 púas
          { x: 520, y: height - 115, type: 'obstacle3' },
          { x: 580, y: height - 115, type: 'obstacle3' },
          
          // Escalón 3: Plataforma alta
          { x: 700, y: height - 260, type: 'platform', isPlatform: true },
          
          // 2 púas
          { x: 840, y: height - 115, type: 'obstacle3' },
          { x: 900, y: height - 115, type: 'obstacle3' },
          
          // Escalón 4: Plataforma muy alta
          { x: 1020, y: height - 300, type: 'platform', isPlatform: true },
          
          // 1 púa final
          { x: 1160, y: height - 115, type: 'obstacle3' }
        ]
      },

      // Bloques: pequeño y grande separados (1120m)
      {
        distance: 1120,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' },              // pequeño
          { x: 280, y: height - 140, type: 'obstacle2' }             // grande (corrida para dar respiro)
        ]
      },

      // Plataformas pegadas → 3 púas → 4 plataformas (1220m)
      {
        distance: 1220,
        obstacles: [
          // 4 plataformas pegadas (base continua)
          { x: 0, y: height - 200, type: 'platform', isPlatform: true },
          { x: 110, y: height - 200, type: 'platform', isPlatform: true },
          { x: 220, y: height - 200, type: 'platform', isPlatform: true },
          { x: 330, y: height - 200, type: 'platform', isPlatform: true },
          
          // 3 púas en el suelo
          { x: 480, y: height - 115, type: 'obstacle3' },
          { x: 540, y: height - 115, type: 'obstacle3' },
          { x: 600, y: height - 115, type: 'obstacle3' },
          
          // 4 plataformas pegadas para aterrizar
          { x: 720, y: height - 200, type: 'platform', isPlatform: true },
          { x: 830, y: height - 200, type: 'platform', isPlatform: true },
          { x: 940, y: height - 200, type: 'platform', isPlatform: true },
          { x: 1050, y: height - 200, type: 'platform', isPlatform: true }
        ]
      },

      // Sección rítmica 1 (1350m) - 2 púas y plataforma media
      {
        distance: 1350,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' },
          { x: 60, y: height - 115, type: 'obstacle3' },
          { x: 220, y: height - 220, type: 'platform', isPlatform: true }
        ]
      },

      // Plataformas alternadas (1500m) - sin púas
      {
        distance: 1500,
        obstacles: [
          { x: 0, y: height - 210, type: 'platform', isPlatform: true },
          { x: 220, y: height - 250, type: 'platform', isPlatform: true },
          { x: 440, y: height - 200, type: 'platform', isPlatform: true }
        ]
      },

      // Sprint de 3 púas espaciadas (1650m)
      {
        distance: 1650,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' },
          { x: 280, y: height - 115, type: 'obstacle3' },
          { x: 560, y: height - 115, type: 'obstacle3' }
        ]
      },

      // Doble plataforma con hueco y 2 púas en el piso (1800m)
      {
        distance: 1800,
        obstacles: [
          { x: 0, y: height - 200, type: 'platform', isPlatform: true },
          { x: 340, y: height - 115, type: 'obstacle3' },
          { x: 420, y: height - 115, type: 'obstacle3' },
          { x: 540, y: height - 230, type: 'platform', isPlatform: true }
        ]
      },

      // Saltos sobre cajas (1900m)
      {
        distance: 1900,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' },
          { x: 320, y: height - 110, type: 'obstacle1' },
          { x: 660, y: height - 110, type: 'obstacle2' }
        ]
      },

      // Final de Nivel 2 (1960m) - patrón mixto, prepara nivel 3
      {
        distance: 1960,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' },
          { x: 380, y: height - 210, type: 'platform', isPlatform: true },
          { x: 540, y: height - 115, type: 'obstacle3' },
          { x: 820, y: height - 115, type: 'obstacle3' }
        ]
      },

      // ═══════════════════════════════════════════════════════════
      // 🟠 NIVEL 3 (2000m - 3000m) - Portales y desafío final
      // ═══════════════════════════════════════════════════════════

      // Inicio del nivel 3 - Una púa sola (2050m)
      {
        distance: 2050,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' }
        ]
      },

      // Caja simple (2180m)
      {
        distance: 2180,
        obstacles: [
          { x: 0, y: height - 110, type: 'obstacle1' }
        ]
      },

      // Plataforma alta (2300m)
      {
        distance: 2300,
        obstacles: [
          { x: 0, y: height - 240, type: 'platform', isPlatform: true }
        ]
      },

      // ═══════════════════════════════════════════════════════════
      // ✈️ ZONA DE VUELO: 2450m - 2900m (Obstáculos distribuidos)
      // Obstáculos en ALTO (800-1000), MEDIO (500-700), BAJO (250-400)
      // ═══════════════════════════════════════════════════════════

      // Patrón 1 (2500m) - Obstáculo abajo, obliga a ir arriba
      {
        distance: 2500,
        obstacles: [
          { x: 0, y: height - 300, type: 'obstacle2' }  // ABAJO - debes ir ARRIBA
        ]
      },

      // Patrón 2 (2580m) - Obstáculo arriba, obliga a ir abajo
      {
        distance: 2580,
        obstacles: [
          { x: 0, y: height - 900, type: 'obstacle2' }  // ARRIBA - debes ir ABAJO
        ]
      },

      // Patrón 3 (2660m) - Obstáculo en medio, puedes ir arriba o abajo
      {
        distance: 2660,
        obstacles: [
          { x: 0, y: height - 600, type: 'obstacle2' }  // MEDIO - elige arriba o abajo
        ]
      },

      // Patrón 4 (2730m) - Dos obstáculos: arriba y abajo, debes ir al medio
      {
        distance: 2730,
        obstacles: [
          { x: 0, y: height - 950, type: 'obstacle1' },  // ARRIBA
          { x: 0, y: height - 280, type: 'obstacle1' }   // ABAJO - debes pasar por el MEDIO
        ]
      },

      // Patrón 5 (2800m) - Obstáculo abajo
      {
        distance: 2800,
        obstacles: [
          { x: 0, y: height - 350, type: 'obstacle2' }  // ABAJO
        ]
      },

      // Patrón 6 (2870m) - Obstáculo arriba (último antes de salir)
      {
        distance: 2870,
        obstacles: [
          { x: 0, y: height - 850, type: 'obstacle2' }  // ARRIBA
        ]
      },

      // === FIN ZONA DE VUELO A LOS 2900m ===

      // Plataforma de aterrizaje después del vuelo (2910m)
      {
        distance: 2910,
        obstacles: [
          { x: 0, y: height - 220, type: 'platform', isPlatform: true }
        ]
      },

      // Sprint final de púas (2930m) - Última prueba antes de la victoria
      {
        distance: 2930,
        obstacles: [
          { x: 0, y: height - 115, type: 'obstacle3' }
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
    
    this.groundCollider = this.physics.add.collider(this.robot, this.ground);
    
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
    this.portals = this.physics.add.group();
    
    // Overlap global con portales (más robusto que por-portal)
    const portalOverlap = this.physics.add.overlap(this.robot, this.portals, this.onPortalOverlap as any, undefined, this);
    console.log(`✅ Overlap entre robot y portales registrado:`, portalOverlap);

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

    // Tecla SPACE para vuelo
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

    // Botón de pausa (visible siempre en la esquina superior derecha)
    this.createPauseButton();
    
    // Crear overlay de pausa (invisible al inicio)
    this.createPauseOverlay();
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

  private createPauseButton(): void {
    const { width } = this.cameras.main;
    
    this.pauseButton = this.add.container(width - 60, 150);
    
    // Fondo del botón
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-30, -30, 60, 60, 10);
    bg.lineStyle(3, 0xffff00);
    bg.strokeRoundedRect(-30, -30, 60, 60, 10);
    
    // Ícono de pausa (dos barras ||)
    const pauseIcon = this.add.graphics();
    pauseIcon.fillStyle(0xffff00);
    pauseIcon.fillRect(-12, -15, 8, 30);
    pauseIcon.fillRect(4, -15, 8, 30);
    
    this.pauseButton.add([bg, pauseIcon]);
    this.pauseButton.setSize(60, 60);
    this.pauseButton.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
    this.pauseButton.setDepth(1000);
    
    // Animación al hacer hover
    this.pauseButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.pauseButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150
      });
    });
    
    this.pauseButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.pauseButton,
        scaleX: 1,
        scaleY: 1,
        duration: 150
      });
    });
    
    // Al hacer clic, pausar
    this.pauseButton.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation(); // Evitar que el clic active el salto
      this.togglePause();
    });
  }

  private createPauseOverlay(): void {
    const { width, height } = this.cameras.main;
    
    this.pauseOverlay = this.add.container(0, 0);
    this.pauseOverlay.setDepth(999);
    
    // Fondo oscuro semitransparente
    const darkBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);
    
    // Panel central
    const panelWidth = 500;
    const panelHeight = 550;
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x001a33, 1);
    panelBg.fillRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 20);
    panelBg.lineStyle(5, 0x00ffff);
    panelBg.strokeRoundedRect(width / 2 - panelWidth / 2, height / 2 - panelHeight / 2, panelWidth, panelHeight, 20);
    
    // Título PAUSA
    const pauseTitle = this.add.text(width / 2, height / 2 - 180, 'PAUSA', {
      fontSize: '72px',
      color: '#ffff00',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#ff8800',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Ícono de pausa grande
    const pauseIconBig = this.add.graphics();
    pauseIconBig.fillStyle(0x00ffff);
    pauseIconBig.fillRect(width / 2 - 40, height / 2 - 80, 25, 80);
    pauseIconBig.fillRect(width / 2 + 15, height / 2 - 80, 25, 80);
    
    // Botón de continuar
    const continueButton = this.createPauseMenuButton(width / 2, height / 2 + 50, 'CONTINUAR', 0x00aa00, () => {
      this.togglePause();
    });
    
    // Botón de menú
    const menuButton = this.createPauseMenuButton(width / 2, height / 2 + 160, 'IR AL MENÚ', 0xaa0000, () => {
      this.goToMenu();
    });
    
    // Texto de ayuda
    const helpText = this.add.text(width / 2, height / 2 + 250, 'Presiona ESC o el botón de pausa\npara continuar', {
      fontSize: '20px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);
    
    this.pauseOverlay.add([darkBg, panelBg, pauseTitle, pauseIconBig, continueButton, menuButton, helpText]);
    this.pauseOverlay.setVisible(false);
  }

  private createPauseMenuButton(x: number, y: number, text: string, color: number, callback: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRoundedRect(-150, -40, 300, 80, 15);
    bg.fillStyle(color - 0x002200);
    bg.fillRoundedRect(-145, -35, 290, 70, 12);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(300, 80);
    button.setInteractive(new Phaser.Geom.Rectangle(-150, -40, 300, 80), Phaser.Geom.Rectangle.Contains);
    
    button.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation();
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
    
    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200
      });
    });
    
    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });
    
    return button;
  }

  private goToMenu(): void {
    this.physics.resume();
    this.isPaused = false;
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // Pausar el juego
      this.physics.pause();
      this.pauseOverlay.setVisible(true);
    } else {
      // Reanudar el juego
      this.physics.resume();
      this.pauseOverlay.setVisible(false);
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

  // update() se ejecuta en cada frame (60 fps) - Para detección precisa de colisiones
  update(): void {
    if (this.isPaused || !this.robot || !this.robot.body) return;
    
    // Log periódico para verificar que update() se está ejecutando
    if (this.portals.children.size > 0 && Math.floor(Date.now() / 1000) % 5 === 0) {
      console.log(`🔄 update() ejecutándose - Portales: ${this.portals.children.size}, isFlying: ${this.isFlying}`);
    }
    
    // Actualizar posición de las etiquetas de los portales
    this.portals.children.entries.forEach((portal: any) => {
      if (portal && portal.portalLabel && portal.active) {
        portal.portalLabel.x = portal.x;
        portal.portalLabel.y = portal.y;
      }
    });
    
    // Verificar colisiones con portales en cada frame para mejor precisión
    this.checkPortalCollisions();
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

    // Debug: mostrar cuántos portales hay en pantalla
    if (this.portals.children.size > 0 && Math.floor(this.distance) % 100 === 0) {
      console.log(`🌀 Portales activos: ${this.portals.children.size}, distancia: ${this.distance}m, isFlying: ${this.isFlying}`);
    }

    // Control de vuelo
    if (this.isFlying) {
      // Empuje hacia arriba si se mantiene click/space, si no cae suave
      const upPressed = this.input.activePointer.isDown || !!this.spaceKey?.isDown;
      if (upPressed) {
        // Aceleración MUY RÁPIDA hacia arriba
        this.robot.setVelocityY(Math.max(this.robot.body.velocity.y - 120, -this.flyMaxSpeed));
      } else {
        // Caída MUY RÁPIDA cuando sueltas
        this.robot.setVelocityY(Math.min(this.robot.body.velocity.y + 100, this.flyMaxSpeed));
      }
      // Inclinación visual según velocidad
      this.robot.setAngle(Phaser.Math.Clamp(-this.robot.body.velocity.y / 20, -30, 30));
      // Mantener dentro de pantalla
      if (this.robot.y < 80) this.robot.y = 80;
      if (this.robot.y > this.cameras.main.height - 70) this.robot.y = this.cameras.main.height - 70;
      
      // Log cada segundo para debug
      if (Math.floor(this.distance) % 50 === 0) {
        console.log(`✈️ VOLANDO - distancia: ${this.distance}m, velocidad Y: ${this.robot.body.velocity.y}`);
      }
    } else {
      this.robot.setAngle(0);
    }

    // 🔥 ACTIVAR MODO VUELO POR DISTANCIA CON INDICADOR VISUAL
    // Zona de vuelo MÁS LARGA: 2450m - 2900m (450 metros de vuelo)
    if (this.distance >= 2450 && this.distance < 2900 && !this.isFlying && !this.flyZoneEntered) {
      console.log('🚀 ACTIVANDO MODO VUELO AUTOMÁTICO a los 2450m');
      this.showFlyZoneIndicator('enter');
      this.enterFlyMode();
      this.flyZoneEntered = true;
    }
    
    if (this.distance >= 2900 && this.isFlying && !this.flyZoneExited) {
      console.log('🚶 DESACTIVANDO MODO VUELO AUTOMÁTICO a los 2900m');
      this.showFlyZoneIndicator('exit');
      this.exitFlyMode();
      this.flyZoneExited = true;
    }

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

    // Destruir portales que salieron por la izquierda
    this.portals.children.entries.forEach((portal: any) => {
      if (portal && portal.x < -300) {
        portal.destroy();
      }
    });
  }
  
  private spawnChunks(): void {
    // Revisar si hay chunks que deban spawnearse
    for (let i = this.currentChunkIndex; i < this.levelChunks.length; i++) {
      const chunk = this.levelChunks[i];
      
      // Si alcanzamos la distancia del chunk y no lo hemos spawneado
      if (this.distance >= chunk.distance && !this.spawnedChunks.has(i)) {
        console.log(`📦 Spawneando chunk #${i} a distancia ${chunk.distance}m (actual: ${this.distance}m)`);
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
      
      if (obs.type === 'portal_fly') {
        this.createPortal(spawnX, obs.y, 'fly');
      } else if (obs.type === 'portal_ground') {
        this.createPortal(spawnX, obs.y, 'ground');
      } else if (obs.isPlatform) {
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
    } else if (this.distance >= 720) {
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
    this.isPaused = true;
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
          this.isPaused = false;
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

  // Portales de modo vuelo
  private createPortal(x: number, y: number, kind: 'fly' | 'ground'): void {
    // Crear textura del portal en tiempo real
    const color = kind === 'fly' ? 0x00ffff : 0xff00ff;
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 0.9);
    graphics.fillRect(0, 0, 120, 280);
    graphics.generateTexture(`portal_${kind}_${Date.now()}`, 120, 280);
    graphics.destroy();
    
    // IMPORTANTE: Usar SPRITE para que la física funcione
    const portal = this.physics.add.sprite(x, y, `portal_${kind}_${Date.now()}`);
    portal.setDepth(10);
    
    // Guardar el tipo de portal
    (portal as any).portalKind = kind;
    (portal as any).activated = false;
    
    // Configurar física
    const body = portal.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(-this.currentSpeed);
    body.setSize(120, 280);
    
    // Texto visible
    const label = this.add.text(x, y, kind === 'fly' ? '✈️ VOLAR' : '🚶 SUELO', { 
      fontSize: '28px', 
      color: '#000',
      fontStyle: 'bold',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setDepth(11);
    (portal as any).portalLabel = label;
    
    console.log(`🌀 Portal ${kind} creado en x:${x} y:${y}`);
    console.log(`   Velocidad: ${body.velocity.x}, Body enabled: ${body.enable}`);
    
    // Agregar al grupo
    this.portals.add(portal);
    
    console.log(`   ✅ Portal SPRITE agregado. Total: ${this.portals.children.size}`);
  }
  
  // Verificar colisiones con portales (llamado desde updateGame)
  private checkPortalCollisions(): void {
    if (this.portals.children.size === 0) return;
    
    // Log posiciones cada segundo
    const now = Math.floor(Date.now() / 1000);
    const shouldLog = now % 2 === 0;
    
    this.portals.children.entries.forEach((portal: any) => {
      if (!portal || !portal.active) return;
      
      if (portal.activated) return;
      
      // Log SIEMPRE la distancia entre robot y portal
      const distance = Math.abs(portal.x - this.robot.x);
      if (shouldLog) {
        console.log(`📍 Robot X:${Math.floor(this.robot.x)}, Portal X:${Math.floor(portal.x)}, Distancia: ${Math.floor(distance)}px, Kind: ${portal.portalKind}`);
      }
      
      // Verificar overlap manual
      const robotBounds = this.robot.getBounds();
      const portalBounds = portal.getBounds();
      
      // Log cada vez que hay un portal cerca
      if (distance < 400) {
        console.log(`🔍 Portal CERCA! Distancia: ${distance}px, Robot X:${this.robot.x}, Portal X:${portal.x}, Portal Kind: ${portal.portalKind}`);
        console.log(`Robot bounds: x:${robotBounds.x}, y:${robotBounds.y}, w:${robotBounds.width}, h:${robotBounds.height}`);
        console.log(`Portal bounds: x:${portalBounds.x}, y:${portalBounds.y}, w:${portalBounds.width}, h:${portalBounds.height}`);
      }
      
      if (Phaser.Geom.Intersects.RectangleToRectangle(robotBounds, portalBounds)) {
        portal.activated = true;
        const kind = portal.portalKind;
        
        console.log(`🎯 ¡¡¡COLISIÓN DETECTADA!!! Portal ${kind} ACTIVADO en ${this.distance}m - isFlying antes: ${this.isFlying}`);
        
        if (kind === 'fly') {
          this.enterFlyMode();
        } else {
          this.exitFlyMode();
        }
        
        console.log(`🎯 Portal ${kind} - isFlying después: ${this.isFlying}`);
        
        // Consumir el portal y sus elementos visuales
        if (portal.portalLabel) portal.portalLabel.destroy();
        portal.destroy();
      }
    });
  }

  // Manejador central de overlaps con portales usando Arcade Physics
  private onPortalOverlap(_robot: any, portalObj: any): void {
    console.log(`🎯🎯🎯 OVERLAP DETECTADO POR PHASER ARCADE!!! 🎯🎯🎯`);
    const portal = portalObj as any;
    console.log(`   Portal object:`, portal);
    console.log(`   Portal kind: ${portal.portalKind}`);
    console.log(`   Portal activated: ${portal.activated}`);
    
    if (!portal) {
      console.log(`   ❌ Portal es null/undefined`);
      return;
    }
    
    if (portal.activated) {
      console.log(`   ⚠️ Portal ya fue activado antes`);
      return;
    }
    
    portal.activated = true;
    const kind = portal.portalKind || 'fly';
    console.log(`🎯 ACTIVANDO PORTAL ${kind} - distancia: ${this.distance}m`);
    
    if (kind === 'fly') {
      console.log(`   ➡️ Llamando enterFlyMode()`);
      this.enterFlyMode();
    } else {
      console.log(`   ➡️ Llamando exitFlyMode()`);
      this.exitFlyMode();
    }
    
    if (portal.portalLabel) portal.portalLabel.destroy();
    portal.destroy();
    console.log(`   ✅ Portal destruido`);
  }

  // Mostrar indicador visual de zona de vuelo
  private showFlyZoneIndicator(type: 'enter' | 'exit'): void {
    const { width, height } = this.cameras.main;
    const color = type === 'enter' ? 0x00ffff : 0xff00ff;
    const text = type === 'enter' ? '✈️ ZONA DE VUELO' : '🚶 FIN DE VUELO';
    const subtitle = type === 'enter' ? 'Mantén presionado para subir' : 'Modo normal activado';
    
    // Fondo semitransparente
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
    bg.setDepth(100);
    
    // Portal visual grande 
    const portal = this.add.rectangle(width / 2, height / 2 - 50, 300, 500, color, 0.8);
    portal.setDepth(101);
    
    // Borde del portal
    const border = this.add.rectangle(width / 2, height / 2 - 50, 320, 520, color, 0.3);
    border.setDepth(100);
    
    // Texto principal
    const label = this.add.text(width / 2, height / 2 - 50, text, {
      fontSize: '64px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(102);
    
    // Texto secundario
    const sublabel = this.add.text(width / 2, height / 2 + 80, subtitle, {
      fontSize: '32px',
      color: '#fff',
      fontStyle: 'bold',
      backgroundColor: '#000',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setDepth(102);
    
    // Animación de aparición
    bg.setAlpha(0);
    portal.setAlpha(0);
    border.setAlpha(0);
    label.setAlpha(0);
    sublabel.setAlpha(0);
    
    this.tweens.add({
      targets: [bg, portal, border, label, sublabel],
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
    
    // Animación de pulso del portal
    this.tweens.add({
      targets: [portal, border],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 400,
      yoyo: true,
      repeat: 2
    });
    
    // Desaparecer después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [bg, portal, border, label, sublabel],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          bg.destroy();
          portal.destroy();
          border.destroy();
          label.destroy();
          sublabel.destroy();
        }
      });
    });
  }

  private enterFlyMode(): void {
    console.log(`✈️ Intentando entrar en modo vuelo. isFlying actual: ${this.isFlying}`);
    if (this.isFlying) {
      console.log(`⚠️ Ya estaba en modo vuelo, saliendo...`);
      return;
    }
    this.isFlying = true;
    if (this.robot.body instanceof Phaser.Physics.Arcade.Body) {
      this.robot.body.setAllowGravity(false);
      // Impulso inicial MUY FUERTE hacia arriba
      this.robot.setVelocityY(-700);
      // Elevar al robot si está tocando el suelo
      this.robot.y -= 60;
      console.log(`✈️ Modo vuelo ACTIVADO - Gravedad desactivada, velocidad reseteada`);
    }
    this.groundCollider.active = false;
    if (this.platformCollider) this.platformCollider.active = false;
    
    // Efecto visual de activación
    this.cameras.main.flash(200, 0, 255, 255); // Flash cyan
  }

  private exitFlyMode(): void {
    console.log(`🚶 Intentando salir de modo vuelo. isFlying actual: ${this.isFlying}`);
    if (!this.isFlying) {
      console.log(`⚠️ No estaba en modo vuelo, saliendo...`);
      return;
    }
    this.isFlying = false;
    if (this.robot.body instanceof Phaser.Physics.Arcade.Body) {
      this.robot.body.setAllowGravity(true);
      console.log(`🚶 Modo vuelo DESACTIVADO - Gravedad reactivada`);
    }
    this.groundCollider.active = true;
    if (this.platformCollider) this.platformCollider.active = true;
    this.robot.setAngle(0);
    
    // Efecto visual de desactivación
    this.cameras.main.flash(200, 255, 0, 255); // Flash magenta
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
        level: this.currentLevel,
        lives: this.lives
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

