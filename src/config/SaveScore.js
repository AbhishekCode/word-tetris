

const HIGH_SCORE_KEY = "highScore";

export const saveHighScore = (score) => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY)
    if (!savedHighScore || (savedHighScore && score > savedHighScore)) {
        localStorage.setItem(HIGH_SCORE_KEY, score);
    }
}

export const getHighScore = () => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY)
    if (savedHighScore)
        return savedHighScore;
    else
        return 0;
}


export const scoreForThisWord = (length) => {
    const forALetter = 10;
    let score = 0;
    for (let i = length; i > 0; i--) {
        score += forALetter * i
    }

    return score
}