import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { SplashScene } from './scenes/SplashScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ScoresScene } from './scenes/ScoresScene';
import { CreditsScene } from './scenes/CreditsScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

console.log('🤖 RobotRunner iniciando...');

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.PORTRAIT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 2000 },
      debug: false
    }
  },
  scene: [
    BootScene,
    SplashScene,
    MenuScene,
    GameScene,
    GameOverScene,
    VictoryScene,
    ScoresScene,
    CreditsScene
  ]
};

window.addEventListener('load', () => {
  console.log('✅ Ventana cargada, creando juego...');
  const game = new Phaser.Game(config);
  console.log('✅ Juego creado:', game);
});

