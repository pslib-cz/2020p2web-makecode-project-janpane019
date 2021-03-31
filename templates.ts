class AnimatedSpriteTemplate{
    image: Image;
    frames_L: Image[];
    frames_R: Image[];

    constructor(image: Image, frames_L: Image[], frames_R: Image[])
    {
        this.image = image;
        this.frames_L = frames_L;
        this.frames_R = frames_R;
    }
}