// aqui definimos as dimensões do jogo
const larguraJogo = 700;
const alturaJogo = 700;

// o que essa parte faz?
const config = {
  type: Phaser.AUTO,
  width: larguraJogo,
  height: alturaJogo,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      //debug: true
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// o que acontece aqui?
const game = new Phaser.Game(config);

var alien;
var teclado;
var fogo;
var plataformas = [];
var moeda;
var pontuacao = 0;
var placar;
//declarando as teclas W, A, S, D
var keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
var keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
var keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

function preload() {
  this.load.image("background", "assets/bg.png");
  this.load.image("player", "assets/alienigena.png");
  this.load.image("turbo_nave", "assets/turbo.png");
  this.load.image("plataforma_tijolo", "assets/tijolos.png");
  this.load.image("moeda", "assets/moeda.png");
}

function create() {
  // adicionando o background na tela do jogo, sendo as dimensões a metade dos tamanhos da tela
  this.add.image(larguraJogo / 2, alturaJogo / 2, "background");

  //adicionando a imagem do turbo
  fogo = this.add.sprite(0, 0, "turbo_nave");
  fogo.setVisible(false); //deixando ela invisivel

  //adicionando o placar na tela
  placar = this.add.text(50, 30, "Moedas:" + pontuacao, {
    fontSize: "45px",
    fill: "#495613",
  });

  //adicionando a alien(player)
  alien = this.physics.add.sprite(larguraJogo / 2, 0, "player");
  alien.setCollideWorldBounds(true); //ativando a colisão com as bordas da tela
  alien.setBounce(0.5);

  teclado = this.input.keyboard.createCursorKeys(); //adicionando as setas do teclado
  //adicionando as teclas W, A, D
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  let defPlataformas = [
    { x: larguraJogo / 1.3, y: alturaJogo / 1.5, img: "plataforma_tijolo" },
    { x: larguraJogo / 3.5, y: alturaJogo / 2.3 },
  ];

  // Adicionar colisão entre blocos e plataforma
  defPlataformas.forEach((plat) => {
    let plataforma = this.physics.add.staticImage(
      plat.x,
      plat.y,
      "plataforma_tijolo"
    );
    this.physics.add.collider(alien, plataforma);
    plataformas.push(plataforma);
  });

  //adicionando a moeda
  moeda = this.physics.add.sprite(larguraJogo / 4, 0, "moeda");
  moeda.setCollideWorldBounds(true); //ativando a colisão com as bordas do jogo
  moeda.setBounce(0.7); //ativando um quique às moedas
  plataformas.forEach((plat) => {
    this.physics.add.collider(moeda, plat);
  }); //ativando a colisão entre a moeda e a plataforma

  //quando o alien encostar na moeda
  this.physics.add.overlap(alien, moeda, function () {
    moeda.setVisible(false); //moeda fica invisivel

    var posicacaoMoeda_Y = Phaser.Math.RND.between(50, 650); //define um numero random
    moeda.setPosition(posicacaoMoeda_Y, 100); //define a nova posição

    pontuacao += 1; //contabiliza o ponto
    placar.setText("Moedas:" + pontuacao); //atualiza o placar

    moeda.setVisible(true); //deixa a moeda visivel
  });
}

function update() {
  //movimentação horizontal do alien
  if (teclado.left.isDown || keyA.isDown) {
    alien.setVelocityX(-150); //quando estiver precionado velocidade no eixo x é de -150 pixels
  } else if (teclado.right.isDown || keyD.isDown) {
    alien.setVelocityX(150); //quando estiver precionado velocidade no eixo x é de +150 pixels
  } else {
    alien.setVelocityX(0); //se não estiver precionado não mova
  }
  //movimentação vertical do alien
  if (teclado.up.isDown || keyW.isDown) {
    alien.setVelocityY(-150); //quando estiver precionado velocidade no eixo y é de -150 pixels
    ativarTurbo(); //chama a função ativarTurbo
  } else {
    //gravidade do jogo
    semTurbo(); //chama a função semTurbo
  }

  //define a posição do turbo, com base nas coordenadas do alien
  fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

function ativarTurbo() {
  fogo.setVisible(true); //turbo visivel
}
function semTurbo() {
  fogo.setVisible(false); //turbo invisivel
}
