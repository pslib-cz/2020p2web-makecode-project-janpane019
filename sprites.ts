class AnimatedSprite extends Sprite {
    facingRight: boolean;
    framesR: Image[];
    framesL: Image[];

    UpdateSprite() : void{

    }

    RenderSprite() : void{
        if(this.vx > 0 && !this.facingRight)
        {
            animation.runImageAnimation(this, this.framesR,180,true);
            this.facingRight = true;
        }
        else if (this.vx < 0 && this.facingRight)
        {
            animation.runImageAnimation(this, this.framesL,180,true);
            this.facingRight = false;
        }
    }

    SetFrames(framesL : Image[], framesR : Image[]){
        this.framesR = framesR;
        this.framesL = framesL;
        if(this.facingRight){
            animation.runImageAnimation(this, this.framesR,180,true);
        }
        else{
            animation.runImageAnimation(this, this.framesL,180,true);
        }
    }

    constructor(img: Image, facingRight: boolean = false){
        super(img);
        this.facingRight = facingRight;
    }
}

function createAnimatedSprite(img: Image, kind?: number): AnimatedSprite {
    const scene = game.currentScene();
    const sprite = new AnimatedSprite(img)
    sprite.setKind(kind);
    scene.physicsEngine.addSprite(sprite);

    scene.createdHandlers
        .filter(h => h.kind == kind)
        .forEach(h => h.handler(sprite));

    return sprite
}