document.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('imagemPersonagem').addEventListener('change', function(e) {
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
            this.ataquesEspeciais = 3; // novo atributo para ataques especiais
        }

        atacar(alvo, tipoAtaque) {
            if (tipoAtaque === 'especial' && this.ataquesEspeciais > 0) {
                alvo.vida -= this.forca * 2; // ataque especial causa o dobro do dano
                this.ataquesEspeciais--; // diminui a quantidade de ataques especiais disponíveis
            } else {
                alvo.vida -= this.forca; // ataque normal
            }
            this.ganharExperiencia();
            document.getElementById('somAtaque').play();
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
            document.getElementById('somPocao').play();
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

    let historia = "Em um reino distante, um herói surge para enfrentar o terrível monstro que tem aterrorizado a terra. Armado apenas com sua coragem e sua espada, nosso herói embarca em uma jornada perigosa. Será que ele será capaz de derrotar o monstro e trazer a paz de volta ao reino? A jornada começa agora...";

    document.getElementById('comecarJogo').addEventListener('click', function() {
        let nomeJogador = document.getElementById('nomeJogador').value;
        jogador = new Personagem(nomeJogador);
        adicionarAoLog('Jogo começou. Nome do Jogador: ' + jogador.nome);
        adicionarAoLog(historia); // Adiciona a história ao log de mensagens
        document.getElementById('musicaFundo').play();
    });

    document.getElementById('atacar').addEventListener('click', function() {
        jogador.atacar(monstro, 'normal');
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

    document.getElementById('atacarEspecial').addEventListener('click', function() {
        if (jogador.ataquesEspeciais > 0) {
            jogador.atacar(monstro, 'especial');
            adicionarAoLog('Jogador ataca Monstro com ataque especial. Vida do Monstro: ' + monstro.vida);
        } else {
            adicionarAoLog('Jogador não tem mais ataques especiais disponíveis.');
        }
    });

    document.getElementById('tomarPocao').addEventListener('click', function() {
        jogador.usarItem(poção);
        adicionarAoLog('Jogador usa Poção de Cura. Vida do Jogador: ' + jogador.vida);
    });

        // Todo o seu código JavaScript vai aqui dentro
});
