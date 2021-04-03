class AnimatedSprite extends Sprite {
    facing_right: boolean = false;
    frames_R: Image[];
    frames_L: Image[];
    is_playing_animation: boolean;

    RenderSprite() : void{
        if(!this.is_playing_animation)
        {
            if(this.vx > 0 && !this.facing_right)
            {
                animation.runImageAnimation(this, this.frames_R,180,true);
                this.facing_right = true;
            }
            else if (this.vx < 0 && this.facing_right)
            {
                animation.runImageAnimation(this, this.frames_L,180,true);
                this.facing_right = false;
            }
        }
    }

    PlayAnimation(frames: Image[], frame_interval: number){
        animation.runImageAnimation(this, frames,frame_interval,false);
        this.is_playing_animation = true;
        // Set to default animation after ending this animation
        setTimeout(function() {
            if(this.is_playing_animation)
            {
                this.is_playing_animation = false;
                if(this.facing_right)
                {
                    animation.runImageAnimation(this, this.frames_R,180,true);
                }
                else
                {
                    animation.runImageAnimation(this, this.frames_L,180,true);
                }
            }
        }, frames.length*frame_interval)
    }

    constructor(img: Image, frames_L : Image[], frames_R : Image[]){
        super(img);
        this.frames_R = frames_R;
        this.frames_L = frames_L;
        if(this.facing_right){
            animation.runImageAnimation(this, this.frames_R,180,true);
        }
        else{
            animation.runImageAnimation(this, this.frames_L,180,true);
        }
    }
}

// General class used for food animals 
class AnimalSprite extends AnimatedSprite {
    horizontal_speed : number;
    vertical_speed : number;
    spawn_level : SpawnLevel;
    last_direction_change: number;  // Last time the sprite has changed its direction 
    direction_change_interval: number = 2500;


    UpdateSprite() : void{
        // Set random direction
        if(game.runtime() - this.last_direction_change > this.direction_change_interval)
        {
            let x_direction = randint(-1, 1);
            let y_direction = randint(-1, 1);

            this.vx = this.horizontal_speed * x_direction; 
            this.vy = this.vertical_speed * y_direction;

            this.last_direction_change = game.runtime();
        }
    }

    RenderSprite() : void{
        super.RenderSprite();
    }

    static CreateAnimalSprite(img: Image, frames_L : Image[], frames_R : Image[], horizontal_speed : number = 15, vertical_speed: number = 10 ): AnimalSprite {
        const scene = game.currentScene();
        const sprite = new AnimalSprite(img, frames_L, frames_R,horizontal_speed,vertical_speed);
        let kind = SpriteKind.Food;
        sprite.setKind(kind);
        scene.physicsEngine.addSprite(sprite);

        scene.createdHandlers
            .filter(h => h.kind == kind)
            .forEach(h => h.handler(sprite));

        return sprite
    }   

    constructor(img: Image, frames_L : Image[], frames_R : Image[],spawn_level : SpawnLevel
    , horizontal_speed: number = 15, vertical_speed: number = 10){
        super(img,frames_L,frames_R);
        this.spawn_level = spawn_level;
        this.horizontal_speed = horizontal_speed;
        this.vertical_speed = vertical_speed;

        this.last_direction_change = this.direction_change_interval *-1;
    }
}

class PlayerSprite extends AnimatedSprite {
    attack_frames_L : Image[];
    attack_frames_R : Image[];
    apply_gravity: boolean;
    can_boost: boolean = true;
    is_boosting: boolean;

    RenderSprite() : void{
        super.RenderSprite();
    }

    UpdateSprite() : void {
        if(this.apply_gravity)
        {
            this.vy+=10
        }
    }

    Move(x: number, y:number)
    {
        if(!this.apply_gravity)
        {
            this.vy = y*player_vertical_speed * (this.is_boosting?2:1);
        }
        this.vx = x*player_horizontal_speed * (this.is_boosting?2:1);
    }

    Attack() : void{
        if(this.facing_right){
            this.PlayAnimation(this.attack_frames_R,50);
        }
        else{
            this.PlayAnimation(this.attack_frames_L,50);
        }
    }

    Boost() : void{
        if(this.can_boost)
        {
            this.can_boost = false;
            this.is_boosting = true;
            setTimeout(function() {
                this.is_boosting = false
            }, 250)
            setTimeout(function() {
                this.can_boost = true;
            }, 3500)
        }
    }

    static CreatePlayerSprite(img: Image, frames_L : Image[], frames_R : Image[], attack_frames_L : Image[], attack_frames_R : Image[]): PlayerSprite {
        const scene = game.currentScene();
        const sprite = new PlayerSprite(img, frames_L, frames_R, attack_frames_L, attack_frames_R);
        let kind = SpriteKind.Player;
        sprite.setKind(kind);
        scene.physicsEngine.addSprite(sprite);

        scene.createdHandlers
            .filter(h => h.kind == kind)
            .forEach(h => h.handler(sprite));

        return sprite
    }   

    constructor(img: Image, frames_L : Image[], frames_R : Image[], attack_frames_L : Image[], attack_frames_R : Image[]){
        super(img,frames_L,frames_R);
        this.attack_frames_L = attack_frames_L;
        this.attack_frames_R = attack_frames_R;
    }
}



function createRandomAnimalSprite(): AnimalSprite {
    const scene = game.currentScene();
    let keys = Object.keys(animals_images);
    let animal = animals_images[keys[randint(0,keys.length-1)]];
    const sprite = AnimalSprite.CreateAnimalSprite(animal.image, animal.frames_L, animal.frames_R,animal.spawn_level);
    return sprite;
} 