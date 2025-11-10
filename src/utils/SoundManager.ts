export class SoundManager {
  private scene: Phaser.Scene;
  private bgMusic: Phaser.Sound.BaseSound | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playBgMusic(key: string, loop: boolean = true): void {
    if (this.bgMusic) {
      this.bgMusic.stop();
    }
    
    this.bgMusic = this.scene.sound.add(key, { 
      loop, 
      volume: 0.3 
    });
    this.bgMusic.play();
  }

  stopBgMusic(): void {
    if (this.bgMusic) {
      this.bgMusic.stop();
    }
  }

  playSound(key: string, volume: number = 1): void {
    this.scene.sound.play(key, { volume });
  }
}

