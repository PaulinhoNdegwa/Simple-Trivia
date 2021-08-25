const shuffleArray = (array)  => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const escapeHtml = (text) => {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&shy;/g, '-')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&eacute;/g, 'É')
        .replace(/&ldquo;/g, '"')
        .replace(/&rsquo;/g, "'");
}


export { shuffleArray, escapeHtml }