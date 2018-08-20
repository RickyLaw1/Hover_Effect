const app = {};

app.init = () => {
    app.setup();
    window.requestAnimationFrame(app.gameLoop);
    app.eventListener();
}

app.setup = () => {
    app.windowWidth = $(window).width();
    app.timeElapsed = 0;
    app.gameStarted = false;
    app.stepSize = 5;

    app.lastRender = 0;

    app.key = {
        down: false,
        up: false,
        left: false,
        right: false
    };

    app.score = 0;
    app.lives = 3;
    app.spawnPlayer();

    app.projectiles = [];
    app.projectileCount = 0;

    app.enemies = [];
    app.enemyCount = 0;

    app.enemyType = [
        {
            name: "welcome",
            height: 25,
            width: 400,
            html: `<h4>Welcome to HoverEffect ©<h4>`,
            cssClass: "welcome-enemy",
            animationClass: "hit-animation-welcome",
            delay: 200,
            health: 1
        },
        {
            name: "aboutNav",
            height: 20,
            width: 100,
            html: `<h4>ABOUT US<h4>`,
            cssClass: "nav-enemy",
            animationClass: "hit-animation-nav",
            delay: 200,
            health: 1
        },
        {
            name: "bookingNav",
            height: 20,
            width: 100,
            html: `<h4>BOOKINGS<h4>`,
            cssClass: "nav-enemy",
            animationClass: "hit-animation-nav",
            delay: 200,
            health: 1
        },
        {
            name: "blogNav",
            height: 20,
            width: 60,
            html: `<h4>BLOG<h4>`,
            cssClass: "nav-enemy",
            animationClass: "hit-animation-nav",
            delay: 200,
            health: 1
        },
        {
            name: "galleryNav",
            height: 20,
            width: 75,
            html: `<h4>gallery<h4>`,
            cssClass: "nav-enemy",
            animationClass: "hit-animation-nav",
            delay: 200,
            health: 1
        },
        {
            name: "home",
            height: 20,
            width: 50,
            html: `<h4>home<h4>`,
            cssClass: "nav-enemy",
            animationClass: "hit-animation-nav",
            delay: 200,
            health: 1
        },
        {
            name: "galleryPic1",
            height: 289,
            width: 361,
            html:
                `<figure>
                    <img src="assets/galleryPic1.jpeg" alt="">
                    <figcaption><h4>i love hovers</h4></figcaption>
                </figure>`,
            cssClass: "gallery-enemy",
            animationClass: "hit-animation-gallery",
            delay: 300,
            health: 30
        },
        {
            name: "galleryPic2",
            height: 289,
            width: 361,
            html:
                `<figure>
                    <img src="assets/galleryPic2.jpeg" alt="">
                    <figcaption><h4>go away prepos</h4></figcaption>
                </figure>`,
            cssClass: "gallery-enemy",
            animationClass: "hit-animation-gallery",
            delay: 300,
            health: 30
        },
        {
            name: "button",
            height: 40,
            width: 140,
            html:
                `<h4>
                    <div class="button-text">Start</div>
                    <div class="icon">
                        <i class="fas fa-camera"></i>
                    </div>
                </h4>`,
            cssClass: "button-enemy",
            animationClass: "hit-animation-button",
            delay: 250,
            health: 10
        },
        {
            name: "airplane",
            height: 40,
            width: 40,
            html:
                `<i class="fas fa-plane"></i>`,
            cssClass: "airplane-enemy",
            animationClass: "hit-animation-plane",
            delay: 250,
            health: 2
        },
        {
            name: "camera",
            height: 60,
            width: 60,
            html:
                `<i class="fas fa-camera"></i>`,
            cssClass: "camera-enemy",
            animationClass: "hit-animation-camera",
            delay: 250,
            health: 200
        },

    ];
    app.scrollHeight = 0;
}

app.gameLoop = (timestamp) => {
    let progress = timestamp - app.lastRender;

    if (app.gameStarted) {
        app.update(progress);

        app.drawPlayer();
        app.showPlayerCoords();
        app.scrollingBackground();
        app.timeLine();
        app.updateScore();
    }

    if (app.shoot) {
        app.projectileMovement();
    }

    if (app.enemies.length > 0) {
        app.drawEnemy();
    }

    app.lastRender = timestamp;
    window.requestAnimationFrame(app.gameLoop);
}

