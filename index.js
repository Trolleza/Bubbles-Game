//Canvas Setup:
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let spriteCount = 0; //Variável para fazer gif do Player/Balloons.
let score = 0; //Variável de pontuação.
let gameFrame = 0; //Variável de atualização dos Frames.
ctx.font = '40px Georgia';

//Mouse Interactivity:
let canvasPosition = canvas.getBoundingClientRect(); //Para linkar com a borda do canvas, e não com a borda da janela, e pegar o verdadeiro valor de x e y dentro do canvas.
const mouse = {
    x: canvas.width / 2, //Pega o meio da tela horizontalmente.
    y: canvas.height / 2, //Meio da tela verticalmente.
    click: false //Para verificar se o botão do mouse foi clicado ou solto.
}

canvas.addEventListener('mousedown', (event) => {
    mouse.click = true; //torna o click do mouse verdadeiro quando ele clica.
    mouse.x = event.x - canvasPosition.left; //Diminuindo o canvas Position, traz o x real.
    mouse.y = event.y - canvasPosition.top; //Diminuindo o canvas Position, traz o y real.
    //console.log (mouse.x, mouse.y)
});
canvas.addEventListener('mouseup', (event) => {
    mouse.click = false; //Volta a tornar falso, quando o click para.
});

//Player:

const playerLeft = new Image();
playerLeft.src = 'assets/spritesheet.png';
const playerRight = new Image();
playerRight.src = 'assets/spritesheet.png';

class Player {
    constructor() {
        this.x = 0; //Início do X move até o meio da tela para a posição da linha 15, ao iniciar o jogo.
        this.y = canvas.height / 2; //Meio da tela verticalmente. Move daqui p/ a linha 16.
        this.radius = 35; //Tamanho do Player em formato de bola.
        this.angle = 0; //Usado para rotacionar o Player p/ a direção da posição do mouse.
        this.frameX = 0; //Cordenadas do X do frame atual do Player no spritesheet.
        this.frameY = 0; //Cordenadas do Y do frame atual do Player no spritesheet.
        this.frame = 0; // Track dos números de Frames do Spritesheet.
        this.spriteWidth = 475; //Tamanho horizontal, da imagem do Player selecionada.
        this.spriteHeight = 457; //Tamanho vertical, da imagem do Player selecionada.
    }

    update() { //Vai atualizar a posição atual do peixe, para a posição atual do mouse.
        const dx = this.x - mouse.x; //distanceX.
        const dy = this.y - mouse.y; //distanceY.
        if (mouse.x != this.x) { //Se a posição do mouse X for diferente da do Player, --.
            this.x -= dx / 20; //O player pode ir tanto p a direita quanto p a esquerda, pois o dx pode ser positivo ou negativo. Se fosse apenas -- seria só negativo.
        }
        if (mouse.y != this.y) {//Se a posição do mouse Y for diferente do Player, --.
            this.y -= dy / 20; //VELOCIDADE: divide por 20, para o peixe se mover mais lentamente, se não ele iria literalmente pular, de uma posição para outra.
        }
    }
    draw() {
        if(mouse.click) { //Se o mouse clique for verdadeiro.
            ctx.lineWidth = 0.2; //Espessura da linha.
            ctx.beginPath(); //Caminho de Início.
            ctx.moveTo(this.x, this.y); //Começo da linha que é a posição do player.
            ctx.lineTo(mouse.x, mouse.y); //Final da linha que é a posição do mouse.
            ctx.stroke(); //Conecta os dois pontos da linha.
            ctx.closePath();
        }
        ctx.fillStyle = 'orange'
        ctx.beginPath();
        //o arc vai desenhar o círculo
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);//ângulo de start = 0 e o ângulo vai ser PI*2 para um círculo completo.
        ctx.fill(); //Preencher o círculo.
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);

        if (this.x >= mouse.x) {
        //drawImage(Image, x, y, width, height, player.x, player.y, scaledown.width, scaledown.height)
        ctx.drawImage(playerLeft, this.frameX * this. spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 45, this.y - 55, this.spriteWidth/5, this.spriteHeight/5);
        } else {
            ctx.drawImage(playerRight, this.frameX * this. spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 45, this.y - 55, this.spriteWidth/5, this.spriteHeight/5);
        }
        
    }
}
const player = new Player(); //CONVOCA o Player. (mas precisa do loop ainda, pra rodar.)

