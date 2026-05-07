# Monster Hipervideo

Este projeto é uma página de publicidade interativa para Monster Energy. A ideia é simular um **hypervideo**: enquanto o vídeo passa, aparecem pontos clicáveis na tela. Quando o usuário clica em um ponto, abre um card com informações do produto, oferta ou chamada de compra.

## Arquivos principais

- `index.html`: monta a estrutura da página.
- `styles.css`: cuida do visual, layout, responsividade, animações e aparência dos cards.
- `script.js`: controla as cenas do vídeo, os botões, a barra de progresso e os pontos clicáveis.
- `videos/`: pasta com os vídeos usados em cada cena.
- `images/monster-logo.webp`: logo exibido no painel lateral.
- `images/raissa.webp`: imagem decorativa de fundo.

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar dependências, porque o projeto usa apenas HTML, CSS e JavaScript puro.

## Como a tela é organizada

A página tem três áreas principais:

1. **Painel lateral**
   Mostra o logo, uma explicação curta, os botões de atalho para as cinco cenas e uma chamada de compra.

2. **Área do vídeo**
   Mostra o vídeo atual, os controles de voltar, reproduzir/pausar e avançar, a cena atual, o tempo do vídeo e os pontos clicáveis.

3. **Chamada final**
   Fica no fim da página, no bloco `#comprar`. Os botões dos cards levam o usuário para essa seção.

## Como o JavaScript funciona

O arquivo `script.js` começa com o array `cenas`. Esse array é o coração do projeto.

Cada cena tem:

- `arquivo`: caminho do vídeo.
- `nome`: nome curto da cena, como `Cena 01`.
- `titulo`: título que aparece nos botões de navegação.
- `pontos`: lista de pontos clicáveis que aparecem durante aquela cena.

Exemplo simplificado:

```js
{
  arquivo: "videos/scene-1.mp4",
  nome: "Cena 01",
  titulo: "Vantagens",
  pontos: [
    {
      inicio: 0.4,
      fim: 6.8,
      x: "80%",
      y: "40%",
      chamada: "Rótulo de energia",
      titulo: "Vantagens na lata",
      texto: "Texto que aparece no card.",
      botao: "Ver benefícios"
    }
  ]
}
```

## Como os pontos aparecem

Cada ponto tem um tempo inicial e final:

- `inicio`: segundo em que o ponto começa a aparecer.
- `fim`: segundo em que o ponto some.

Durante a reprodução, o evento `timeupdate` do vídeo chama a função `atualizarProgresso()`. Essa função atualiza a barra de progresso, atualiza o tempo na tela e chama `mostrarPontos()`.

A função `mostrarPontos()` verifica quais pontos devem estar visíveis naquele segundo do vídeo. Se o tempo atual estiver entre `inicio` e `fim`, o ponto aparece. Se estiver fora desse intervalo, ele some.

## Como a posição dos pontos funciona

Cada ponto usa:

- `x`: posição horizontal.
- `y`: posição vertical.

Os valores são porcentagens da área do vídeo. Por exemplo:

- `x: "80%"` coloca o ponto perto do lado direito.
- `y: "40%"` coloca o ponto um pouco acima do meio.

No CSS, essas posições viram variáveis:

```css
left: var(--x);
top: var(--y);
```

## O que acontece quando o usuário clica em um ponto

Quando o usuário clica no ponto:

1. O JavaScript salva qual ponto está aberto em `pontoAberto`.
2. A função `mostrarPontos(true)` redesenha os pontos.
3. O card aparece com título, texto, botão e, se existir, rótulo de informação.
4. A função `atualizarVelocidadeVideo()` reduz a velocidade do vídeo para `0.12`, dando tempo para o usuário ler.
5. Quando o card é fechado, a velocidade volta para `1`.

## Como a troca de cenas funciona

A função `carregarCena()` recebe o número da cena que deve abrir.

Ela faz estes passos:

1. Calcula o índice correto da cena.
2. Limpa pontos abertos.
3. Troca o `src` do vídeo.
4. Zera a barra de progresso e o tempo.
5. Atualiza os botões ativos.
6. Carrega o novo vídeo.
7. Reproduz automaticamente, se for necessário.

Quando uma cena termina, o evento `ended` chama `carregarCena(cenaAtual + 1)`, passando para a próxima cena. Na última cena, o vídeo para.

## Funções importantes

- `formatarTempo(segundos)`: transforma segundos em formato `00:00`.
- `montarListaCenas()`: cria os botões inferiores das cenas.
- `atualizarBotoesAtivos()`: marca qual cena está ativa.
- `atualizarVelocidadeVideo()`: deixa o vídeo lento quando um card está aberto.
- `carregarCena(indiceCena, deveTocar)`: troca o vídeo atual.
- `montarRotulo(ponto)`: cria o rótulo de energia, quando o ponto tem dados extras.
- `montarCardPonto(ponto)`: cria o card que aparece depois do clique.
- `pegarPontosVisiveis()`: descobre quais pontos devem aparecer no tempo atual.
- `mostrarPontos(forcarAtualizacao)`: desenha os pontos na tela.
- `atualizarProgresso()`: atualiza tempo, barra de progresso e pontos.

## Como alterar uma cena

Para mudar o título da Cena 02, por exemplo, altere no `script.js`:

```js
titulo: "Preço e sabores"
```

Para trocar o vídeo, altere:

```js
arquivo: "videos/scene-2.mp4"
```

## Como alterar um ponto

Para mudar quando ele aparece:

```js
inicio: 0.5,
fim: 5.4
```

Para mudar a posição:

```js
x: "84%",
y: "50%"
```

Para mudar o texto do card:

```js
titulo: "Escolha sua Monster",
texto: "Texto que aparece dentro do card.",
botao: "Comparar sabores"
```


