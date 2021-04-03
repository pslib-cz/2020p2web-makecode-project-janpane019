// Player
let shark = PlayerSprite.CreatePlayerSprite(shark_img, shark_frames_L, shark_frames_R, shark_bite_frames_L, shark_bite_frames_R);
scene.cameraFollowSprite(shark)

// Other animals 
let food_sprites:AnimalSprite[] = [];
scene.onOverlapTile(SpriteKind.Food,assets.image`sky_fill1`, function(sprite: AnimalSprite, location: tiles.Location) {
    if(sprite.can_go_vertically){console.log("fd");sprite.vy+=1}; // Prevent animals from floating above water
})

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
    ProcessInput();
    ProcessUpdate();
    ProcessRender();
})

function ProcessInput()
{
    // Custom movement mechanics (some mechanics doesn't work with controller.moveSprite)
    shark.Move(controller.player1.dx(),controller.player1.dy())
    if( controller.A.isPressed() && shark.can_boost)
    {
        shark.Boost();
        music.knock.play();
    }
}

function ProcessUpdate(){
    if(food_sprites.length < max_food_sprites){
        AddAnimal();
    }
    for(let food of food_sprites){
        food.UpdateSprite();
    }
    shark.UpdateSprite();
    if(countdown_end - game.runtime()/1000 <= 0)
    {
        game.over();
    }

    // Apply vertical velocity to shark when he leaves water (collides with sky_fill tile)
    if((shark.tileKindAt(TileDirection.Top,assets.image`sky_fill`)
        || shark.tileKindAt(TileDirection.Bottom,assets.image`sky_fill`)) && !shark.apply_gravity )
    {
        shark.apply_gravity = true;
    }
    else if(!(shark.tileKindAt(TileDirection.Top,assets.image`sky_fill`)
        || shark.tileKindAt(TileDirection.Bottom,assets.image`sky_fill`)) && shark.apply_gravity)
    {
        shark.apply_gravity = false
        effects.fountain.start(shark,100,120)
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

    tiles.placeOnRandomTile(food, GetSpawnLevelTile(food.spawn_level))
    //food.setPosition(randint(30, area_width-30),randint(30, area_height-30));
    food_sprites.push(food);
}

function GetSpawnLevelTile(spawn_level:SpawnLevel) : Image{
    switch(spawn_level)
    {
        case 0:
            return assets.tile`sky_fill`
        case 1:
            return assets.image`sea_upper_fill`
        case 2:
            return assets.image`sea_mid_fill`
        case 3:
            return assets.image`sea_bot_fill`
        default:
            return assets.image`sea_mid_fill`
    }
}