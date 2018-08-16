const app = {};

app.init = () => {
    app.setup();
    window.requestAnimationFrame(app.gameLoop);
    app.eventListener();
}

app.setup = () => {
    app.windowWidth = $(window).width();
    app.timeElapsed = 0;
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
            name: "enemy1",
            height: 20,
            width: 100
        },
        {
            name: "enemy2",
            height: 100,
            width: 100
        },
        {
            name: "enemy3",
            height: 20,
            width: 100
        },
        {
            name: "enemy4",
            height: 20,
            width: 100
        },
    ];

    app.scrollHeight = 0;
}

app.gameLoop = (timestamp) => {
    let progress = timestamp - app.lastRender;

    app.update(progress);
    app.drawPlayer();
    app.showPlayerCoords();
    app.updateScore();

    app.scrollingBackground();
    app.timeLine();

    if (app.shoot) {

        app.projectileMovement();
    }

    if (app.enemyCount > 0) {
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

    if (app.timeElapsed === 100) {
        // app.spawnEnemy(100, 0)
        app.spawnEnemy(220, 0, app.enemyType[1]);

        console.log('spawn enemy');
    } else if (app.timeElapsed === 2000) {
        app.spawnEnemy(0, 0, app.enemyType[0]);
        app.spawnEnemy(110, 0, app.enemyType[1]);
        app.spawnEnemy(220, 0, app.enemyType[0]);
        app.spawnEnemy(330, 0, app.enemyType[1]);
    }
}

app.scrollingBackground = () => {
    app.scrollHeight++;
    $(".gameScreen").css({
        "background-position": `bottom -${app.scrollHeight}px left 0`
    });
}

app.eventListener = () => {
    console.log('Event Listener');
    app.keyDetection();
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
    if (e.key === "s") {
        app.key.down = true;
    } else if (e.key === "w") {
        app.key.up = true;
    } else if (e.key === "a") {
        app.key.left = true;
    } else if (e.key === "d") {
        app.key.right = true;
    } else if (e.key === " ") {

        app.makeProjectile();
    }
}
app.keyUp = (e) => {
    if (e.key === "s") {
        app.key.down = false;
    } else if (e.key === "w") {
        app.key.up = false;
    } else if (e.key === "a") {
        app.key.left = false;
    } else if (e.key === "d") {
        app.key.right = false;
    }
}

app.random = (range) => Math.floor(Math.random() * range);

app.updateScore = () => {
    $(".score").text(`score: ${app.score}`);
}

app.spawnPlayer = () => {
    app.playerCoords = {
        x: 250,
        y: 450,
        height: 20,
        width: 20,
        hit: false,
        hitsTaken: 0
    }
    app.createHitBox(app.playerCoords);
    console.log(app.playerCoords);

}

app.drawPlayer = () => {
    $(".playerModel")
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

    $(".playerCoords").text(`x:${xPos}, y:${yPos}`);
}

app.makeProjectile = () => {
    app.projectileCount++;
    count = app.projectileCount;
    // const $projectile = $(`<i class="fa fal fa-mouse-pointer"></i>`)
    const $projectile = $("<div>")
        .addClass(`projectile projectile${count}`)
        .text(``)
        .css("color", `rgb(${app.random(255)}, ${app.random(255)}, ${app.random(255)}`);

    $(".gameScreen").append($projectile);

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
    let count = app.enemyCount;

    app.enemies[count] = {
        name: "enemy",
        x: x,
        y: y,
        height: enemyType.height,
        width: enemyType.width,
        hit: false
    };

    app.createHitBox(app.enemies[count]);

    const $enemy = $("<div>")
        .addClass(`enemy enemy${count}`)
        .css({
            "height": `${enemyType.height}px`,
            "width": `${enemyType.width}px`
        });
    // .html("<h3>Hello</h3>");
    $(".gameScreen").append($enemy);
}

app.drawEnemy = () => {
    for (let i = 1; i < app.enemyCount + 1; i++) {
        $(`.enemy${i}`).css({
            "top": `${app.enemies[i].y}px`,
            "left": `${app.enemies[i].x}px`
        });
    }
}

app.enemyMovement = () => {
    app.enemies.forEach((enemy, i) => {

        if (!enemy.hit && enemy.y < 500) {
            enemy.y++;
            app.updateHitBox(enemy, 0, 1);
        } else {
            app.startHitAnimation(enemy, i);

            let hitDelay = window.setTimeout(function () {
                // console.log(enemy.hit);
                enemy.hit = false;
                app.endHitAnimation(enemy, i);
                app.enemyDeath(enemy, i);
            }, 300);

        }
    });
}

app.enemyDeath = (entity, index) => {
    $(`.enemy${index}`).remove();
    entity.points.forEach((point) => {
        point.y = -1;
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
                    app.score += 100;
                } else {
                    hitBox2.hitsTaken++;
                    console.log(hitBox2.hitsTaken);
                    app.loseLife();
                    console.log(`enemy#${i}:(${enemy.points[0].x}, ${enemy.points[0].y})`)
                }
                console.log(enemy);


                // console.log('ouch');
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
        // });
    });
}

app.loseLife = () => {

    const hitCount = app.playerCoords.hitsTaken;
    console.log(`.life${hitCount}`);
    $(`.life${hitCount}`).css("color", "black");
}

app.startHitAnimation = (entity, index) => {
    $(`.${entity.name + index}`).addClass("hitAnimation");
}
app.endHitAnimation = (entity, index) => {
    $(`.${entity.name + index}`).removeClass("hitAnimation");
}


$(function () {

    app.init();
});

