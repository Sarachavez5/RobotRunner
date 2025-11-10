import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Fondo con estrellas
    this.cameras.main.setBackgroundColor(0x000033);

    // Estrellas de fondo
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 1)
      );

      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Título
    const title = this.add.text(width / 2, 150, 'CRÉDITOS', {
      fontSize: '64px',
      color: '#00ffff',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#004444',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Robot decorativo
    const robot = this.add.graphics();
    robot.fillStyle(0x00ff00);
    robot.fillRect(-30, -40, 60, 80);
    robot.fillStyle(0x00cc00);
    robot.fillRect(-20, -30, 40, 40);
    robot.fillStyle(0xffff00);
    robot.fillCircle(-10, -15, 5);
    robot.fillCircle(10, -15, 5);
    robot.setPosition(width / 2, 280);

    this.tweens.add({
      targets: robot,
      rotation: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Sección de desarrollo
    this.add.text(width / 2, 400, 'DESARROLLO', {
      fontSize: '36px',
      color: '#ffaa00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 460, 'Sara Chavez', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 510, 'Cristian Usme', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 560, 'Maria Gomez', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Sección de tecnología
    this.add.text(width / 2, 680, 'TECNOLOGÍA', {
      fontSize: '36px',
      color: '#ffaa00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 740, 'Phaser 3 • Capacitor • TypeScript', {
      fontSize: '24px',
      color: '#00ffaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Sección de música
    this.add.text(width / 2, 850, 'AUDIO', {
      fontSize: '36px',
      color: '#ffaa00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 910, 'Sonidos generados con Web Audio API', {
      fontSize: '22px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Año y agradecimiento
    this.add.text(width / 2, 1020, '© 2025 RobotRunner', {
      fontSize: '24px',
      color: '#666666',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 1070, '¡Gracias por jugar!', {
      fontSize: '28px',
      color: '#00ff00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botón de volver
    this.createButton(width / 2, height - 120, 'VOLVER', 0x666666, () => {
      this.goBack();
    });
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

  private goBack(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}

