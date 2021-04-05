// Player
let shark = PlayerSprite.CreatePlayerSprite(GameImageAseets.shark_img, GameImageAseets.shark_frames_L, GameImageAseets.shark_frames_R);
shark.AddAttackFrames(GameImageAseets.shark_bite_frames_L, GameImageAseets.shark_bite_frames_R)
scene.cameraFollowSprite(shark)

// Other animals 
let sea_food_sprites:AnimalSprite[] = [];
let sky_food_sprites:AnimalSprite[] = [];
scene.onOverlapTile(SpriteKind.Food,assets.tile`sky_fill`, function(sprite: AnimalSprite, location: tiles.Location) {
    if(sprite.can_go_vertically) sprite.vy+=1; // Prevent animals from floating above water
})

// Scene
let sea_tilemap = tilemap`Level`;
tiles.setTilemap(sea_tilemap);
effects.bubbles.startScreenEffect(0, 5);

// UI 
info.score();
// UI - Countdown
let countdown_end = start_time
createCountdown();

// Music/Audio
music.setVolume(volume)

// Interaction
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function(player: PlayerSprite, food: AnimalSprite) {
    player.Attack();
    info.changeScoreBy(1);
    countdown_end+=time_per_kill * (food.spawn_level == SpawnLevel.Sky ? sky_animal_kill_time_multiplier : 1);
    music.pewPew.play()
    food.destroy();
})
sprites.onDestroyed(SpriteKind.Food, function(food: AnimalSprite) {
    // Free space for new sprites to spawn 
    if(food.spawn_level == SpawnLevel.Sky) sky_food_sprites.removeElement(food);
    else sea_food_sprites.removeElement(food);

    const blood_particles = new particles.ParticleSource(food, 20,
        new particles.RadialFactory(6, 10, 1000, [2]));
    blood_particles.setAcceleration(0, 0);
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
    if(sea_food_sprites.length < max_sea_food_sprites){
        AddAnimal();
    }
    if(sky_food_sprites.length < max_sky_food_sprites){
        AddAnimal(true);
    }
    for(let food of sea_food_sprites){
        food.UpdateSprite();
    }
    for(let food of sky_food_sprites){
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
    for(let food of sea_food_sprites){
        food.RenderSprite();
    }
    for(let food of sky_food_sprites){
        food.RenderSprite();
    }

    shark.RenderSprite();
}

function AddAnimal(sky = false){
    let food = createRandomAnimalSprite(sky);

    tiles.placeOnRandomTile(food, GetSpawnLevelTile(food.spawn_level))
    if(sky) sky_food_sprites.push(food);
    else sea_food_sprites.push(food);
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