app.update = () => {
    app.checkPlayerBounds();
    app.playerMovement();
    app.deleteProjectile();
    app.enemyMovement();

    // When player is hit have 1 second of invincibility
    if (app.playerCoords.hit) {

        const delay = window.setTimeout(function () {

            app.playerCoords.hit = false;

            app.playerHit();
        }, 1000);
    } else {
        app.playerHit();
    }
}

app.timeLine = () => {
    app.timeElapsed += 10;

    if (app.timeElapsed === 3000) {
        app.spawnEnemy(15, -20, app.enemyType[0]);
        // app.spawnEnemy(15, -20, app.enemyType[10]);
    }
    else if (app.timeElapsed === 8000) {
        app.spawnEnemy(50, 0, app.enemyType[1]);
        app.spawnEnemy(50, -40, app.enemyType[2]);
        app.spawnEnemy(50, -80, app.enemyType[3]);
        app.spawnEnemy(50, -120, app.enemyType[4]);
        app.spawnEnemy(50, -160, app.enemyType[5]);
    } else if (app.timeElapsed === 13000) {
        app.spawnEnemy(20, -290, app.enemyType[6]);
    } else if (app.timeElapsed === 22000) {
        app.spawnEnemy(20, -290, app.enemyType[7]);
    } else if (app.timeElapsed === 28000) {
        app.spawnEnemy(200, 20, app.enemyType[8]);
    } else if (app.timeElapsed === 32000) {
        let xPlane = 15;
        for (let i = 0; i < 8; i++) {
            app.spawnEnemy(xPlane, -20, app.enemyType[9]);
            xPlane += 60;
        }
        xPlane = 15;
        for (let i = 0; i < 8; i++) {
            app.spawnEnemy(xPlane, -80, app.enemyType[9]);
            xPlane += 60;
        }
    }
}

app.scrollingBackground = () => {
    app.scrollHeight++;
    $(".game-screen").css({
        "background-position": `bottom -${app.scrollHeight}px left 0`
    });
}

app.eventListener = () => {
    console.log('Event Listener');
    app.keyDetection();
    app.mobileControls();
    app.playClick();
}

app.keyDetection = () => {
    $(document).on("keydown keyup", function (e) {
        if (e.type === "keydown") {
            app.keyDown(e);
        } else if (e.type === "keyup") {
            app.keyUp(e);
        }
    });
}

app.keyDown = (e) => {
    if (e.key === "ArrowDown") {
        app.key.down = true;
    } else if (e.key === "ArrowUp") {
        app.key.up = true;
    } else if (e.key === "ArrowLeft") {
        app.key.left = true;
    } else if (e.key === "ArrowRight") {
        app.key.right = true;
    } else if (e.key === " ") {
        app.makeProjectile();
    }
}
app.keyUp = (e) => {
    if (e.key === "ArrowDown") {
        app.key.down = false;
    } else if (e.key === "ArrowUp") {
        app.key.up = false;
    } else if (e.key === "ArrowLeft") {
        app.key.left = false;
    } else if (e.key === "ArrowRight") {
        app.key.right = false;
    }
}

app.playClick = () => {
    $(".play-button").on("click", function () {
        console.log('click!');
        $(".pointer-icon").css("right", "10px");
        let delay = setTimeout(function () {
            $(".game-screen")
                .css("box-shadow", "2px 2px 40px 1px rgb(0, 119, 255)");
            app.startGame();
        }, 700);
    });
}

app.startGame = () => {
    $(".start-screen").fadeOut(3000);
    app.gameStarted = true;
    console.log('startGame');

}

app.mobileControls = () => {
    $(".shoot-key").on("vmousedown", function () {
        // console.log('click');
        app.makeProjectile();
    });
    $(".left-key").on("vmousedown vmouseup", function (e) {
        if (e.type === "vmousedown") {
            app.key.left = true;
        } else {
            app.key.left = false;
        }
    });
    $(".right-key").on("vmousedown vmouseup", function (e) {
        if (e.type === "vmousedown") {
            app.key.right = true;
        } else {
            app.key.right = false;
        }
        // console.log('click');
    });
}

app.random = (range) => Math.floor(Math.random() * range);

app.updateScore = () => $(".score").text(`score: ${app.score}`);

