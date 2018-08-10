const app = {};

app.init = () => {
    app.setup();
    app.gameLoop();
    app.eventListener();
}

app.setup = () => {
    app.stepSize = 10;

    app.playerCoords = {}
    app.playerCoords.x = 0; // Setting Spawn Coords
    app.playerCoords.y = 0; // Setting Spawn Coords
}

app.gameLoop = () => {
    setTimeout(app.gameLoop, 100);
    app.showPlayerCoords();
    app.drawPlayer();
}

app.drawPlayer = () => {
    const $playerModel = $("<div>").addClass("playerModel");
    $(".gameScreen").append($playerModel);
    $(".playerModel")
        .css({
            "left": `${app.playerCoords.x}px`,
            "top": `${app.playerCoords.y}px`
        });
}


app.showPlayerCoords = () => {
    const $playerCoords = $("<div>").addClass("playerCoords");
    const xPos = app.playerCoords.x;
    const yPos = app.playerCoords.y;

    $(".background").append($playerCoords);
    $(".playerCoords").text(`x:${xPos}, y:${yPos}`);
}

app.eventListener = () => {
    console.log('Event Listener');
    app.keyDetection();
}

app.keyDetection = () => {
    $(document).on("keydown keyup", function (e) {
        if (e.type === "keydown") {
            // console.log('keydown');
        } else if (e.type === "keyup") {
            // console.log('keyup');
        }

        app.playerMovement(e)
    });
}

app.playerMovement = (e) => {
    if (e.key === "s") {
        app.playerCoords.y += app.stepSize;
    } else if (e.key === "w") {
        app.playerCoords.y -= app.stepSize;
    } else if (e.key === "a") {
        app.playerCoords.x -= app.stepSize;
    } else if (e.key === "d") {
        app.playerCoords.x += app.stepSize;
    }
}


$(function () {
    app.init();
});