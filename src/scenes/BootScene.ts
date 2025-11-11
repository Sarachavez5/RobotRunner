import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
    console.log('🎮 BootScene constructor');
  }

  preload(): void {
    console.log('🎮 BootScene preload');
    // Crear assets gráficos y de audio
    this.createAssets();
  }

  create(): void {
    console.log('🎮 BootScene create - iniciando SplashScene');
    this.scene.start('SplashScene');
  }

  private createAssets(): void {
    // Crear textura de robot jugador 
    const robot = this.add.graphics();
    robot.fillStyle(0x00ff00);
    robot.fillRect(0, 0, 60, 80);
    robot.fillStyle(0x00cc00);
    robot.fillRect(10, 10, 40, 40);
    robot.fillStyle(0xffff00);
    robot.fillCircle(20, 25, 5);
    robot.fillCircle(40, 25, 5);
    robot.generateTexture('robot', 60, 80);
    robot.destroy();

    // Obstáculo tipo 1: Caja baja 
    const obstacle1 = this.add.graphics();
    obstacle1.fillStyle(0xff0000);
    obstacle1.fillRect(0, 0, 40, 50);
    obstacle1.fillStyle(0xaa0000);
    obstacle1.fillRect(5, 5, 30, 40);
    obstacle1.generateTexture('obstacle1', 40, 50);
    obstacle1.destroy();

    // Obstáculo tipo 2: Caja alta 
    const obstacle2 = this.add.graphics();
    obstacle2.fillStyle(0xff6600);
    obstacle2.fillRect(0, 0, 35, 80);
    obstacle2.fillStyle(0xcc5500);
    obstacle2.fillRect(5, 5, 25, 70);
    obstacle2.generateTexture('obstacle2', 35, 80);
    obstacle2.destroy();

    // Obstáculo tipo 3: Púa 
    const obstacle3 = this.add.graphics();
    obstacle3.fillStyle(0x9900ff);
    obstacle3.beginPath();
    obstacle3.moveTo(25, 0);
    obstacle3.lineTo(0, 60);
    obstacle3.lineTo(50, 60);
    obstacle3.closePath();
    obstacle3.fillPath();
    obstacle3.fillStyle(0x6600cc);
    obstacle3.beginPath();
    obstacle3.moveTo(25, 10);
    obstacle3.lineTo(10, 50);
    obstacle3.lineTo(40, 50);
    obstacle3.closePath();
    obstacle3.fillPath();
    obstacle3.generateTexture('obstacle3', 50, 60);
    obstacle3.destroy();

    // Obstáculo tipo 4: Obstáculo rodante 
    const obstacle4 = this.add.graphics();
    obstacle4.fillStyle(0xffcc00);
    obstacle4.fillCircle(30, 30, 30);
    obstacle4.fillStyle(0xaa8800);
    obstacle4.fillCircle(30, 30, 20);
    obstacle4.fillStyle(0xffcc00);
    obstacle4.fillRect(10, 25, 40, 10);
    obstacle4.generateTexture('obstacle4', 60, 60);
    obstacle4.destroy();

    // Obstáculo tipo 5: Obstáculo volador 
    const obstacle5 = this.add.graphics();
    obstacle5.fillStyle(0x00ffff);
    obstacle5.fillRect(0, 15, 45, 30);
    obstacle5.fillStyle(0x00aaaa);
    obstacle5.fillRect(5, 20, 35, 20);
    obstacle5.fillStyle(0x00ffff);
    obstacle5.fillCircle(0, 30, 10);
    obstacle5.fillCircle(45, 30, 10);
    obstacle5.generateTexture('obstacle5', 45, 60);
    obstacle5.destroy();

    // Crear textura de suelo
    const ground = this.add.graphics();
    ground.fillStyle(0x444444);
    ground.fillRect(0, 0, 800, 100);
    ground.fillStyle(0x666666);
    ground.fillRect(0, 0, 800, 20);
    ground.generateTexture('ground', 800, 100);
    ground.destroy();

    // Crear plataforma de parkour 
    const platform = this.add.graphics();
    platform.fillStyle(0xff6b35); // Naranja brillante
    platform.fillRect(0, 0, 140, 25); // Más grande (140x25)
    platform.fillStyle(0xff9966); // Naranja claro arriba
    platform.fillRect(0, 0, 140, 10);
    platform.fillStyle(0xcc5533); // Sombra
    platform.fillRect(0, 15, 140, 10);
    platform.generateTexture('platform', 140, 25);
    platform.destroy();

    // Crear textura de batería
    const battery = this.add.graphics();
    battery.fillStyle(0xffaa00);
    battery.fillRect(5, 0, 30, 10);
    battery.fillRect(0, 10, 40, 50);
    battery.fillStyle(0xffff00);
    battery.fillRect(5, 15, 30, 40);
    battery.generateTexture('battery', 40, 60);
    battery.destroy();

    // Crear textura de partícula
    const particle = this.add.graphics();
    particle.fillStyle(0xffffff);
    particle.fillCircle(4, 4, 4);
    particle.generateTexture('particle', 8, 8);
    particle.destroy();

    // Generar sonidos con Web Audio API
    this.generateSounds();
  }

  private generateSounds(): void {
    // Sonido de salto
  }
}