//Balloons
const balloonArr = []; //Começa com um array vazio.
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width; //número random entre 0 e o width do canvas.
        this.y = canvas.height + 100 + Math.random() * canvas.height;// canvas.height + 100 p/ as balões nascerem na base do canvas, com garantia de 100px, p/ nascer escondida.
        this.radius = 40;
        //this.radius = Math.random() * (35 - 15) + 23; //largura das balões.
        this.speed = Math.random() * 5 + 1; //Random entre 1 e 6.
        this.distance; //Rastreia a distância entre as balões, e a balão e o player, para poder marcar o score e estourar a balão, quando o Player estiver perto o bastante.
        this.counted = false;//cada balão atribuía infinitamente pontos, se o player continuasse em cima dessa balão específico.
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'; //random entre 2 sons, lembrando que o random vai de 0 até 0.99.

    }
    update() {
        this.y -= this.speed; //vai mover as balões para cima, em direção negativa, como se saissem do chão, dependendo da velocidade individual de cada balão.
        const dx = this.x - player.x; //dx = posição da balão.X - a posição do player.x.
        const dy = this.y - player.y; //dy = posição da balão.y - posição do player.y.
        this.distance = Math.sqrt(dx*dx + dy*dy); //CÁLCULO DA COLISÃO: quando uma balão trisca no raio do player, sqrt significa raiz quadrada do número.
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath(); //Precisa sempre abrir o caminho.
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); //Para desenhar o círculo. O ângulo de start = 0 e o ângulo vai ser PI*2 para um círculo completo.
        ctx.fill(); //Preenche o círculo da cor blue.
        ctx.closePath(); //Fecha o caminho.
        ctx.stroke();
    }
}

const balloonPop1 = document.createElement('audio'); //Declara som.
balloonPop1.src = 'assets/balloon1.mp3' //endereço do som.
const balloonPop2 = document.createElement('audio');//Declara som.
balloonPop2.src = 'assets/balloon2.mp3'

function handleBalloons() {
    if (gameFrame % 50 == 0) { //Se o gameFrame for dividido por 50, com sobra de 0, ou seja, rodará o gameFrame a cada 50 frames.
        balloonArr.push(new Balloon()); //Faz uma nova balão a cada 50 frames.
        //console.log(balloonArr.length);
    }
    for (let i = 0; i < balloonArr.length; i++) {
        balloonArr[i].update(); //para cada índice de balão, chama o update.
        balloonArr[i].draw(); // e o draw.
    }
    for (let i = 0; i < balloonArr.length; i++) { //foi preciso outro loop, para as balões pararem de piscar.
        if(balloonArr[i].y < 0 - balloonArr[i].radius * 2) { //Se a posição da balão for menor que 0 no Y, tira ela. Precisa diminuir o radius, para a balão só sumir, quando chegar na base dela, e não na metade, e *2, só por garantia.
            balloonArr.splice(i, 1); //i = index atual, 1 = só remove um elemento do array. Mas por alguma razão todas as balões começam a piscar, quando o slice é usado.
        }
        if (balloonArr[i].distance < balloonArr[i].radius + player.radius) {//Se a distância entre cada [i] do array, for menor que o seu raio + o raio do Player, ou seja, COLISÃO:
            //console.log('collision');
            if (!balloonArr[i].counted) { //Se a balão não tiver sido contada, ou seja, false.
                if(balloonArr[i].sound == 'sound1') { //convoca som.
                    balloonPop1.play();
                } else {
                    balloonPop2.play();
                }
                score++; //sempre que uma colisão for detectada, aumenta o score em 1 ponto.
                balloonArr[i].counted = true; //torna essa balão contada em verdadeira, para não cair nesse if novamente.
                balloonArr.splice(i, 1); //Remove essa balão que o Player conseguiu pegar.
            }
        }
    }
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Limpa o canvas no loop (x, y, w, h).
    handleBalloons(); // Para criar as balões no loop.
    player.update(); //Fazer update da posição do Player.
    player.draw(); //Desenha o Player e a linha entre o mouse e o player.
    ctx.fillStyle = 'black' //cor do score.
    ctx.fillText('Score: ' + score, 15, 40); //P/ aparecer score, e a posição que eu quero.
    gameFrame++; //Vai adicionando o gameFrame em 1, a cada animação de Frame. E usaremos para eventos periódicos.
    //console.log(gameFrame)
    requestAnimationFrame(animate); //cria o LOOP do animate.
}
animate(); //Precisa ser convocada para rodar o código.