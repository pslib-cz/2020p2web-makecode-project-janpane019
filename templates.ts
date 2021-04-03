class AnimalSpriteTemplate{
    image: Image;
    frames_L: Image[];
    frames_R: Image[];
    spawn_level : SpawnLevel;
    can_go_vertically = true;
    constructor(image: Image, frames_L: Image[], frames_R: Image[], spawn_level : SpawnLevel, can_go_vertically = true)
    {
        this.image = image;
        this.frames_L = frames_L;
        this.frames_R = frames_R;
        this.spawn_level = spawn_level;
        this.can_go_vertically = can_go_vertically;
    }
}
