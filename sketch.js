let hitSound;

function preload() {
  soundFormats('mp3', 'wav');
  hitSound = loadSound('pop.mp3');
}

// 🦠 超激烈動畫：白血球 vs 病毒大作戰！
let whiteCells = [];
let viruses = [];
let explosions = [];
let virusCount = 20;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(16);
  frameRate(60);

  for (let i = 0; i < 8; i++) {
    whiteCells.push({ x: random(width), y: random(height), speed: 2 });
  }

  for (let i = 0; i < virusCount; i++) {
    viruses.push({ x: random(width), y: random(height), alive: true });
  }
}

function draw() {
  background(10);

  // 標題
  fill(255, 0, 0);
  textSize(24);
  text("🧬 白血球 vs 病毒大作戰！", width / 2, 30);

  // 白血球動畫
  for (let w of whiteCells) {
    let closestV = null;
    let minDist = Infinity;

    for (let v of viruses) {
      if (!v.alive) continue;
      let d = dist(w.x, w.y, v.x, v.y);
      if (d < minDist) {
        minDist = d;
        closestV = v;
      }
    }

    if (closestV) {
      let dx = closestV.x - w.x;
      let dy = closestV.y - w.y;
      let d = dist(w.x, w.y, closestV.x, closestV.y);
      if (d > 1) {
        w.x += (dx / d) * w.speed;
        w.y += (dy / d) * w.speed;
      }
      if (d < 15) {
        closestV.alive = false;
        if (hitSound && hitSound.isLoaded()) hitSound.play();
        explosions.push({ x: closestV.x, y: closestV.y, life: 30 });
      }
    }

    fill(255);
    stroke(200);
    ellipse(w.x, w.y, 22, 22);
    noStroke();
    fill(0);
    textSize(10);
    text("白血球", w.x, w.y - 15);
  }

  // 病毒動畫
  for (let v of viruses) {
    if (!v.alive) continue;
    fill(150, 0, 255);
    stroke(100);
    ellipse(v.x, v.y, 18, 18);
    stroke(255, 0, 255);
    line(v.x, v.y, v.x + 10, v.y + 10);
    line(v.x, v.y, v.x - 10, v.y - 10);
    line(v.x, v.y, v.x + 10, v.y - 10);
    line(v.x, v.y, v.x - 10, v.y + 10);
    noStroke();
    fill(255);
    textSize(10);
    text("病毒", v.x, v.y - 20);
  }

  // 爆炸特效
  for (let i = explosions.length - 1; i >= 0; i--) {
    let ex = explosions[i];
    fill(255, 100, 0, ex.life * 8);
    noStroke();
    ellipse(ex.x, ex.y, 30 - (30 - ex.life), 30 - (30 - ex.life));
    ex.life--;
    if (ex.life <= 0) {
      explosions.splice(i, 1);
    }
  }

  // 顯示剩餘病毒數量
  fill(255);
  textSize(14);
  text("🧟‍♂️ 剩餘病毒數量: " + viruses.filter(v => v.alive).length, width / 2, 60);

  if (viruses.every(v => !v.alive)) {
    fill(0, 255, 0);
    textSize(20);
    text("🎉 戰鬥勝利！白血球消滅所有病毒！", width / 2, height / 2);
  }
}
