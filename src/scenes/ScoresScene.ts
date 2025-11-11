import Phaser from 'phaser';
import { StorageManager, Score } from '../utils/StorageManager';

export class ScoresScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ScoresScene' });
  }

  async create(): Promise<void> {
    const { width, height } = this.cameras.main;

    // Fade in
    this.cameras.main.fadeIn(500);

    // Fondo
    this.cameras.main.setBackgroundColor(0x001122);

    // Título
    const title = this.add.text(width / 2, 120, 'MEJORES PUNTAJES', {
      fontSize: '56px',
      color: '#00ffff',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      stroke: '#004444',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Trofeo decorativo
    const trophy = this.add.graphics();
    trophy.fillStyle(0xffaa00);
    trophy.fillRect(-20, -10, 40, 30);
    trophy.fillRect(-30, 20, 60, 10);
    trophy.fillRect(-10, -40, 20, 30);
    trophy.fillStyle(0xffff00);
    trophy.fillCircle(0, -25, 15);
    trophy.setPosition(width / 2, 250);

    this.tweens.add({
      targets: trophy,
      y: 260,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Obtener puntajes
    const scores = await StorageManager.getScores();

    // Mostrar puntajes
    const startY = 350;
    const lineHeight = 65;

    if (scores.length === 0) {
      this.add.text(width / 2, startY + 100, 'No hay puntajes aún', {
        fontSize: '32px',
        color: '#888888',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      this.add.text(width / 2, startY + 180, '¡Juega para establecer récords!', {
        fontSize: '24px',
        color: '#666666',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else {
      scores.forEach((score, index) => {
        const y = startY + index * lineHeight;
        
        // Número de posición
        const position = this.add.text(60, y, `${index + 1}.`, {
          fontSize: '32px',
          color: this.getPositionColor(index),
          fontStyle: 'bold',
          fontFamily: 'Arial'
        });

        // Distancia
        const distance = this.add.text(140, y, `${score.score}m`, {
          fontSize: '32px',
          color: '#ffffff',
          fontFamily: 'Arial'
        });

        // Nivel (corregir para que muestre máximo nivel 3)
        const levelCorrected = Math.min(score.level, 3);
        const levelName = this.getLevelName(levelCorrected);
        const level = this.add.text(width / 2 + 20, y, levelName, {
          fontSize: '20px',
          color: '#00ffaa',
          fontFamily: 'Arial'
        });

        // Fecha
        const date = this.add.text(width / 2 + 20, y + 25, score.date, {
          fontSize: '18px',
          color: '#888888',
          fontFamily: 'Arial'
        });

        // Animación de entrada
        position.setAlpha(0);
        distance.setAlpha(0);
        level.setAlpha(0);
        date.setAlpha(0);

        this.tweens.add({
          targets: [position, distance, level, date],
          alpha: 1,
          duration: 300,
          delay: index * 100
        });
      });
    }

    // Botón de borrar puntajes (pequeño, abajo)
    if (scores.length > 0) {
      this.createSmallButton(width / 2, 1050, 'Borrar Puntajes', 0x660000, async () => {
        await this.clearScores();
      });
    }

    // Botón de volver
    this.createButton(width / 2, 1160, 'VOLVER', 0x666666, () => {
      this.goBack();
    });
  }

  private getPositionColor(index: number): string {
    switch (index) {
      case 0: return '#ffff00'; // Oro
      case 1: return '#cccccc'; // Plata
      case 2: return '#ff8844'; // Bronce
      default: return '#ffffff';
    }
  }

  private getLevelName(level: number): string {
    switch (level) {
      case 1: return 'Nivel 1 - Fábrica Oscura';
      case 2: return 'Nivel 2 - Zona Industrial';
      case 3: return 'Nivel 3 - Reactor Final';
      default: return `Nivel ${level}`;
    }
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

  private createSmallButton(x: number, y: number, text: string, color: number, callback: () => void): void {
    const button = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRoundedRect(-120, -30, 240, 60, 10);
    bg.fillStyle(color - 0x001100);
    bg.fillRoundedRect(-115, -25, 230, 50, 8);

    const label = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    button.add([bg, label]);

    const hitArea = new Phaser.Geom.Rectangle(-120, -30, 240, 60);
    button.setSize(240, 60);
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
  }

  private async clearScores(): Promise<void> {
    await StorageManager.clearScores();
    this.scene.restart();
  }

  private goBack(): void {
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MenuScene');
    });
  }
}

