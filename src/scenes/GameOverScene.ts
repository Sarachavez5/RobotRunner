import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private distance: number = 0;
  private level: number = 1;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { distance: number; level: number }): void {
    this.distance = data.distance || 0;
    this.level = data.level || 1;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Fondo oscuro
    this.cameras.main.setBackgroundColor(0x1a0000);

    // Título Game Over
    const gameOverText = this.add.text(width / 2, 250, 'GAME OVER', {
      fontSize: '80px',
      color: '#ff0000',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#660000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Animación de entrada
    gameOverText.setScale(0);
    this.tweens.add({
      targets: gameOverText,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Bounce.easeOut'
    });

    // Robot triste
    const robot = this.add.graphics();
    robot.fillStyle(0x666666);
    robot.fillRect(-30, -40, 60, 80);
    robot.fillStyle(0x444444);
    robot.fillRect(-20, -30, 40, 40);
    robot.fillStyle(0x0000ff);
    robot.fillCircle(-10, -15, 5);
    robot.fillCircle(10, -15, 5);
    robot.setPosition(width / 2, 450);
    robot.setAlpha(0.7);

    // Estadísticas
    this.add.text(width / 2, 600, `Distancia: ${this.distance}m`, {
      fontSize: '40px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 670, `Nivel alcanzado: ${this.level}`, {
      fontSize: '32px',
      color: '#ffaa00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botones
    this.createButton(width / 2, 850, 'REINTENTAR', 0xff6600, () => {
      this.retry();
    });

    this.createButton(width / 2, 970, 'MENÚ', 0x666666, () => {
      this.goToMenu();
    });

    // Mensaje motivacional
    this.add.text(width / 2, height - 100, '¡Inténtalo de nuevo!', {
      fontSize: '24px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  private createButton(x: number, y: number, text: string, color: number, callback: () => void): void {
    const button = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRoundedRect(-150, -40, 300, 80, 15);
    bg.fillStyle(color - 0x002200);
    bg.fillRoundedRect(-145, -35, 290, 70, 12);

    const label = this.add.text(0, 0, text, {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    button.add([bg, label]);

    const hitArea = new Phaser.Geom.Rectangle(-150, -40, 300, 80);
    button.setSize(300, 80);
    button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    button.on('pointerdown', () => {
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
  }

  private retry(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  private goToMenu(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}

