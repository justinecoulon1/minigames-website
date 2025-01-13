"use strict";

(() => {
    const GAME_FUNCTIONS = {
        initGame: function () {
            GAME_VARIABLES.secretWord = GAME_FUNCTIONS.getRandomWord();
            GAME_VARIABLES.secretWordFormatted = GAME_VARIABLES.secretWord.toLowerCase();
            GAME_VARIABLES.currentlyGuessedWord = [];
            GAME_VARIABLES.currentTriesAmount = 0;
            GAME_VARIABLES.maxTriesAmount = 6;
            GAME_FUNCTIONS.updateCurrentlyGuessedWord([]);
        },
        getRandomWord: function () {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const words = randomCategory.words;
            return words[Math.floor(Math.random() * words.length)];
        },
        triggerGameWon: function () {
            if (GAME_VARIABLES.currentlyGuessedWord.join('') === GAME_VARIABLES.secretWord) {
                const wonMessage = `YOU WON! The word was "${GAME_VARIABLES.secretWord}" `;
                RENDERERS.displayEndGamePage(wonMessage);
            }
        },
        triggerGameLost: function () {
            if (GAME_VARIABLES.currentTriesAmount === GAME_VARIABLES.maxTriesAmount) {
                const lostMessage = `YOU LOST! The word was "${GAME_VARIABLES.secretWord}" `;
                RENDERERS.displayEndGamePage(lostMessage);
            }
        },
        updateTriesAmount: function () {
            GAME_VARIABLES.currentTriesAmount++;
            if (GAME_VARIABLES.currentTriesAmount <= GAME_VARIABLES.maxTriesAmount) {
                RENDERERS.updateTriesDisplay();
            }
        },
        tryLetter: function (letter, letterBtn) {
            if (GAME_VARIABLES.secretWordFormatted.includes(letter)) {
                letterBtn.classList.add('letter-green-bg');
                const indexesOfMatches = GAME_VARIABLES.secretWordFormatted.split('')
                    .map((e, i) => e === letter ? i : -1)
                    .filter((element) => element != -1);
                GAME_FUNCTIONS.updateCurrentlyGuessedWord(indexesOfMatches);
                RENDERERS.updateSecretWordDisplay();
                GAME_FUNCTIONS.triggerGameWon();
            }
            else {
                letterBtn.classList.add('letter-red-bg');
                GAME_FUNCTIONS.updateTriesAmount();
                GAME_FUNCTIONS.triggerGameLost();
            }
        },
        updateCurrentlyGuessedWord: function (indexesOfMatches) {
            for (let i = 0; i < GAME_VARIABLES.secretWord.length; i++) {
                if (indexesOfMatches.includes(i)) {
                    GAME_VARIABLES.currentlyGuessedWord[i] = GAME_VARIABLES.secretWord.charAt(i);
                }
                else {
                    if (GAME_VARIABLES.currentlyGuessedWord[i] === '_' || indexesOfMatches.length === 0) {
                        GAME_VARIABLES.currentlyGuessedWord[i] = '_';
                    }
                }
            }
        }
    };
    const DOM = {
        playButton: getHTMLElementOrThrow('#play-button'),
        retryButton: getHTMLElementOrThrow('#retry-button'),
        gameSection: getHTMLElementOrThrow('#game-section'),
        hangManDiv: document.createElement('div'),
        hangManTriesText: document.createElement('p'),
        hangManImgContainer: document.createElement('div'),
        keyboardAndAnswerContainer: document.createElement('div'),
        secretWordDiv: document.createElement('div'),
        keyboardDiv: document.createElement('div'),
        keyboardLetters: [],
        secretWordLetterDivs: [],
        secretWordLetterContainer: document.createElement('div'),
    };
    function getHTMLElementOrThrow(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Missing ${selector}`);
        }
        return element;
    }
    const GAME_VARIABLES = {
        currentTriesAmount: 0,
        maxTriesAmount: 6,
        secretWord: '',
        secretWordFormatted: '',
        currentlyGuessedWord: [],
        alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    };
    const HANDLERS = {
        playButtonListener: function () {
            RENDERERS.toggleButtonDisabledClass(DOM.playButton);
            RENDERERS.toggleButtonDisabledClass(DOM.retryButton);
            GAME_FUNCTIONS.initGame();
            RENDERERS.initDisplay();
        },
        retryButtonListener: function () {
            GAME_FUNCTIONS.initGame();
            RENDERERS.initDisplay();
        },
        keyboardLettersListener: function (e) {
            const currentLetterBtn = e.currentTarget;
            RENDERERS.toggleButtonDisabledClass(currentLetterBtn);
            const currentLetter = currentLetterBtn.textContent;
            GAME_FUNCTIONS.tryLetter(currentLetter.toLowerCase(), currentLetterBtn);
        },
    };
    const RENDERERS = {
        initDisplay: function () {
            RENDERERS.resetDisplay();
            COMPONENT_CREATOR.createGameScreen();
            RENDERERS.updateTriesDisplay();
        },
        resetDisplay: function () {
            DOM.gameSection.replaceChildren();
            DOM.keyboardAndAnswerContainer.replaceChildren();
            DOM.keyboardDiv.replaceChildren();
            DOM.secretWordLetterContainer.replaceChildren();
            DOM.hangManDiv.replaceChildren();
        },
        displayEndGamePage: function (endMessage) {
            DOM.keyboardAndAnswerContainer.replaceChildren();
            const endScreenDiv = document.createElement('div');
            endScreenDiv.classList.add('end-screen-div');
            endScreenDiv.textContent = endMessage;
            DOM.keyboardAndAnswerContainer.append(endScreenDiv);
        },
        toggleButtonDisabledClass: function (button) {
            button.toggleAttribute('disabled');
        },
        updateTriesDisplay: function () {
            const amountOfTriesLeft = GAME_VARIABLES.maxTriesAmount - GAME_VARIABLES.currentTriesAmount;
            const hangManImg = document.createElement('img');
            hangManImg.classList.add('hangman-img');
            hangManImg.src = `../images/pendu/hangman_0${amountOfTriesLeft}.png`;

            DOM.hangManTriesText.classList.add('hang-man-tries-text')
            DOM.hangManTriesText.replaceChildren();
            DOM.hangManTriesText.textContent = `You have ${amountOfTriesLeft} tries left`;

            DOM.hangManImgContainer.classList.add('hang-man-img-container')
            DOM.hangManImgContainer.replaceChildren();
            DOM.hangManImgContainer.append(hangManImg);
        },
        updateSecretWordDisplay: function () {
            DOM.secretWordLetterContainer.replaceChildren();
            COMPONENT_CREATOR.createSecretWordLettersDiv(GAME_VARIABLES.secretWord.length);
        }
    };
    const COMPONENT_CREATOR = {
        createGameScreen: function () {
            DOM.hangManDiv.classList.add('hanging-man-div');
            DOM.keyboardAndAnswerContainer.classList.add('keyboard-answer-container');
            COMPONENT_CREATOR.createSecretWordDiv();
            DOM.keyboardDiv.classList.add('keyboard-div');
            DOM.keyboardAndAnswerContainer.append(DOM.keyboardDiv, DOM.secretWordDiv);
            DOM.hangManDiv.append(DOM.hangManTriesText, DOM.hangManImgContainer);
            DOM.gameSection.append(DOM.hangManDiv, DOM.keyboardAndAnswerContainer);
            COMPONENT_CREATOR.createKeyboardLettersDiv();
        },
        createSecretWordDiv: function () {
            DOM.secretWordLetterContainer.classList.add('secret-word-letters-container');
            DOM.secretWordDiv.classList.add('secret-word-div');
            COMPONENT_CREATOR.createSecretWordLettersDiv(GAME_VARIABLES.secretWord.length);
            DOM.secretWordDiv.append(DOM.secretWordLetterContainer);
        },
        createSecretWordLettersDiv: function (lengthOfWord) {
            for (let i = 0; i < lengthOfWord; i++) {
                const letterDiv = document.createElement('div');
                letterDiv.textContent = GAME_VARIABLES.currentlyGuessedWord[i];
                DOM.secretWordLetterContainer.append(letterDiv);
                DOM.secretWordLetterDivs.push(letterDiv);
            }
        },
        createKeyboardLettersDiv: function () {
            for (const letter of GAME_VARIABLES.alphabet) {
                const letterBtn = document.createElement('button');
                letterBtn.classList.add('letter-btn');
                letterBtn.textContent = letter.toUpperCase();
                letterBtn.addEventListener('click', HANDLERS.keyboardLettersListener);
                DOM.keyboardDiv.append(letterBtn);
                DOM.keyboardLetters.push(letterBtn);
            }
        }
    };
    DOM.playButton.addEventListener('click', HANDLERS.playButtonListener);
    DOM.retryButton.addEventListener('click', HANDLERS.retryButtonListener);
})()