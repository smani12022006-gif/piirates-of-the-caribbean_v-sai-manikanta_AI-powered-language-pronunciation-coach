/**
 * Calculate pronunciation accuracy score
 * Compares the expected text with the spoken text
 */
export const calculateScore = (expectedText, spokenText) => {
    if (!expectedText || !spokenText) {
        return 0;
    }

    const expected = expectedText.toLowerCase().trim();
    const spoken = spokenText.toLowerCase().trim();

    // Exact match
    if (expected === spoken) {
        return 100;
    }

    // Calculate similarity using Levenshtein distance
    const distance = levenshteinDistance(expected, spoken);
    const maxLength = Math.max(expected.length, spoken.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return Math.max(0, Math.round(similarity));
};

/**
 * Levenshtein distance algorithm
 * Measures the minimum number of single-character edits required
 */
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Get feedback message based on score
 */
export const getFeedback = (score) => {
    if (score >= 90) return 'Excellent! Perfect pronunciation!';
    if (score >= 75) return 'Great job! Very good pronunciation.';
    if (score >= 60) return 'Good effort! Keep practicing.';
    if (score >= 40) return 'Not bad! Try again for better results.';
    return 'Keep practicing! You can do it!';
};
