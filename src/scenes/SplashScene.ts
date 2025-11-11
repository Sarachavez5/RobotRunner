import Phaser from 'phaser';

export class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
    console.log('🎮 SplashScene constructor');
  }

  create(): void {
    console.log('🎮 SplashScene create');
    const { width, height } = this.cameras.main;

    // Fondo azul oscuro con animacion
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x000033);

    // Logo del juego (representado por un rectángulo simple aquí)
    const logo = this.add.graphics();
    logo.fillStyle(0x00ff00);
    logo.fillRect(-100, -50, 200, 100);
    logo.fillStyle(0x00cc00);
    logo.fillRect(-80, -30, 160, 60);
    logo.setPosition(width / 2, height / 2 - 100);

    // Título
    const title = this.add.text(width / 2, height / 2 + 50, 'ROBOT', {
      fontSize: '72px',
      color: '#00ff00',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height / 2 + 130, 'RUNNER', {
      fontSize: '72px',
      color: '#00ffff',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    
    this.tweens.add({
      targets: logo,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      yoyo: true,
      repeat: 0
    });

    // Animación de aparición del texto
    title.setAlpha(0);
    subtitle.setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 600,
      delay: 400
    });

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 600,
      delay: 700
    });

    // Partículas
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        2,
        0xffffff,
        0.8
      );

      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1
      });
    }

    // Sonido de inicio
    this.playStartSound();

    // Texto de carga
    const loadingText = this.add.text(width / 2, height - 150, 'Cargando...', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: loadingText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Trancisión a MenuScene después de 3 segundos
    this.time.delayedCall(3000, () => {
      console.log('🎮 Cambiando a MenuScene...');
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  private playStartSound(): void {
    try {
      const audioContext = this.sound.context;
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('No se pudo reproducir sonido:', error);
    }
  }
}

