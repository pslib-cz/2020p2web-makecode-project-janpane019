// Player
let shark = PlayerSprite.CreatePlayerSprite(shark_img, shark_frames_L, shark_frames_R, shark_bite_frames_L, shark_bite_frames_R);
controller.moveSprite(shark,player_horizontal_speed, player_vertical_speed );
scene.cameraFollowSprite(shark)

// Other animals 
let food_sprites:AnimalSprite[] = [];

// Scene
let sea_tilemap = tilemap`Level`;
const area_width = sea_tilemap.width * 16;
const area_height = sea_tilemap.height * 16;

tiles.setTilemap(sea_tilemap);
effects.bubbles.startScreenEffect(0, 5);

// UI 
info.score();

// Countdown
let countdown_end = start_time
createCountdown();

// Music/Audio
music.setVolume(volume)

// Interaction
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function(player: PlayerSprite, food: AnimalSprite) {
    player.Attack();
    info.changeScoreBy(1);
    countdown_end+=time_per_kill;
    music.pewPew.play()
    food.destroy();
})
sprites.onDestroyed(SpriteKind.Food, function(food: AnimalSprite) {
    const blood_particles = new particles.ParticleSource(food, 20,
        new particles.RadialFactory(6, 10, 1000, [2]));
    blood_particles.setAcceleration(0, 0);

    food_sprites.removeElement(food);
})

// Main game loop 
game.onUpdate(function() {
    ProcessUpdate();
    ProcessRender();
})

function ProcessUpdate(){
    if(food_sprites.length < max_food_sprites){
        AddAnimal();
    }
    for(let food of food_sprites){
        food.UpdateSprite();
    }
    if(countdown_end - game.runtime()/1000 <= 0)
    {
        game.over();
    }
}

function ProcessRender(){
    for(let food of food_sprites){
        food.RenderSprite();
    }

    shark.RenderSprite();
}

function AddAnimal(){
    let food = createRandomAnimalSprite();
    
    food.setPosition(randint(30, area_width-30),randint(30, area_height-30));
    food_sprites.push(food);
}