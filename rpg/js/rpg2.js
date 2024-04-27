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
            let dano;
            if (tipoAtaque === 'especial' && this.ataquesEspeciais > 0) {
                dano = this.forca * 2; // ataque especial causa o dobro do dano
                this.ataquesEspeciais--; // diminui a quantidade de ataques especiais disponíveis
            } else {
                dano = this.forca; // ataque normal
            }
            alvo.vida -= dano;
            document.getElementById('somAtaque').play();
        }

        ganharExperiencia(pontos) {
            this.experiencia += pontos;
            while (this.experiencia >= 10 * this.nivel) { // a experiência necessária para subir de nível aumenta a cada nível
                this.experiencia -= 10 * this.nivel;
                this.nivel++;
                this.forca += 5;
                this.vida = 100; // restaura a vida do personagem quando ele sobe de nível
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

    function atualizarStatusPersonagem() {
        let statusPersonagem = document.getElementById('statusPersonagem');
        statusPersonagem.innerHTML = `
            Nome: ${jogador.nome}<br>
            Nível: ${jogador.nivel}<br>
            Vida: ${jogador.vida}<br>
            Força: ${jogador.forca}<br>
            Experiência: ${jogador.experiencia}<br>
            Ataques Especiais Restantes: ${jogador.ataquesEspeciais}
        `;
    }

    function salvarProgresso() {
        localStorage.setItem('jogador', JSON.stringify(jogador));
        localStorage.setItem('monstro', JSON.stringify(monstro));
    }

    function carregarProgresso() {
        let jogadorSalvo = JSON.parse(localStorage.getItem('jogador'));
        let monstroSalvo = JSON.parse(localStorage.getItem('monstro'));

        if (jogadorSalvo && monstroSalvo) {
            jogador = new Personagem(jogadorSalvo.nome);
            Object.assign(jogador, jogadorSalvo);

            monstro = new Monstro(monstroSalvo.nome);
            Object.assign(monstro, monstroSalvo);
        }
    }

    function reiniciarJogo() {
        jogador.vida = 100;
        monstro.vida = 200;
        adicionarAoLog('O jogo foi reiniciado. Vida do Jogador: ' + jogador.vida + ', Vida do Monstro: ' + monstro.vida);
        atualizarStatusPersonagem(); // atualiza o painel de status após reiniciar o jogo
        salvarProgresso(); // salva o progresso após reiniciar o jogo
    }

    let historia = "Em um reino distante, um herói surge para enfrentar o terrível monstro que tem aterrorizado a terra. Armado apenas com sua coragem e sua espada, nosso herói embarca em uma jornada perigosa. Será que ele será capaz de derrotar o monstro e trazer a paz de volta ao reino? A jornada começa agora...";

    document.getElementById('comecarJogo').addEventListener('click', function() {
        let nomeJogador = document.getElementById('nomeJogador').value;
        jogador = new Personagem(nomeJogador);
        adicionarAoLog('Jogo começou. Nome do Jogador: ' + jogador.nome);
        adicionarAoLog(historia); // Adiciona a história ao log de mensagens

        document.getElementById('musicaFundo').play();
        atualizarStatusPersonagem(); // atualiza o painel de status após começar o jogo
        salvarProgresso(); // salva o progresso após começar o jogo
    });

    document.getElementById('toggleStatus').addEventListener('click', function() {
        let statusPersonagem = document.getElementById('statusPersonagem');
        if (statusPersonagem.style.display === "none") {
            statusPersonagem.style.display = "block";
            this.textContent = "Ocultar Status"; // muda o texto do botão para "Ocultar Status"
        } else {
            statusPersonagem.style.display = "none";
            this.textContent = "Mostrar Status"; // muda o texto do botão para "Mostrar Status"
        }
    });    

    document.getElementById('atacar').addEventListener('click', function() {
        jogador.atacar(monstro, 'normal');
        adicionarAoLog('Jogador ataca Monstro. Vida do Monstro: ' + monstro.vida);
        if (monstro.vida <= 0) {
            jogador.ganharExperiencia(100); // o jogador ganha 100 pontos de experiência por derrotar o monstro
            adicionarAoLog('O monstro morreu. Você venceu o jogo! Você ganhou 100 pontos de experiência.');
            reiniciarJogo();
        } else {
            monstro.atacar(jogador);
            adicionarAoLog('Monstro ataca Jogador. Vida do Jogador: ' + jogador.vida);
            if (jogador.vida <= 0) {
                adicionarAoLog('O jogador morreu. Fim de jogo!');
                reiniciarJogo();
            }
        }
        atualizarStatusPersonagem(); // atualiza o painel de status após cada ataque
        salvarProgresso(); // salva o progresso após cada ataque
    });

    document.getElementById('atacarEspecial').addEventListener('click', function() {
        if (jogador.ataquesEspeciais > 0) {
            jogador.atacar(monstro, 'especial');
            adicionarAoLog('Jogador ataca Monstro com ataque especial. Vida do Monstro: ' + monstro.vida);
        } else {
            adicionarAoLog('Jogador não tem mais ataques especiais disponíveis.');
        }
        atualizarStatusPersonagem(); // atualiza o painel de status após cada ataque especial
        salvarProgresso(); // salva o progresso após cada ataque especial
    });

    document.getElementById('tomarPocao').addEventListener('click', function() {
        jogador.usarItem(poção);
        adicionarAoLog('Jogador usa Poção de Cura. Vida do Jogador: ' + jogador.vida);
        atualizarStatusPersonagem(); // atualiza o painel de status após usar um item
        salvarProgresso(); // salva o progresso após usar um item
    });

    // Carrega o progresso salvo quando o jogo começa
    carregarProgresso();
});
