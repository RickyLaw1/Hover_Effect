const app = {};

app.init = () => {
    app.setup();
    window.requestAnimationFrame(app.gameLoop);
    app.eventListener();
}

app.setup = () => {
    app.timeElapsed = 0;
    app.stepSize = 5;

    app.playerCoords = {
        x: 250,
        y: 450
    }

    app.lastRender = 0;

    app.key = {
        down: false,
        up: false,
        left: false,
        right: false
    };

    app.projectiles = [];
    app.projectileCount = 0;

    app.enemies = [];
    app.enemyCount = 0;
}

app.gameLoop = (timestamp) => {
    let progress = timestamp - app.lastRender;

    app.update(progress);
    app.drawPlayer();
    app.showPlayerCoords();
    app.timeLine();

    if (app.enemyCount > 0) {
        app.drawEnemy();

    }

    app.lastRender = timestamp;
    window.requestAnimationFrame(app.gameLoop);
}

app.update = () => {
    app.checkPlayerBounds();
    app.playerMovement();
    app.projectileMovement();
    app.deleteProjectile();

    app.enemyMovement();
}

app.timeLine = () => {
    app.timeElapsed += 10;

    if (app.timeElapsed === 100) {
        // app.spawnEnemy(100, 0);
        app.spawnEnemy(220, 0);

        console.log('spawn enemy');
    }
}

app.drawPlayer = () => {
    $(".playerModel")
        .css({
            "left": `${app.playerCoords.x}px`,
            "top": `${app.playerCoords.y}px`
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

app.playerMovement = () => {
    if (app.key.down) {
        app.playerCoords.y += app.stepSize;
    } else if (app.key.up) {
        app.playerCoords.y -= app.stepSize;
    } else if (app.key.left) {
        app.playerCoords.x -= app.stepSize;
    } else if (app.key.right) {
        app.playerCoords.x += app.stepSize;
    }
}

app.showPlayerCoords = () => {
    const xPos = app.playerCoords.x;
    const yPos = app.playerCoords.y;

    $(".playerCoords").text(`x:${xPos}, y:${yPos}`);
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
        app.shoot = true;
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

app.makeProjectile = () => {
    app.projectileCount++;
    count = app.projectileCount;
    // const $projectile = $(`<i class="fa fal fa-mouse-pointer"></i>`)
    const $projectile = $("<div>")
        .addClass(`projectile projectile${count}`)
        .text(``);

    $(".gameScreen").append($projectile);

    // Set projectile coordinates to player coordinates
    app.projectiles[count] = {
        x: app.playerCoords.x,
        y: app.playerCoords.y,
        height: 20,
        width: 11,
        move: true,
        hit: false
    };

    app.createHitBox(app.projectiles[count]);
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
                app.updateHitBox(projectile, -5);
                app.checkHit();
            } else if (projectile.hit) {
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
}

app.spawnEnemy = (x, y) => {
    app.enemyCount++;
    let count = app.enemyCount;

    app.enemies[count] = {
        name: "enemy",
        x: x,
        y: y,
        height: 20,
        width: 100,
        hit: false
    };

    app.createHitBox(app.enemies[count]);

    const $enemy = $("<div>").addClass(`enemy enemy${count}`);
    $(".gameScreen").append($enemy);
    // console.log('');
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
        if (!enemy.hit) {
            enemy.y++;
            app.updateHitBox(enemy, 1);
        } else {
            // app.startHitAnimation(enemy, i);

            let hitDelay = window.setTimeout(function () {
                enemy.hit = false;

                // app.endHitAnimation(enemy, i);
            }, 300);

        }
    });
}

app.createHitBox = (entity) => {
    entity.boundary = [];
    const height = entity.height;
    const width = entity.width;

    entity.points = [
        { x: entity.x, y: entity.y },
        { x: entity.x + width, y: entity.y },
        { x: entity.x, y: entity.y + height },
        { x: entity.x + width, y: entity.y + height }
    ];
}

app.updateHitBox = (entity, step = 1) => {

    entity.points.forEach((point) => {
        point.y += step;
    })
}

app.checkHit = () => {
    const hitBox1 = app.enemies;
    const hitBox2 = app.projectiles;

    // For each enemy
    hitBox1.forEach((enemy, i) => {
        // For each projectile
        hitBox2.forEach((projectile) => {
            if (projectile.points[0].y <= enemy.points[2].y &&
                projectile.points[0].y >= enemy.points[0].y) {

                // 1st Horizontal overlap
                if (projectile.points[0].x >= enemy.points[0].x &&
                    projectile.points[0].x <= enemy.points[1].x) {
                    projectile.hit = true;
                    enemy.hit = true;

                    // enemy.hit = Math.ceil(enemy.hit + 1 / 10);

                    // 2nd Horizontal overlap
                } else if (projectile.points[1].x >= enemy.points[0].x &&
                    projectile.points[1].x <= enemy.points[1].x) {
                    projectile.hit = true;
                    // enemy.hit = Math.ceil(enemy.hit + 1 / 10);
                    enemy.hit = true;
                }
            }
        });
    });
}

app.startHitAnimation = (entity, index) => {
    // console.log();
    $(`.${entity.name + index}`).addClass("hitAnimation");
}
app.endHitAnimation = (entity, index) => {
    $(`.${entity.name + index}`).removeClass("hitAnimation");
}


$(function () {

    app.init();
});

