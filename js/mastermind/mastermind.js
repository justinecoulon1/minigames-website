(() => {
    const solution = [];
    const colors = ['red', 'blue', 'green', 'yellow']
    const currentTry = [];
    const hints = [];
    const exampleBubble = document.querySelectorAll("#colored-bubble");
    const mainContainerDiv = document.querySelector(".main-container-div");
    const initialTryContainerDiv = document.querySelector(".initial-try-container-div");
    let initialTryDiv = "";
    let tryBubbles = "";
    const playButton = document.querySelector(".play-button");

    const initializeGame = function () {
        initializeDisplay();
        initializeSolution();
    }

    const initializeDisplay = function () {
        initialTryContainerDiv.replaceChildren();
        mainContainerDiv.replaceChildren();
        initialTryDiv = document.createElement('div');
        initialTryDiv.classList.add("try-bubbles-div");
        initialTryDiv.id = "initial-try-div"
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add("bubbles-div");

        for (let i = 0; i < colors.length; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add("try-bubble");
            bubble.id = i + 1;
            bubbleDiv.append(bubble);
        }
        initialTryDiv.append(bubbleDiv);
        initialTryContainerDiv.append(initialTryDiv);
        tryBubbles = document.querySelectorAll(".try-bubble");
    }

    const initializeSolution = function () {
        solution.length = 0;
        for (let i = 0; i < colors.length; i++) {
            solution.push(colors[Math.floor(Math.random() * colors.length)]);
        }
    }

    const resetCurrentTry = function () {
        currentTry.length = 0;
        for (let tryBubble of tryBubbles) {
            tryBubbleClasses = tryBubble.classList;
            tryBubble.classList.remove(tryBubbleClasses[1]);
        }
    }

    const addCurrentTryDisplayToHistory = function () {
        const currentTryDiv = document.createElement('div');
        currentTryDiv.classList.add("try-bubbles-div");
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add("bubbles-div");

        for (let i = 0; i < colors.length; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add("try-bubble");
            bubble.id = i + 1;
            bubble.classList.add(currentTry[i])
            bubbleDiv.append(bubble);
        }
        const currentHints = getHintsDisplay();
        currentTryDiv.append(bubbleDiv);
        currentTryDiv.append(currentHints);
        mainContainerDiv.prepend(currentTryDiv);
    }

    const checkMatches = function () {
        hints.length = 0;

        let validCount = 0;
        const copyOfSolution = [...solution];
        const copyOfCurrentTry = [...currentTry];

        for (let i = 0; i < currentTry.length; i++) {
            if (currentTry[i] === solution[i]) {
                validCount++;
                hints.push("check.png")
                copyOfSolution[i] = null;
                copyOfCurrentTry[i] = null;
            }
        }

        for (let k = 0; k < copyOfCurrentTry.length; k++) {
            const color = copyOfCurrentTry[k];
            if (color) {
                if (copyOfSolution.includes(color)) {
                    const solutionColorIndex = copyOfSolution.indexOf(color);
                    copyOfSolution[solutionColorIndex] = null
                    hints.push("warning.png")
                } else {
                    hints.push("incorrect.png")
                }
            }
        }

        if (isGameEnded(validCount)) {
            displayGameEnd();
        }
    }

    const isGameEnded = function (validCount) {
        return validCount === currentTry.length;
    }

    const getHintsDisplay = function () {
        const hintsDiv = document.createElement('div');
        hintsDiv.classList.add("hints-div");
        for (let i = 0; i < hints.length; i++) {
            const hintDiv = document.createElement('div');
            hintDiv.classList.add("hint-div");
            const hintImg = document.createElement('img');
            hintImg.src = `../images/mastermind/${hints[i]}`
            hintDiv.append(hintImg);
            hintsDiv.append(hintDiv);
        }
        return hintsDiv;
    }

    const displayGameEnd = function () {
        mainContainerDiv.replaceChildren();
        const winningMessageP = document.createElement('p');
        winningMessageP.classList.add('winning-message-p');
        winningMessageP.textContent = "YOU WON!";
        mainContainerDiv.append(winningMessageP);
    }

    playButton.addEventListener('click', initializeGame);


    const coloredBubblesEventListener = function () {
        if (currentTry.length < colors.length) {
            currentTry.push(this.classList[0]);
            tryBubbles[currentTry.length - 1].classList.add(this.classList[0]);
        }

        if (currentTry.length === colors.length) {
            checkMatches();
            addCurrentTryDisplayToHistory();
            resetCurrentTry();
        }
    }
    exampleBubble.forEach((bubble) => bubble.addEventListener('click', coloredBubblesEventListener));


    const rulesButton = document.querySelector('.rules-button');
    rulesButton.addEventListener('click', openLightbox)

    function openLightbox() {
        document.getElementById('rulesLightbox').style.display = 'flex';
    }

    const lightbox = document.querySelector('.lightbox');
    lightbox.addEventListener('click', closeLightbox)

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', closeLightbox)


    function closeLightbox(e) {
        if (e) e.preventDefault();
        document.getElementById('rulesLightbox').style.display = 'none';
    }
})()