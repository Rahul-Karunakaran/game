var player, ground,playerAnimation,shootingAnimation,enemyAnimation,invisibleGround,arrow,enemy,enemyAnimation;
var groundImage, arrowGroup,enemyGroup,diamond,diamondGroup,score,diamondImage, arrowImage,gameState;
var playerColided,enemyColided,restart,restartImage;
function preload(){
 groundImage = loadImage("ground-clipart.png")
 playerAnimation = loadAnimation("sprites/player/frame_00_delay-0.08s.gif","sprites/player/frame_01_delay-0.08s.gif",
 "sprites/player/frame_02_delay-0.08s.gif","sprites/player/frame_03_delay-0.08s.gif","sprites/player/frame_04_delay-0.08s.gif",
 "sprites/player/frame_05_delay-0.08s.gif","sprites/player/frame_06_delay-0.08s.gif","sprites/player/frame_07_delay-0.08s.gif",
 "sprites/player/frame_08_delay-0.08s.gif","sprites/player/frame_09_delay-0.08s.gif","sprites/player/frame_10_delay-0.08s.gif",
 "sprites/player/frame_11_delay-0.08s.gif")
shootingAnimation = loadAnimation("sprites/shooting/frame_15_delay-0.01s.gif","sprites/shooting/frame_16_delay-0.01s.gif","sprites/shooting/frame_17_delay-0.01s.gif",
 "sprites/shooting/frame_18_delay-0.01s.gif","sprites/shooting/frame_19_delay-0.01s.gif","sprites/shooting/frame_20_delay-0.01s.gif","sprites/shooting/frame_21_delay-0.01s.gif",
 "sprites/shooting/frame_22_delay-0.01s.gif")
 enemyAnimation = loadAnimation("sprites/enemy/frame_0_delay-0.1s.gif","sprites/enemy/frame_1_delay-0.1s.gif","sprites/enemy/frame_2_delay-0.1s.gif",
 "sprites/enemy/frame_3_delay-0.1s.gif","sprites/enemy/frame_4_delay-0.1s.gif","sprites/enemy/frame_5_delay-0.1s.gif","sprites/enemy/frame_6_delay-0.1s.gif",
 "sprites/enemy/frame_7_delay-0.1s.gif")
 diamondImage = loadImage("diamond.png")
 arrowImage = loadImage("arrow.png")
 playerColided = loadImage("sprites/player/frame_11_delay-0.08s.gif")
 enemyColided = loadImage("sprites/enemy/frame_1_delay-0.1s.gif")

}

function setup() {
  createCanvas(displayWidth,displayHeight-120);

  console.log(displayWidth)
  console.log(width)
  //upArrow = createSprite(width/2,height-100,20,20)
  ground = createSprite(width/2,height,width,10)
  ground.addImage("groundImage",groundImage)
  ground.scale = 0.25
  ground.x =450
  invisibleGround = createSprite(width/2,height-40,width,60)
  invisibleGround.visible= false;

  player = new Player(width/8,height-100,40,60)
  player.body.addAnimation("Running",playerAnimation)
  player.body.addAnimation("shooting",shootingAnimation)
  player.body.addAnimation("playerColided",playerColided)
  player.body.debug = true
  player.body.setCollider("rectangle",0,0,50,120)
  gameState = "PLAY";

  arrowGroup = createGroup();
  enemyGroup = createGroup();
  diamondGroup = createGroup();

  restart = createSprite(width/2,height/2,20,30)

  score = 0
}

function draw() {
  background(0); 

  if(gameState === "PLAY"){
    if(keyWentDown("space")){
      player.body.changeAnimation("shooting",shootingAnimation)
      shooting();
    }
    if(keyWentUp("space")){
      player.body.changeAnimation("Running",playerAnimation)
    }
     if (keyDown(UP_ARROW)){
       player.body.velocityY = -4
     }
     player.body.velocityY = player.body.velocityY+0.08
  
     ground.velocityX = -2
     if(ground.x<300){
       ground.x = 450
     }
     
  
     textSize(30);
     text("Diamond : "+score,200,250)
  
     if(World.frameCount%200 === 0){
       spawnEnemies();
     }
     if(World.frameCount%350 === 0){
       spawnDiamonds();
    }
     destroyEnemy();
  
     diamondCollection();
    if(enemyGroup.length>0&&(enemyGroup.isTouching(player.body))){
     gameState = "END"
    }
    restart.visible = false
  }

  else if(gameState === "END"){
    player.body.velocityX = 0
    enemyGroup.setVelocityXEach(0)
    diamondGroup.setVelocityXEach(0)
    ground.velocityX = 0
    player.body.changeAnimation("playerColided",playerColided)
    for(var a = 0;a<enemyGroup.length;a++){
      enemyGroup[a].changeAnimation("enemyColided",enemyColided)
    }
    enemyGroup.setLifetimeEach(-1);
    diamondGroup.setLifetimeEach(-1);

    restart.visible = true
    if(mousePressedOver(restart)){
      restartingGame();
    }
  }
  
  player.body.collide(invisibleGround);
   
  drawSprites();
}

function shooting(){
   arrow = createSprite(player.body.x,player.body.y,20,50)
   arrow.addImage("arrow",arrowImage)
   arrow.scale = 0.1
   arrow.velocityX = 4
   arrow.lifetime = 450
   arrowGroup.add(arrow);
}

function spawnEnemies(){
  enemy = createSprite(width,player.body.y+20,20,50)
  enemy.addAnimation("enemy",enemyAnimation)
  enemy.addAnimation("enemyColided",enemyColided)
  enemy.scale = 0.5
  enemy.velocityX = -3
  enemy.lifetime = 450
  enemy.debug = true
  enemy.setCollider("rectangle",0,0,80,200)
  enemyGroup.add(enemy);
  
}

function destroyEnemy(){
  for(var i = 0;i<enemyGroup.length;i++){
    for(var j = 0;j<arrowGroup.length;j++)
    if(enemyGroup.length>0&&(enemyGroup.get(i).isTouching(arrowGroup.get(j)))){
      enemyGroup.get(i).destroy();
      arrowGroup.get(j).destroy();
    }
  }
}
function spawnDiamonds(){
  diamond = createSprite(width,player.body.y+50,20,50)
  diamond.y = random(height/2,height/4)
  diamond.addImage("diamond",diamondImage)
  diamond.scale = 0.2
  diamond.velocityX = -3
  diamond.lifetime = width/4
  diamond.debug = true
  diamond.setCollider("rectangle",0,0,150,150)
  diamondGroup.add(diamond);
} 

function diamondCollection(){
  for(var i = 0;i<diamondGroup.length;i++){
  if(player.body.isTouching(diamondGroup.get(i))){
    score += 10
    diamondGroup.get(i).destroy();
  }
}
}

function restartingGame(){
 gameState = "PLAY"
 enemyGroup.destroyEach();
 diamondGroup.destroyEach();
 player.body.changeAnimation("Running",playerAnimation)
 score = 0
}