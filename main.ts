 const max_food_sprites = 20;
let food_sprites:AnimatedSprite[] = [];

// Player - Appearance
let shark = PlayerSprite.CreatePlayerSprite(shark_img, shark_frames_L, shark_frames_R, shark_bite_frames_L, shark_bite_frames_R);

// Player - Movement
controller.moveSprite(shark,200,200);
scene.cameraFollowSprite(shark)

// Scene
let sea_tilemap =tilemap`Level`;
tiles.setTilemap(sea_tilemap);
effects.bubbles.startScreenEffect(0, 5);
const area_width = sea_tilemap.width * 16;
const area_height = sea_tilemap.height * 16;


// Interaction
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function(player: PlayerSprite, food: AnimalSprite) {
    player.Attack();
    food.destroy();
})

sprites.onDestroyed(SpriteKind.Food, function(food: AnimatedSprite) {
    food_sprites.removeElement(food);
})

// Main game loop 
game.onUpdate(function() {
    ProcessInput();
    ProcessUpdate();
    ProcessRender();
})

function ProcessInput(){
    
}

function ProcessUpdate(){
    if(food_sprites.length < max_food_sprites){
        AddAnimal();
    }
    for(let food of food_sprites){
        food.UpdateSprite();
    }

    shark.UpdateSprite();
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