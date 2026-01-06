const rows = document.querySelectorAll('.row');
let currentRow = 0;
let currentCell = 0;
let gameWon = false;
let gameLosed = false;
let trophyInterval;

const playerAuth = navigator.userAgent;
let losses = localStorage.getItem(`losses-${playerAuth}`) ? parseInt(localStorage.getItem(`losses-${playerAuth}`)) : 0;
let victories = localStorage.getItem(`victories-${playerAuth}`) ? parseInt(localStorage.getItem(`victories-${playerAuth}`)) : 0;
let streak = localStorage.getItem(`streak-${playerAuth}`) ? parseInt(localStorage.getItem(`streak-${playerAuth}`)) : 0;
let bestStreak = localStorage.getItem(`bestStreak-${playerAuth}`) ? parseInt(localStorage.getItem(`bestStreak-${playerAuth}`)) : 0;
let themeAuth = localStorage.getItem(`themeAuth-${playerAuth}`) ? parseInt(localStorage.getItem(`themeAuth-${playerAuth}`)) : 0;
const streakDiv = document.querySelector('.racha');  
let isSmallScreen = window.innerWidth < 768;

const words = [
    'skibidi',
    'gyatt',
    'sigma',
    'mewing',
    'aura',
    'caseoh',
    'rizz',
    'rizzler',
    'ohio',
    'edge',
    'beta',
    'alpha',
    'cook',
    'brainrot',
    'chamba',
    'Jynxzi',
    'Mog',
    'Costco',
    'mango',
    'sixseven',
    'ksi',
    'thickofit',
    'donpollo',
    'edging',
    'babygronk',
    'asmr',
    'sus',
    'ishowspeed',
    'nocap',
    'discord',
    'twentyone',
    'brentpeterson',
    'binarybrothers',
    'dukedenis',
    'yapping',
    'glazing',
    'winterarc',
    'drakevideo',
    'prime',
    'BalkanRage',
    'griddy',
    'babayi',
    'superidol',
    'rickroll',
    'kaicenat',
    'snapscore',
    'bodycount',
    'dababy',
    'gigachad',
    'mrbeast',
    'drippy',
    'lunchly',
    'goffy',
    'ahh',
    'niga',
    'rizzapp',
    'imposter',
    'bacon',
    'friedchips',
    'eatyourvegetables',
    'fortyone',
    'victoryfortheog',
    'smurfcat',
    'carnival',
    'maincharacter',
    'luhcalmfit',
    'arthurlutherking',
    'dreads',
    'bucklemyshoe',
    'chipichipachapa',
    'jonkler',
    'bartolozzi',
    'mynewcharacter',
    'bigecheese',
    'greenfn',
    'Oklahoma',
    'jigsaw',
    'redlava',
    'formysafety',
    'sorrymaxing',
    'based',
    'mid',
    'npc',
    'Yassification',
    'Shrekoning',
    'Backrooms',
    'Doomer',
    'Speedrun',
    'ligma',
    'amogus',
    'pepega',
    'poggers',
    'ratio',
    'skibiditoilet',
    'minecraftsteve',
    'Karen',
    'Bussin',
    'TopG',
    'Ezz',
    'Grass',
    'Bruh',
    'bomboclatt',
    'Zestyvibes',
    'charliekirk',
    'totr',
    'stillwater',
    'vexbolts'
];

const filteredWords = isSmallScreen ? words.filter(word => word.length <= 7) : words;

let correctWord = getNewWord();
let wordLength = correctWord.length;

function getNewWord() {
    return filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
}

function createCells() {
    // Asegurarse de que las filas existentes se eliminen si es necesario
    rows.forEach(row => row.innerHTML = ''); // Limpiar filas anteriores

    // Crear las celdas dependiendo de la longitud de la palabra
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            row.appendChild(cell);
        }
    }
}

createCells();

function updateStats() {
    streakDiv.textContent = `Racha: ${streak}🔥`;
    document.querySelector(".victorias").innerText =  "Victorias: " + victories;
    document.querySelector(".derrotas").innerText = "Derrotas: " + losses;
    document.querySelector(".rachap").innerText = "Racha de victorias: " + streak;
    document.querySelector(".mjracha").innerText = "Mejor racha: " + bestStreak;
}

updateStats();

