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
    // app.enemyMovement();
}

app.timeLine = () => {
    app.timeElapsed += 10;

    if (app.timeElapsed === 100) {
        // app.spawnEnemy(100, 0);
        app.spawnEnemy(220, 0);

        console.log('spawn enemy');
    }
    // console.log(app.timeElapsed);

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

app.projectileMovement = () => {
    if (app.shoot) {
        for (let i = 1; i < app.projectileCount + 1; i++) {
            app.projectiles[i].y -= 5;
            app.drawProjectile(i);
            app.updateHitBox(app.projectiles[i]);
        }
        app.checkHit();
    }
}

app.enemyMovement = () => {
    for (let i = 1; i < app.enemyCount + 1; i++) {
        app.enemies[i].y++;
        app.updateHitBox(app.enemies[i]);
    }
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

app.deleteProjectile = () => {
    for (let i = 1; i <= app.projectileCount; i++) {
        // console.log(app.projectiles[i]);
        if (app.projectiles[i].y < 0) {

            $(`.projectile${i}`).remove();
        }
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

    const $projectile = $(`<i class="fa fal fa-mouse-pointer"></i>`)
        .addClass(`projectile projectile${count}`)
        .text(``);

    $(".gameScreen").append($projectile);

    // Set projectile coordinates to player coordinates
    app.projectiles[count] = {
        x: app.playerCoords.x,
        y: app.playerCoords.y,
        height: 20,
        width: 11
    };

    app.createHitBox(app.projectiles[count]);
}

app.spawnEnemy = (x, y) => {
    app.enemyCount++;
    let count = app.enemyCount;

    app.enemies[count] = {
        x: x,
        y: y,
        height: 20,
        width: 100
    };

    app.createHitBox(app.enemies[count]);

    const $enemy = $("<div>").addClass(`enemy enemy${count}`);
    $(".gameScreen").append($enemy);
    // console.log('');

}

app.createHitBox = (entity) => {
    entity.boundary = [];
    const height = entity.height;
    const width = entity.width;

    for (let i = 0; i < width; i++) {
        entity.boundary[i] = {};
        entity.boundary[i].x = entity.x + i;
        entity.boundary[i].y = height;
    }

    // console.log(entity.boundary);
}

app.updateHitBox = (entity) => {

    entity.boundary.forEach((point) => {
        point.y = entity.y;
    })
}

app.checkHit = () => {
    const hitBox1 = app.projectiles;
    const hitBox2 = app.enemies;


    // For each projectile
    hitBox1.forEach((projectile) => {
        projectile.boundary.forEach((point1) => {
            // For each Enemy
            hitBox2.forEach((enemy) => {
                enemy.boundary.forEach((point2) => {

                    if (point1.y === point2.y &&
                        point1.x === point2.x) {

                        console.log('hit');
                    }
                });
            });
        });
    });
}

app.drawEnemy = () => {
    for (let i = 1; i < app.enemyCount + 1; i++) {
        $(`.enemy${i}`).css({
            "top": `${app.enemies[i].y}px`,
            "left": `${app.enemies[i].x}px`
        });
    }

}

$(function () {

    app.init();
});

