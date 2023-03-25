// Seleção de elementos do DOM
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

// Variáveis do jogo
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Array de objetos 'BANDEIRAS'
const items = [
    { name: "africa", image: "img/icons/africa.png" },
    { name: "alemanha", image: "img/icons/alemanha.png" },
    { name: "argentina", image: "img/icons/argentina.png" },
    { name: "brasil", image: "img/icons/brasil.png" },
    { name: "espanha", image: "img/icons/espanha.png" },
    { name: "eua", image: "img/icons/eua.png" },
    { name: "franca", image: "img/icons/franca.png" },
    { name: "italia", image: "img/icons/italia.png" },
    { name: "japao", image: "img/icons/japao.png" },
    { name: "ucrania", image: "img/icons/ucrania.png" },
    { name: "suica", image: "img/icons/suica.png" },
    { name: "uruguai", image: "img/icons/uruguai.png" },
];

//Tempo inicial
let seconds = 0,
    minutes = 0;

//Contadores iniciais
let movesCount = 0,
    winCount = 0;

// Função para o timer
const timeGenerator = () => {
    seconds += 1;
    // lógica dos minutos
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    // formata o tempo para exibição
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Tempo:</span>${minutesValue}:${secondsValue}`;
};

// Função para o contador de movimentos
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Movimentos:</span>${movesCount}`;
};


// Seleciona objetos aleatórios do array de objetos
const generateRandom = (size = 4) => {
    // array temporário
    let tempArray = [...items];
    // inicializa array de valores das cartas
    let cardValues = [];
    // o tamanho deve ser o dobro (matriz 4 * 4) / 2, já que existem pares de objetos
    size = (size * size) / 2;
    // Seleção aleatória de objetos
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // uma vez selecionado, remove o objeto do array temporário
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    //Limpa o conteúdo anterior do container
    gameContainer.innerHTML = "";
    //Cria uma cópia do array e duplica os valores
    cardValues = [...cardValues, ...cardValues];
    //Embaralha o array aleatoriamente
    cardValues.sort(() => Math.random() - 0.5);
    //Percorre o array e adiciona o HTML para cada carta na página
    for (let i = 0; i < size * size; i++) {
        gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/></div>
       </div>
       `;
    }
    //Cria uma grade para o container do jogo baseado no tamanho do tabuleiro
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Seleciona todas as cartas e adiciona um event listener de click para cada uma
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //Se a carta selecionada ainda não tiver sido combinada, execute o código (uma carta já combinada não terá a classe 'matched' e será ignorada se clicada novamente)
            if (!card.classList.contains("matched")) {
                //Vira a carta selecionada
                card.classList.add("flipped");
                //Se for a primeira carta a ser selecionada, atualize a variável 'firstCard' e 'firstCardValue'
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //Incrementa o contador de jogadas desde que o usuário selecionou a segunda carta
                    movesCounter();
                    //Se a segunda carta for selecionada, atualize as variáveis 'secondCard' e 'secondCardValue'
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    //Se os valores das duas cartas forem iguais, adicione a classe 'matched' às cartas para ignorá-las na próxima vez e atualize a variável 'firstCard' para false, já que a próxima carta será a primeira novamente. Se o usuário encontrou todos os pares corretos, mostre uma mensagem de vitória e pare o jogo.
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>Voce ganhou!</h2>
              <h4>Jogadas: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //Se as cartas selecionadas não forem iguais, volte a mostrá-las com um pequeno atraso de 900ms e limpe as variáveis 'firstCard' e 'secondCard'
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

//Iniciar jogo
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //oculta os controles e botões
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //Iniciar o temporizador
    interval = setInterval(timeGenerator, 1000);
    //movimentos iniciais
    moves.innerHTML = "<span>Movimentos:</span> " + movesCount;
    initializer();
});


//Parar o jogo
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        //exibir os controles e botões novamente
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

//Inicializa valores e chama as funções necessárias
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};