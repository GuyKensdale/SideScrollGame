const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;
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
    this.width = 30;
    this.height = 30;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}
function GameOver() {
  console.log("lost");
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
const genericObject = [
  new GenericObject({ x: 0, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 2000, y: 0, imageUrl: "./img/Background.jpeg" }),
  new GenericObject({ x: 4000, y: 0, imageUrl: "./img/Background.jpeg" }),
];

const player = new Player();
//need to make every 3rd or 4th a double platform just need if statment on i like i % 3 === 0 plat gap = 190
function mapGen() {
  const platforms = [];
  let prevX = 0;

  for (let i = 0; i <= 50; i++) {
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
  new Platform({ x: 250, y: 550, imageUrl: "./img/Platform.jpeg" }),

  ...mapGen(), // Use the spread operator to include the generated platforms individually
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
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });
  if (keys.right.pressed && player.position.x < 600) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObject.forEach((genericObject) => {
        genericObject.position.x -= 2;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
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
    }
  });
  if (scrollOffset > 2000) {
    console.log("you win");
  }
  if (player.position.y > canvas.height) {
    GameOver();
  }
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 87:
      player.velocity.y -= 8;
      break;
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
      player.velocity.y -= 10;
      break;
  }
});
