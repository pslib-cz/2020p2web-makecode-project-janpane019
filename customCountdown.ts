const w = 30;
const h = 15;
const x = scene.screenWidth() /2 - w/2;
const y = 1;


function createCountdown() {
    scene.createRenderable(scene.HUD_Z, function(target,camera) {
        let time = countdown_end - game.runtime() /1000;
        let time_string = time.toString().substr(0,4);
        if(time >= 10)
        {
            time_string = "9.99";
        }
        else if(time < 0)
        {
            time_string = "0.00";
        }
        screen.drawRect(
            x,
            y,
            w,
            h,
            0x13
        );
        screen.fillRect(
            x + 1,
            y + 1,
            w - 2,
            h - 2,
        0x1
        );
        screen.print(
            time_string,
            x + 2,
            y + 4,
            0x13,
            image.font8
        );
    });
}
