document.getElementById('imagemJogador').addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('imagemPersonagem').src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

class Personagem {
    constructor(nome) {
        this.nome = nome;
        this.vida = 100;
        this.forca = 10;
        this.nivel = 1;
        this.experiencia = 0;
    }

    atacar(alvo) {
        alvo.vida -= this.forca;
        this.ganharExperiencia();
        document.getElementById('somAtaque').play(); // Adicionado aqui
    }

    ganharExperiencia() {
        this.experiencia++;
        if (this.experiencia >= 10) {
            this.nivel++;
            this.experiencia = 0;
            this.forca += 5;
        }
    }

    usarItem(item) {
        this.vida += item.cura;
    }
}

class Monstro {
    constructor(nome) {
        this.nome = nome;
        this.vida = 200;
        this.forca = 20;
    }

    atacar(alvo) {
        alvo.vida -= this.forca;
    }
}

class Item {
    constructor(nome, cura) {
        this.nome = nome;
        this.cura = cura;
    }
}

let jogador;
let monstro = new Monstro("Monstro");
let poção = new Item("Poção de Cura", 50);
let log = document.getElementById('log');

function adicionarAoLog(mensagem) {
    log.innerHTML += mensagem + '<br>';
    log.scrollTop = log.scrollHeight;
}

function reiniciarJogo() {
    jogador.vida = 100;
    monstro.vida = 200;
    adicionarAoLog('O jogo foi reiniciado. Vida do Jogador: ' + jogador.vida + ', Vida do Monstro: ' + monstro.vida);
}

document.getElementById('comecarJogo').addEventListener('click', function() {
    let nomeJogador = document.getElementById('nomeJogador').value;
    jogador = new Personagem(nomeJogador);
    adicionarAoLog('Jogo começou. Nome do Jogador: ' + jogador.nome);
    document.getElementById('musicaFundo').play(); // Adicionado aqui
});

document.getElementById('atacar').addEventListener('click', function() {
    jogador.atacar(monstro);
    adicionarAoLog('Jogador ataca Monstro. Vida do Monstro: ' + monstro.vida);
    if (monstro.vida > 0) {
        monstro.atacar(jogador);
        adicionarAoLog('Monstro ataca Jogador. Vida do Jogador: ' + jogador.vida);
        if (jogador.vida <= 0) {
            adicionarAoLog('O jogador morreu. Fim de jogo!');
            reiniciarJogo();
        }
    } else {
        adicionarAoLog('O monstro morreu. Você venceu o jogo!');
        reiniciarJogo();
    }
});

document.getElementById('usarItem').addEventListener('click', function() {
    jogador.usarItem(poção);
    adicionarAoLog('Jogador usa Poção de Cura. Vida do Jogador: ' + jogador.vida);
});

