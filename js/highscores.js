// ============================================
// HIGH SCORES
// ============================================
function getHighScores() {
    try {
        const scores = localStorage.getItem('munneler_highscores');
        return scores ? JSON.parse(scores) : [];
    } catch {
        return [];
    }
}

function saveHighScore(score) {
    const scores = getHighScores();
    scores.push(score);
    scores.sort((a, b) => b - a);
    const top5 = scores.slice(0, 5);
    localStorage.setItem('munneler_highscores', JSON.stringify(top5));
    return top5;
}

function isHighScore(score) {
    const scores = getHighScores();
    return scores.length < 5 || score > scores[scores.length - 1];
}
