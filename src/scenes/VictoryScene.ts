import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
  private distance: number = 0;
  private level: number = 3;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: { distance: number; level: number }): void {
    this.distance = data.distance || 0;
    this.level = data.level || 3;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Fondo brillante
    this.cameras.main.setBackgroundColor(0x001a00);

    // Partículas de celebración
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(3, 8),
        Phaser.Math.Between(0xffff00, 0x00ffff)
      );

      this.tweens.add({
        targets: particle,
        y: height + 50,
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Título Victoria
    const victoryText = this.add.text(width / 2, 200, '¡VICTORIA!', {
      fontSize: '80px',
      color: '#00ff00',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#006600',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Animación de entrada
    victoryText.setScale(0);
    this.tweens.add({
      targets: victoryText,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Bounce.easeOut'
    });

    // Subtítulo
    const subtitle = this.add.text(width / 2, 300, '¡Completaste los 3 niveles!', {
      fontSize: '36px',
      color: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const subtitle2 = this.add.text(width / 2, 350, '¡Sobreviviste al Reactor Final!', {
      fontSize: '28px',
      color: '#00ffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    subtitle.setAlpha(0);
    subtitle2.setAlpha(0);
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 800,
      delay: 600
    });
    this.tweens.add({
      targets: subtitle2,
      alpha: 1,
      duration: 800,
      delay: 900
    });

    // Robot feliz
    const robot = this.add.graphics();
    robot.fillStyle(0x00ff00);
    robot.fillRect(-30, -40, 60, 80);
    robot.fillStyle(0x00cc00);
    robot.fillRect(-20, -30, 40, 40);
    robot.fillStyle(0xffff00);
    robot.fillCircle(-10, -15, 5);
    robot.fillCircle(10, -15, 5);
    // Sonrisa
    robot.lineStyle(3, 0xffff00);
    robot.beginPath();
    robot.arc(0, 0, 15, 0, Math.PI, false);
    robot.strokePath();
    robot.setPosition(width / 2, 480);

    this.tweens.add({
      targets: robot,
      y: 460,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Estadísticas
    this.add.text(width / 2, 650, `Distancia total: ${this.distance}m`, {
      fontSize: '40px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(width / 2, 720, `3 Niveles Completados`, {
      fontSize: '32px',
      color: '#00ffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Nombres de los niveles completados
    const levelNames = [
      '✓ Fábrica Oscura',
      '✓ Zona Industrial', 
      '✓ Reactor Final'
    ];

    levelNames.forEach((name, index) => {
      const text = this.add.text(width / 2, 820 + (index * 40), name, {
        fontSize: '24px',
        color: '#aaaaaa',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        duration: 300,
        delay: 1200 + (index * 100)
      });
    });

    // Estrellas
    const stars = '⭐ ⭐ ⭐';
    this.add.text(width / 2, 970, stars, {
      fontSize: '56px',
      color: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botones
    this.createButton(width / 2, 1070, 'JUGAR DE NUEVO', 0x00aa00, () => {
      this.retry();
    });

    this.createButton(width / 2, 1180, 'MENÚ', 0x666666, () => {
      this.goToMenu();
    });

    // Sonido de victoria
    this.playVictorySound();
  }

  private createButton(x: number, y: number, text: string, color: number, callback: () => void): void {
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

  private playVictorySound(): void {
    const oscillator = this.sound.context?.createOscillator();
    const gainNode = this.sound.context?.createGain();
    
    if (oscillator && gainNode && this.sound.context) {
      oscillator.connect(gainNode);
      gainNode.connect(this.sound.context.destination);
      
      const notes = [523, 587, 659, 784]; // C, D, E, G
      let time = this.sound.context.currentTime;
      
      notes.forEach((freq, i) => {
        oscillator.frequency.setValueAtTime(freq, time + i * 0.15);
      });
      
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(time + 0.6);
    }
  }
}

