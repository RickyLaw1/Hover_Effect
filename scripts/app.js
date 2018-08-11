const app = {};

app.init = () => {
    app.setup();
    window.requestAnimationFrame(app.gameLoop);
    app.eventListener();
}

app.setup = () => {
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
}

app.gameLoop = (timestamp) => {
    let progress = timestamp - app.lastRender;

    app.update(progress);
    app.drawPlayer();
    app.showPlayerCoords();

    app.lastRender = timestamp;
    window.requestAnimationFrame(app.gameLoop);
}

app.update = () => {
    app.checkPlayerBounds();
    app.playerMovement();
    app.projectileMovement();
    app.deleteProjectile();
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
        }
    }
}

app.drawProjectile = (projectileNum) => {
    $(`.projectile${projectileNum}`)
        .css({
            "top": `${app.projectiles[projectileNum].y}px`,
            "left": `${app.projectiles[projectileNum].x}px`,
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

    // Set projectile coordinates to player coordinates
    app.projectiles[count] = {
        x: app.playerCoords.x,
        y: app.playerCoords.y
    };

    $(".gameScreen").append($projectile);
}

$(function () {
    app.init();
});