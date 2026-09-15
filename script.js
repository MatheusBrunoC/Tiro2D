const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const naveImagem = new Image();
naveImagem.src = "imagens/nave.png";

const inimigoImagem = new Image();
inimigoImagem.src = "imagens/ovni.png";

const pontuacaoElemento = document.getElementById("pontuacao");
const vidasElemento = document.getElementById("vidas");
const faseElemento = document.getElementById("fase");

const fundo = new Image();

fundo.src = "imagens/background.png";


// ============================
// JOGADOR
// ============================

const jogador = {
    x: 375,
    y: 500,
    largura: 70,
    altura: 70,
    velocidade: 5
};


// ============================
// ARRAYS
// ============================

const tiros = [];
const inimigos = [];

let pontuacao = 0;
let vidas = 3;
let gameOver = false;
let venceu = false;

let fase = 1;
const pontuacaoMaxima = 300;

// ============================
// verificar fse
// ============================
function verificarFase() {

    if (pontuacao >= pontuacaoMaxima) {
        venceu = true;
        return;
    }

    if (pontuacao >= 200) {
        fase = 3;
    }
    else if (pontuacao >= 100) {
        fase = 2;
    }
    else {
        fase = 1;
    }

    faseElemento.textContent = fase;
}

function desenharVitoria() {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "VOCÊ VENCEU!",
        canvas.width / 2,
        canvas.height / 2
    );
}


// CONTADOR DE INIMIGOS
// ============================

let contadorInimigos = 0;


// ============================
// TECLAS
// ============================

const teclas = {};

document.addEventListener("keydown", function(event) {

    teclas[event.key] = true;

    if (event.code === "Space") {
        criarTiro();
    }

});

document.addEventListener("keyup", function(event) {

    teclas[event.key] = false;

});


// ============================
// CRIAR TIRO
// ============================

function criarTiro() {

    const tiro = {

        x: jogador.x + jogador.largura / 2 - 3,
        y: jogador.y,

        largura: 6,
        altura: 15,

        velocidade: 8
    };

    tiros.push(tiro);
}


// ============================
// CRIAR INIMIGO
// ============================

function criarInimigo() {
    const inimigo = {
        x: Math.random() * (canvas.width - 60),
        y: -60,
        largura: 60,
        altura: 60,
        velocidade: 2 + (fase - 1)
    };

    inimigos.push(inimigo);
}


// ============================
// ATUALIZAR JOGADOR
// ============================

function atualizarJogador() {

    if (teclas["ArrowLeft"]) {
        jogador.x -= jogador.velocidade;
    }

    if (teclas["ArrowRight"]) {
        jogador.x += jogador.velocidade;
    }


    if (jogador.x < 0) {
        jogador.x = 0;
    }


    if (jogador.x > canvas.width - jogador.largura) {
        jogador.x = canvas.width - jogador.largura;
    }
}


// ============================
// ATUALIZAR TIROS
// ============================

function atualizarTiros() {

    for (let i = tiros.length - 1; i >= 0; i--) {

        tiros[i].y -= tiros[i].velocidade;


        if (tiros[i].y + tiros[i].altura < 0) {

            tiros.splice(i, 1);

        }
    }
}


// ============================
// ATUALIZAR INIMIGOS
// ============================

function atualizarInimigos() {
    for (let i = inimigos.length - 1; i >= 0; i--) {
        inimigos[i].y += inimigos[i].velocidade;

        if (inimigos[i].y > canvas.height) {

            vidas--;

            vidasElemento.textContent = vidas;

            inimigos.splice(i, 1);

            if (vidas <= 0) {
                gameOver = true;
            }
        }
    }
}


// ============================
// VERIFICAR COLISÃO
// ============================

function verificarColisao(a, b) {

    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}


// ============================
// VERIFICAR COLISÕES
// ============================

function verificarColisoes() {

    for (let i = tiros.length - 1; i >= 0; i--) {

        for (let j = inimigos.length - 1; j >= 0; j--) {

            if (verificarColisao(tiros[i], inimigos[j])) {

                tiros.splice(i, 1);

                inimigos.splice(j, 1);

                pontuacao += 10;

                pontuacaoElemento.textContent = pontuacao;

                verificarFase();

                break;
            }
        }
    }
}


// ============================
// DESENHAR JOGADOR
// ============================

function desenharJogador() {
    ctx.drawImage(
        naveImagem,
        jogador.x,
        jogador.y,
        jogador.largura,
        jogador.altura
    );
}


// ============================
// DESENHAR TIROS
// ============================

function desenharTiros() {

    ctx.fillStyle = "yellow";

    for (let i = 0; i < tiros.length; i++) {

        ctx.fillRect(
            tiros[i].x,
            tiros[i].y,
            tiros[i].largura,
            tiros[i].altura
        );

    }
}


// ============================
// DESENHAR INIMIGOS
// ============================

function desenharInimigos() {
    for (let i = 0; i < inimigos.length; i++) {
        ctx.drawImage(
            inimigoImagem,
            inimigos[i].x,
            inimigos[i].y,
            inimigos[i].largura,
            inimigos[i].altura
        );
    }
}

function desenharGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );
}


// ============================
// LOOP DO JOGO
// ============================

function loop() {

    ctx.drawImage(
        fundo,
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (venceu) {
        desenharVitoria();
        return;
    }


    if (gameOver) {
        desenharGameOver();
        return;
    }

    atualizarJogador();

    atualizarTiros();

    atualizarInimigos();

    verificarColisoes();


    desenharJogador();

    desenharTiros();

    desenharInimigos();


    contadorInimigos++;

    let intervaloInimigos = 60 - (fase - 1) * 15;

    if (contadorInimigos >= intervaloInimigos) {
        criarInimigo();
        contadorInimigos = 0;
    }


    requestAnimationFrame(loop);
}


// ============================
// INICIAR JOGO
// ============================

loop();