app.spawnPlayer = () => {
    app.playerCoords = {
        x: 250,
        y: 450,
        height: 40,
        width: 30,
        hit: false,
        hitsTaken: 0
    }
    $(".player-model").append(`<i class="fas fa-space-shuttle"></i>`);

    app.createHitBox(app.playerCoords);

}

app.drawPlayer = () => {
    $(".player-model")
        .css({
            "left": `${app.playerCoords.x}px`,
            "top": `${app.playerCoords.y}px`,
            "height": `${app.playerCoords.height}px`,
            "width": `${app.playerCoords.width}px`
        });
}

app.checkPlayerBounds = () => {
    if (app.playerCoords.x > 500) {
        app.playerCoords.x -= 500;
    } else if (app.playerCoords.x < 0) {
        app.playerCoords.x += 500;
    }

    if (app.playerCoords.y > 500) {
        app.playerCoords.y -= 500;
    } else if (app.playerCoords.y < 0) {
        app.playerCoords.y += 500;
    }
}
app.playerHit = () => {
    app.checkHit(app.playerCoords, app.enemies);
}

app.playerMovement = () => {
    if (app.key.down) {
        app.playerCoords.y += app.stepSize;
        app.updateHitBox(app.playerCoords, 0, app.stepSize);
    } else if (app.key.up) {
        app.playerCoords.y -= app.stepSize;
        app.updateHitBox(app.playerCoords, 0, -app.stepSize);
    } else if (app.key.left) {
        app.playerCoords.x -= app.stepSize;
        app.updateHitBox(app.playerCoords, -app.stepSize, 0);
    } else if (app.key.right) {
        app.playerCoords.x += app.stepSize;
        app.updateHitBox(app.playerCoords, app.stepSize, 0);
    }

}

app.showPlayerCoords = () => {
    const xPos = app.playerCoords.x;
    const yPos = app.playerCoords.y;

    $(".player-coords").text(`x:${xPos}, y:${yPos}`);
}

app.makeProjectile = () => {
    app.projectileCount++;
    count = app.projectileCount;
    let ranColour = `hsl(${app.random(360)}, 100%, 65%)`;
    const $projectile = $(`<i class="fa fal fa-mouse-pointer"></i>`)
        // const $projectile = $("<div>")
        .addClass(`projectile projectile${count}`)
        .text(``)
        .css({
            "color": ranColour,
            "text-shadow": `1px 1px 15px ${ranColour}`
        });

    $(".game-screen").append($projectile);

    // Set projectile coordinates to player coordinates
    app.projectiles[count] = {
        x: app.playerCoords.x,
        y: app.playerCoords.y,
        height: 25,
        width: 15,
        move: true,
        hit: false
    };

    app.createHitBox(app.projectiles[count]);
    app.shoot = true;
}

app.drawProjectile = (projectileNum) => {
    const currentProjectile = app.projectiles[projectileNum];
    $(`.projectile${projectileNum}`)
        .css({
            "top": `${currentProjectile.y}px`,
            "left": `${currentProjectile.x}px`,
            "width": `${currentProjectile.width}`,
            "height": `${currentProjectile.height}`
        });
}

app.projectileMovement = () => {
    if (app.shoot) {
        app.projectiles.forEach((projectile, i) => {
            if (projectile.move && !projectile.hit) {
                projectile.y -= 5;
                app.drawProjectile(i);
                app.updateHitBox(projectile, 0, -5);
                // console.log(projectile.points);

                app.checkHit(projectile, app.enemies);
            } else if (projectile.hit) {
                projectile.points.forEach((point) => {
                    point.y = -1;
                });
                let hitDelay = window.setTimeout(function () {
                    projectile.hit = false;
                    projectile.y = -1;
                    app.deleteProjectile();

                }, 250);
            }
        });
    }
}

app.deleteProjectile = () => {
    app.projectiles.forEach((projectile, i) => {
        if (projectile.y < 0) {
            $(`.projectile${i}`).remove();
            projectile.move = false;
        }
    });
    app.enemies.forEach((enemy, i) => {
        if (enemy.y > 500) {
            $(`.enemy${i}`).remove();
        }
    });
}

