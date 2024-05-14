// create app
const app = new PIXI.Application();
await app.init({ width: 512, height: 512 });
document.getElementById("container").appendChild(app.canvas);
app.roundPixels = true;
// set bg
await PIXI.Assets.load('assets/bg_512.png');
let bg = PIXI.Sprite.from('assets/bg_512.png');

let enemies = [];

// load textures
await PIXI.Assets.load('assets/enemy.png')
await PIXI.Assets.load('assets/banana_32.png')
// player class
class Player {
    constructor(texture) {
        this.pixi = PIXI.Sprite.from(texture);
        this.speed = 2.8;
        this.velocityBase = 0.5;
        this.velocityCap = 1
        this.velocityIncr = this.velocityCap / this.velocityBase;
        this.xVelocity = 0; // -1 to 1
        this.yVelocity = 0; // -1 to 1
    }
    pathfind(target) { 
        if (Math.abs(target.pixi.x - this.pixi.x) < 10) {
            this.xVelocity = 0;
        }
        else if (this.pixi.x < target.pixi.x) {
            this.xVelocity = this.velocityCap;
        }
        else if (this.pixi.x > target.pixi.x) {
            this.xVelocity = this.velocityCap * -1;
        }
        if (Math.abs(target.pixi.y - this.pixi.y) < 10) {
            this.yVelocity = 0;
        }
        else if (this.pixi.y < target.pixi.y) {
            this.yVelocity = this.velocityCap;
        }
        else if (this.pixi.y > target.pixi.y) {
            this.yVelocity = this.velocityCap * -1;
        }
    }
    move() {
        this.pixi.x = this.pixi.x + this.speed * this.xVelocity;
        this.pixi.y = this.pixi.y + this.speed * this.yVelocity;
    }
    // works only for banana atm
    hitDetect(target) {
        if ((Math.abs(target.pixi.x - (banana.pixi.x + player.pixi.x + 30 )) < 50) &&           // the 30 comes from the playerContainer offset but its still not accurate
            (Math.abs(target.pixi.y - (banana.pixi.y + player.pixi.y + 30 )) < 50)) { 
            console.log('banana x: ', banana.pixi.x + player.pixi.x, 'enemy x:', target.pixi.x);
            console.log("hit detected");
            target.pixi.parent.removeChild(target.pixi);
            enemies.splice(enemies.indexOf(target, 1));
            return true;
        }
    }
    logCoords() {
        console.log(this.pixi.x, this.pixi.y);
    }
}
// init player
await PIXI.Assets.load('assets/monkey_2.png')
let player = new Player('assets/monkey_2.png');
player.pixi.x = app.screen.width / 2;
player.pixi.y = app.screen.height / 2;
player.logCoords();


// score init
const scoreStyle = new PIXI.TextStyle({
    fontFamily: 'Roboto',
    fontSize: 30,
    fill: 'white',
    stroke: 'black',
    strokeThickness: 4,
    dropShadow: true,
    align: 'center'
});
let score = 0;
const scoreText = new PIXI.Text("Score: " + score, scoreStyle);
scoreText.x = (app.screen.width / 2) - 50;

// TODO this logic uses key repetition lol the velocity incr needs to be moved to the move method
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            if (Math.abs(player.yVelocity) < player.velocityCap) {
                if (player.yVelocity == 0) {
                    player.yVelocity = player.velocityBase * -1;
                    console.log("y movement init", player.yVelocity);
                }
                else {
                    player.yVelocity-=player.velocityIncr;
                    if (Math.abs(player.yVelocity) > player.velocityCap) {
                        player.yVelocity = player.velocityCap * -1;
                    }
                }
            }
            break;
        case 's':
            if (Math.abs(player.yVelocity) < player.velocityCap) {
                if (player.yVelocity == 0) {
                    player.yVelocity = player.velocityBase * 1;
                    console.log("y movement init", player.yVelocity);
                }
                else {
                    player.yVelocity+=player.velocityIncr;
                    if (Math.abs(player.yVelocity) > player.velocityCap) {
                        player.yVelocity = player.velocityCap;
                    }
                }
            }
            break;
        case 'a':
            if (Math.abs(player.xVelocity) < player.velocityCap) {
                if (player.xVelocity == 0) {
                    player.xVelocity = player.velocityBase * -1;
                    console.log("x movement init", player.xVelocity);
                }
                else {
                    player.xVelocity-=player.velocityIncr;
                    if (Math.abs(player.xVelocity) > player.velocityCap) {
                        player.xVelocity = player.velocityCap * -1;
                    }
                }
            }
            break;
        case 'd':
            if (Math.abs(player.xVelocity) < player.velocityCap) {
                if (player.xVelocity == 0) {
                    player.xVelocity = player.velocityBase;
                    console.log("x movrment init", player.xVelocity);
                }
                else {
                    player.xVelocity+=player.velocityIncr;
                    if (Math.abs(player.xVelocity) > player.velocityCap) {
                        player.xVelocity = player.velocityCap;
                    }
                }
            }
            break;
        case 'e':
            initEnemy(enemies);
            break;
    }
})

// key up
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            player.yVelocity = 0
            break;
        case 's':
            player.yVelocity = 0
            break;
        case 'a':
            player.xVelocity = 0
            break;
        case 'd':
            player.xVelocity = 0
            break;
    }
})
// console.log(app.stage.width)

// add sprite to the stage
app.stage.addChild(bg);
app.stage.addChild(player.pixi);
app.stage.addChild(scoreText);

//banana testing
const banana = new Player('assets/banana_32.png');
const playerContainer = new PIXI.Container();
player.pixi.addChild(playerContainer);
playerContainer.addChild(banana.pixi);
// center container 
playerContainer.x += 30;
playerContainer.y += 30;
// offset banana 
banana.pixi.y -= 100;


// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.maxFPS = 60;
app.ticker.add((ticker) => {
    for (const enemy of enemies) {
        // enemy behavior
        enemy.pathfind(player);
        enemy.move(); 
        banana.hitDetect(enemy); 
    }

    // banana circling 
    playerContainer.rotation -= 0.03 * ticker.deltaTime;

    // movement
    player.move(); 
});

function drawHitbox(entity) {
    let hitRect = new PIXI.Graphics;
    app.stage.removeChild(hitRect);
    hitRect.rect(entity.pixi.x + 8, entity.pixi.y + 10, 50, 50); // player box
    hitRect.fill(0x650a5a);
    hitRect.stroke({ width: 2, color: 0xfeeb77 });
    hitRect.alpha = 0.02;
    app.stage.addChild(hitRect);
}
function initEnemy(arr) {
    // init enemy
    arr.push(new Player('assets/enemy.png'));
    let newEnemy = arr[arr.length - 1];
    app.stage.addChild(newEnemy.pixi);
    
    // enemy vars
    newEnemy.speed = 0.5;
}