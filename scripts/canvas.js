var renderer = new PIXI.WebGLRenderer(800, 600, { backgroundColor : 0x1099bb });
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.fromImage('img/link.gif');

// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);

animate();

function animate() {
    requestAnimationFrame(animate);

    bunny.rotation += 0.1;

    // render the container
    renderer.render(stage);
}