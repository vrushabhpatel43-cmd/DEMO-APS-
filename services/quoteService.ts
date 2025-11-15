const quotes: string[] = [
    "The secret of getting ahead is getting started.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Act as if what you do makes a difference. It does.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "Strive not to be a success, but rather to be of value."
];

/**
 * @returns A randomly selected quote from the list.
 */
export const getRandomQuote = (): string => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
};