function handleEnter(cells) {
    const isSmallScreen = window.innerWidth < 768;
    const cell = cells[currentCell];
    
    if (currentCell < wordLength) {
        showErrorMessage();
        return;
    }

    const currentRowCells = rows[currentRow].querySelectorAll('.cell');
    currentRowCells.forEach(cell => {
        cell.style.color = 'var(--keyenter)';
    });

    colorCells(cells);

    const guessedWord = Array.from(cells).map(cell => cell.textContent).join('');
    if (guessedWord === correctWord) {
        gameWon = true;
        gameLosed = false;
        streak++;
        victories++;
        localStorage.setItem(`victories-${playerAuth}`, victories);
        localStorage.setItem(`streak-${playerAuth}`, streak);
        
        if (streak > bestStreak) {
            bestStreak = streak;
            localStorage.setItem(`bestStreak-${playerAuth}`, bestStreak);
        }

        if (isSmallScreen) {
            smallScreenFinish();
        }
        setTimeout(() => {
            showVictoryMenu();
            streakDiv.classList.remove('hidden');
            updateStats();
        }, 2000);
        return;
    }

    currentRow++;
    currentCell = 0;

    if (currentRow >= rows.length) {
        if (isSmallScreen) {
            smallScreenFinish();
        }
        setTimeout(() => {
            gameLosed = true;
            streak = 0;
            losses++;
            localStorage.setItem(`losses-${playerAuth}`, losses);
            localStorage.setItem(`streak-${playerAuth}`, streak);
            updateStats();
            streakDiv.classList.add('hidden');
            showLoseMenu();
        }, 2000);
        return;
    }

    if (currentRow < rows.length) {
        rows[currentRow].querySelectorAll('.cell')[currentCell].style.borderColor = 'var(--blue)';
    }
}


function handleBackspace(cells) {
    if (currentCell > 0) {
        currentCell--;
        cells[currentCell].textContent = '';
        cells[currentCell].style.borderColor = 'var(--blue)';
        cells[currentCell].style.color = '';
        cells[currentCell + 1].style.borderColor = 'var(--key-bg)';
    }
}

function handleLetter(letter) {
    const row = rows[currentRow];
    const cells = row.querySelectorAll('.cell');
    const cell = cells[currentCell];

    if (currentCell === wordLength) return; 

    cell.textContent = letter;
    cell.style.color = 'var(--keycolor)';
    cell.style.borderColor = 'var(--key-bg)';
    currentCell++;

    if (currentCell < wordLength) {
        cells[currentCell].style.borderColor = 'var(--blue)';
    }
}

function handleKeyPress(e) {
    if (gameWon) return;

    const key = e.key.toUpperCase();
    const row = rows[currentRow];
    const cells = row.querySelectorAll('.cell');

    if (e.key.match(/[a-zA-Z]/g) && e.key.length === 1) {
        if (currentCell === wordLength) return;  // No permite escribir más caracteres que la longitud de la palabra
        cells[currentCell].textContent = key;
        cells[currentCell].style.borderColor = 'var(--key-bg)';
        currentCell++;
        if (currentCell < wordLength) {
            cells[currentCell].style.borderColor = 'var(--blue)';
        }
    } else if (key === 'BACKSPACE') {
        handleBackspace(cells);
    } else if (key === 'ENTER') {
        handleEnter(cells);
    }
}

const letterButtons = document.querySelectorAll('.key'); 

letterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const letter = button.textContent.toUpperCase();
        
        if (gameWon) return; 

        const row = rows[currentRow];
        const cells = row.querySelectorAll('.cell');

        if (button.classList.contains('check')) { 
            handleEnter(cells);
        } else if (button.classList.contains('borr')) {  
            handleBackspace(cells);
        } else {  
            handleLetter(letter);
        }
    });
});

function showErrorMessage() {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 2000);
}

function colorKeyboard(letter, color) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.textContent === letter) {
            const currentColor = key.style.backgroundColor;

            if (currentColor === 'var(--green)') {
                return; 
            }

            if (currentColor === 'var(--yellow)' && color !== 'var(--green)') {
                return;
            }

            if (currentColor === 'var(--background-cell-key)') {
                return;
            }

            key.style.backgroundColor = color;
            key.style.color = 'var(--keyentercolor)';
        }
    });
}


function resetKeyboardColors() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.style.backgroundColor = 'var(--key-bg)';
    });
}

function colorCells(cells) {
    const wordArray = correctWord.split('');
    const guessedArray = Array.from(cells).map(cell => cell.textContent);

    guessedArray.forEach((letter, index) => {
        if (wordArray[index] === letter) {
            cells[index].style.backgroundColor = 'var(--green)';
            colorKeyboard(letter, 'var(--green)');
            wordArray[index] = null;
            guessedArray[index] = null;
        }
    });

    guessedArray.forEach((letter, index) => {
        if (letter === null) return;
        const foundIndex = wordArray.indexOf(letter);
        if (foundIndex !== -1) {
            cells[index].style.backgroundColor = 'var(--yellow)';
            colorKeyboard(letter, 'var(--yellow)');
            wordArray[foundIndex] = null;
        } else {
            cells[index].style.backgroundColor = 'var(--background-cell-key)';
            colorKeyboard(letter, 'var(--background-cell-key)');
        }
    });

}


function showVictoryMenu() {
    const victoryMenu = document.querySelector('.victory-menu');
    victoryMenu.classList.remove('hidden');
    const correctWordElement = document.querySelector('.correct_word');
    correctWordElement.textContent = `La palabra correcta es: ${correctWord}`;

    const aquiContainer = document.querySelector('.aqui_container');
    if (aquiContainer) {
        aquiContainer.classList.remove('hidden');
    }
}

