const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
let imageGen = 100;
let imageGen2 = 195;
const jumpSound = new Audio("./img/jump.mp3");
const BackgroundMusic = new Audio("./img/8bitbacking.mp3");
const redCubes = [];

const gravity = 0.9;
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.image = new Image();
    this.image.src = "./img/SideScroll.jpeg";
    this.width = 50;
    this.height = 70;
  }

  draw() {
    c.drawImage(
      this.image,
      imageGen,
      imageGen2,
      200,
      230,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  detectPlayerMove() {
    if (keys.right.pressed && this.velocity.y > -10) {
      imageGen = 200;
      imageGen2 = 0;
    }
    if (this.velocity.y > -5) {
      imageGen = 0;
      imageGen2 = 250;
    }
    if (this.velocity.x < 0) {
      imageGen = 200;
      imageGen2 = 250;
    }
    if (!keys.right.pressed && !keys.left.pressed) {
      imageGen = 0;
      imageGen2 = 0;
    }
  }

  update() {
    this.detectPlayerMove();
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}
function GameOver() {
  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.classList.remove("hidden");

  const restartButton = document.getElementById("restart-button");
  restartButton.style.display = "block";

  restartButton.addEventListener("click", () => {
    location.reload();
  });
}

class Platform {
  constructor({ x, y, imageUrl }) {
    this.position = {
      x,
      y,
    };
    this.image = new Image();
    this.image.src = imageUrl;
    this.width = 200;
    this.height = 30;
  }
  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
class GenericObject {
  constructor({ x, y, imageUrl }) {
    this.position = {
      x,
      y,
    };
    this.image = new Image();
    this.image.src = imageUrl;
    this.width = 2000;
    this.height = 600;
  }
  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
class RedCube {
  constructor({ x, y, speed }) {
    this.position = { x, y };
    this.speed = speed; // Speed of the cube
    this.width = 20; // Adjust as needed
    this.height = 20; // Adjust as needed
  }

  update() {
    this.position.x -= this.speed; // Move the cube
  }

  draw() {
    // Draw the red cube at its position
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Wizard {
  constructor({ x, y, imageUrl }) {
    this.position = {
      x,
      y,
    };
    this.image = new Image();
    this.image.src = imageUrl;
    this.image.onload = () => {
      this.loaded = true;
    };
    this.width = 110;
    this.height = 500;
    this.loaded = false;
    this.frameIndex = 0;
    this.framesPerAnimation = 2;
    this.animationSpeed = 4;
    this.lastFrameTime = 0;
    this.lastShootTime = 0;
    this.shootInterval = 2000;
    this.startShooting();
    // Adjust the shoot interval (in milliseconds) as needed
  }
  startShooting() {
    this.shootIntervalId = setInterval(() => {
      this.shoot();
    }, this.shootInterval);
  }
  draw() {
    if (this.loaded) {
      const sourceX = this.frameIndex * this.width;
      const sourceY = 0;

      c.drawImage(
        this.image,
        sourceX,
        sourceY,
        this.width,
        this.height,
        this.position.x,
        this.position.y,
        50, // Width of the displayed image
        200 // Height of the displayed image
      );
    }
  }

  shoot() {
    // Create a red cube and add it to an array of red cubes
    const redCube = new RedCube({
      x: 1000,
      y: 500,
      speed: 6, // Adjust the speed of the cube
    });

    // Add the red cube to an array for tracking
    redCubes.push(redCube);
  }

  updateAnimation() {
    const currentTimestamp = Date.now();
    const deltaTime = currentTimestamp - this.lastFrameTime;

    if (deltaTime >= 1000 / this.animationSpeed) {
      this.frameIndex = (this.frameIndex + 1) % this.framesPerAnimation;
      this.lastFrameTime = currentTimestamp;
    }
  }
}

function insertRandomWizard() {
  // Find the last wizard in the array
  const lastWizard = wizards[wizards.length - 1];

  // Generate a random `x` position between 1000 and 2000 from the last wizard's position
  const minX = Math.max(1000, lastWizard.position.x - 2000);
  const maxX = Math.min(2000, lastWizard.position.x + 2000);
  const randomX = Math.random() * (maxX - minX) + minX;

  // Create a new wizard with the random `x` position and add it to the array
  const newWizard = new Wizard({
    x: randomX,
    y: 480,
    imageUrl: "./img/Wizards.jpeg",
  });
  wizards.push(newWizard);
}
setInterval(() => {
  insertRandomWizard();
}, 5000); // Insert a new wizard every 5 seconds

const wizards = [
  new Wizard({ x: 200, y: 480, imageUrl: "./img/Wizards.jpeg" }),
];
wizards.forEach((wizard) => {
  wizard.startShooting();
});
const genericObject = [
  new GenericObject({ x: 0, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 2000, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 4000, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 6000, y: 0, imageUrl: "./img/Night.jpeg" }),
  new GenericObject({ x: 8000, y: 0, imageUrl: "./img/Night.jpeg" }),
  new GenericObject({ x: 10000, y: 0, imageUrl: "./img/Night.jpeg" }),
  new GenericObject({ x: 12000, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 14000, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 16000, y: 0, imageUrl: "./img/Night.jpeg" }),
  new GenericObject({ x: 18000, y: 0, imageUrl: "./img/Night.jpeg" }),
  new GenericObject({ x: 20000, y: 0, imageUrl: "./img/Night.jpeg" }),
];

const player = new Player();

function mapGen() {
  const platforms = [];
  let prevX = 0;

  for (let i = 0; i <= 1000; i++) {
    let randomGap;

    do {
      randomGap = Math.floor(Math.random() * (400 - 190 + 1)) + 190;
    } while (randomGap >= 191 && randomGap <= 250);

    if (randomGap - prevX <= 500) {
      let x = prevX + randomGap;
      platforms.push(
        new Platform({
          x: x,
          y: 550,
          imageUrl: "./img/Platform.jpeg",
        })
      );
      prevX = x;
    } else {
      let x = prevX + 400;
      platforms.push(
        new Platform({
          x: x,
          y: 550,
          imageUrl: "./img/Platform.jpeg",
        })
      );
      prevX = x;
    }
  }

  return platforms;
}

const platforms = [
  new Platform({ x: -1, y: 550, imageUrl: "./img/Platform.jpeg" }),
  new Platform({ x: 280, y: 550, imageUrl: "./img/Platform.jpeg" }),

  ...mapGen(),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";

  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObject.forEach((genericObject) => {
    genericObject.draw();
  });
  redCubes.forEach((redCube) => {
    redCube.update();
    redCube.draw();

    // Check for collision with player
    if (
      player.position.x < redCube.position.x + redCube.width &&
      player.position.x + player.width > redCube.position.x &&
      player.position.y < redCube.position.y + redCube.height &&
      player.position.y + player.height > redCube.position.y
    ) {
      // Collision with player, trigger game over
      GameOver();
    }
  });
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  if (keys.right.pressed && player.position.x < 600) {
    player.velocity.x = 5;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      wizards.forEach((wizard) => {
        wizard.position.x -= 6;
      });
      genericObject.forEach((genericObject) => {
        genericObject.position.x -= 2;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      wizards.forEach((wizard) => {
        wizard.position.x += 5;
      });
      genericObject.forEach((genericObject) => {
        genericObject.position.x += 2;
      });
    }
  }

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      jumpCount = 2;
    }
  });

  wizards.forEach((wizard) => {
    wizard.updateAnimation();
    wizard.draw();
  });

  if (scrollOffset > 4000 && scrollOffset < 8000) {
    level = 2;
    updateLevelDisplay();
  }
  if (scrollOffset > 8000 && scrollOffset < 12000) {
    level = 3;
    updateLevelDisplay();
  }
  if (scrollOffset > 12000 && scrollOffset < 20000) {
    level = 4;
    updateLevelDisplay();
  }
  if (player.position.y > canvas.height) {
    GameOver();
  }
}
let level = 1;

function updateLevelDisplay() {
  const levelDisplay = document.getElementById("level-display");
  levelDisplay.textContent = `Level: ${level}`;
}

animate();
let jumpCount = 2;
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      BackgroundMusic.play();
      break;
    case 87:
      if (jumpCount > 0) {
        player.velocity.y -= 7;

        break;
      }
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;

      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;

      break;
    case 87:
      if (jumpCount > 0) {
        player.velocity.y -= 7;
        jumpCount -= 1;
        break;
      }
  }
});
