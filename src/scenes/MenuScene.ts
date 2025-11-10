import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fade in de la cámara
    this.cameras.main.fadeIn(500);

    // Fondo con gradiente animado
    const bg1 = this.add.rectangle(width / 2, height / 3, width, height / 3, 0x001133);
    const bg2 = this.add.rectangle(width / 2, height * 2 / 3, width, height / 3, 0x002244);
    const bg3 = this.add.rectangle(width / 2, height, width, height / 3, 0x003355);

    // Animación de fondo
    this.tweens.add({
      targets: [bg1, bg2, bg3],
      y: '+=50',
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Título del juego
    const title = this.add.text(width / 2, 200, 'ROBOT', {
      fontSize: '96px',
      color: '#00ff00',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#004400',
      strokeThickness: 8
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, 300, 'RUNNER', {
      fontSize: '96px',
      color: '#00ffff',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#004444',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Animación del título
    this.tweens.add({
      targets: [title, subtitle],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Robot decorativo
    const robotDecor = this.add.graphics();
    robotDecor.fillStyle(0x00ff00);
    robotDecor.fillRect(-30, -40, 60, 80);
    robotDecor.fillStyle(0x00cc00);
    robotDecor.fillRect(-20, -30, 40, 40);
    robotDecor.fillStyle(0xffff00);
    robotDecor.fillCircle(-10, -15, 5);
    robotDecor.fillCircle(10, -15, 5);
    robotDecor.setPosition(width / 2, 500);

    this.tweens.add({
      targets: robotDecor,
      y: 520,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Botones
    const buttonY = 700;
    const buttonSpacing = 120;

    this.createButton(width / 2, buttonY, 'JUGAR', 0x00ff00, () => {
      this.startGame();
    });

    this.createButton(width / 2, buttonY + buttonSpacing, 'PUNTAJES', 0x00aaff, () => {
      this.showScores();
    });

    this.createButton(width / 2, buttonY + buttonSpacing * 2, 'CRÉDITOS', 0xffaa00, () => {
      this.showCredits();
    });

    // Instrucciones
    this.add.text(width / 2, height - 100, 'Toca la pantalla para saltar', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private createButton(x: number, y: number, text: string, color: number, callback: () => void): void {
    const button = this.add.container(x, y);

    // Fondo del botón
    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRoundedRect(-150, -40, 300, 80, 15);
    bg.fillStyle(color - 0x002200);
    bg.fillRoundedRect(-145, -35, 290, 70, 12);

    // Texto del botón
    const label = this.add.text(0, 0, text, {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    button.add([bg, label]);

    // Interactividad
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

  private startGame(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  private showScores(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('ScoresScene');
    });
  }

  private showCredits(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CreditsScene');
    });
  }
}