function showLoseMenu() {
    const loseMenu = document.querySelector('.lose-menu');
    loseMenu.classList.remove('hidden');
    const correctWordElement = document.querySelector('.correct_wordd');
    correctWordElement.textContent = `La palabra correcta era: ${correctWord}`;

    const aquiContainer = document.querySelector('.aqui_container');
    if (aquiContainer) {
        aquiContainer.classList.remove('hidden');
    }
}

function showConfigMenu() {
    updateStats()
    const configMenu = document.querySelector('.config-menu')
    configMenu.classList.remove('hidden');
}

function smallScreenFinish() {
    const trophy = document.querySelector('.config');
    if (window.innerWidth < 768 && trophy && (gameWon || gameLosed)) {
        trophy.style.transition = 'font-size 0.6s ease-in-out';
        let enlarged = false;

        trophyInterval = setInterval(() => {
            trophy.style.fontSize = enlarged ? '25px' : '30px';
            enlarged = !enlarged;
        }, 1000);
    }
}

function restartGame() {
    resetKeyboardColors();
    console.log("Reiniciando el juego...");
    const aquiContainer = document.querySelector('.aqui_container');
    aquiContainer.classList.add('hidden');
    gameWon = false;
    gameLosed = false;
    currentRow = 0;
    currentCell = 0;

    correctWord = getNewWord();
    wordLength = correctWord.length; 

    rows.forEach(row => {
        row.innerHTML = '';
    });

    createCells();

    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.style.backgroundColor = 'var(--key-bg)';
        key.style.color = 'var(--keycolor)'
    });

    hideVictoryMenu();
    hideLoseMenu();

    // Detener la animación si está activa
    if (trophyInterval) {
        clearInterval(trophyInterval);
        trophyInterval = null;  // Resetear la variable
        const trophy = document.querySelector('.config');
        if (trophy) {
            trophy.style.fontSize = '25px';  // Restaurar tamaño original
        }
    }
}


function hideVictoryMenu() {
    const victoryMenu = document.querySelector('.victory-menu');
    victoryMenu.classList.add('hidden');
}

function hideLoseMenu() {
    const loseMenu = document.querySelector('.lose-menu');
    loseMenu.classList.add('hidden');
}

function hideConfigMenu() {
    const configMenu = document.querySelector('.config-menu')
    configMenu.classList.add('hidden')
}

function exit() {
    console.log("Saliendo...");
    hideVictoryMenu();
    hideLoseMenu();
    hideConfigMenu()
}

function handleTrophyClick() {
    if (gameWon) {
        showVictoryMenu(); 
    } else if (gameLosed) {
        showLoseMenu();
    }
}

function handleConfigClick() {
    showConfigMenu()
}

function easterEggskibidi() {
    console.log(`Shhh dont say ${correctWord}`)
}

function showFooter() {
    const footerText = document.querySelector('.footer_text');

    if (footerText) {
        if (isSmallScreen) {
            footerText.classList.remove('hidden');
            footerText.style.color = 'var(--keycolor)';
            footerText.style.fontSize = '13px'
        } else {
            footerText.classList.add('hidden');
        }
    }
}

showFooter();
setInterval(function() {
    isSmallScreen = window.innerWidth < 768;
    showFooter();
}, 2000); 


const trophyButton = document.querySelector('.config');
const configButton = document.querySelector('.user')
if (trophyButton) {
    trophyButton.addEventListener('click', handleTrophyClick);
}

if (configButton) {
    configButton.addEventListener('click', handleConfigClick);
}

const icon = document.querySelector('#toggle-theme');
const root = document.documentElement;

let savedTheme = localStorage.getItem(`themeAuth-${playerAuth}`);
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        icon.classList.add('fa-sun');
        icon.classList.remove('fa-moon');
    } else {
        icon.classList.add('fa-moon');
        icon.classList.remove('fa-sun');
    }
} else {
    root.setAttribute('data-theme', 'dark');
    icon.classList.add('fa-sun');
}

icon.addEventListener('click', () => {
    if (root.getAttribute('data-theme') === 'dark') {
        root.setAttribute('data-theme', 'white');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem(`themeAuth-${playerAuth}`, 'white');
    } else {
        root.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem(`themeAuth-${playerAuth}`, 'dark');
    }
});

document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('exitBtn').addEventListener('click', exit);
document.getElementById('restartBtn2').addEventListener('click', restartGame);
document.getElementById('exitBtn2').addEventListener('click', exit);
document.getElementById('exitBtn3').addEventListener('click', exit);
document.addEventListener('DOMContentLoaded', () => {
    const streakDiv = document.querySelector('.racha');
    streakDiv.textContent = `Racha: ${streak}🔥`;
    if (streak > 0) {
        streakDiv.classList.remove('hidden');
    }
});

document.addEventListener('keydown', handleKeyPress);