app.spawnEnemy = (x, y, enemyType) => {
    app.enemyCount++;
    let count = app.enemies.length;
    // console.log(count);
    app.enemies[count] = {
        name: "enemy",
        id: app.enemyCount,
        x: x,
        y: y,
        height: enemyType.height,
        width: enemyType.width,
        hit: false,
        animation: enemyType.animationClass,
        delay: enemyType.delay,
        health: enemyType.health
    };

    console.log(app.enemies[count].id);


    app.createHitBox(app.enemies[count]);

    const $enemy = $("<div>")
        .addClass(`enemy enemy${app.enemies[count].id}`)
        .addClass(enemyType.cssClass)
        .css({
            "height": `${enemyType.height}px`,
            "width": `${enemyType.width}px`,
        })
        .append(enemyType.html);
    // .html("<h3>Hello</h3>");
    $(".game-screen").append($enemy);
}

app.drawEnemy = () => {
    app.enemies.forEach((enemy, i) => {
        $(`.enemy${enemy.id}`).css({
            "top": `${app.enemies[i].y}px`,
            "left": `${app.enemies[i].x}px`
        });
    });
}

app.enemyMovement = () => {
    app.enemies.forEach((enemy, i) => {

        if (!enemy.hit && enemy.y < 500) {
            enemy.y++;
            app.updateHitBox(enemy, 0, 1);
        }
        else if (enemy.y >= 500) {
            app.enemyDeath(enemy, i);
        }
        else {
            app.startHitAnimation(enemy, i);

            let hitDelay = window.setTimeout(function () {
                // console.log(enemy.hit);
                enemy.hit = false;
                if (enemy.hit) {
                    clearTimeout(hitDelay);
                    console.log('hit again');
                }
                app.endHitAnimation(enemy, i);
                if (enemy.health <= 0) {
                    app.enemyDeath(enemy, i);
                }
            }, enemy.delay);
        }
    });
}

app.enemyDeath = (entity, index) => {
    $(`.enemy${entity.id}`).remove();
    // console.log(`enemy${entity.id}`);

    app.enemies = app.enemies.filter((enemy) => {
        return enemy != entity;
    });

    entity.points.forEach((point) => {
        point.y = -10;
    });
}

app.createHitBox = (entity) => {
    const height = entity.height;
    const width = entity.width;

    entity.points = [
        { x: entity.x, y: entity.y },
        { x: entity.x + width, y: entity.y },
        { x: entity.x, y: entity.y + height },
        { x: entity.x + width, y: entity.y + height }
    ];
}

app.updateHitBox = (entity, stepX = 0, stepY = 1) => {

    entity.points.forEach((point) => {
        // console.log(point);
        point.x += stepX;
        point.y += stepY;
    })
}

app.checkHit = (hitBox2, hitBox1) => {
    // For each enemy
    hitBox1.forEach((enemy, i) => {
        // For each projectile
        // hitBox2.forEach((projectile, j) => {
        if (hitBox2.points[0].y <= enemy.points[2].y &&
            hitBox2.points[0].y >= enemy.points[0].y) {

            // 1st Horizontal overlap
            if (hitBox2.points[0].x >= enemy.points[0].x &&
                hitBox2.points[0].x <= enemy.points[1].x) {
                if (hitBox2 != app.playerCoords) {
                    enemy.hit = true;
                    enemy.health--;
                    app.score += 100;
                } else {
                    hitBox2.hitsTaken++;
                    app.loseLife();
                }
                hitBox2.hit = true;

                // 2nd Horizontal overlap
            } else if (hitBox2.points[1].x >= enemy.points[0].x &&
                hitBox2.points[1].x <= enemy.points[1].x) {
                if (hitBox2 != app.playerCoords) {
                    enemy.hit = true;
                    app.score += 100;
                }
                hitBox2.hit = true;
            }
        }
    });
}

app.loseLife = () => {

    const hitCount = app.playerCoords.hitsTaken;
    // console.log(`.life${hitCount}`);
    $(`.life${hitCount}`).css("color", "black");

    if (app.playerCoords.hitsTaken >= 3) {
        app.gameStarted = false;
        app.gameOver();
    }
}

app.startHitAnimation = (entity, index) => {
    $(`.${entity.name + entity.id}`).addClass(entity.animation);
}
app.endHitAnimation = (entity, index) => {
    $(`.${entity.name + entity.id}`).removeClass(entity.animation);
}

app.gameOver = () => {
    $(".game-over").css("visibility", "visible");
}

$(function () {
    app.init();
});

