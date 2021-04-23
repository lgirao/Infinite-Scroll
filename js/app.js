
// By placing functions and variables inside an immediately invoked function expression, you can avoid polluting them to the global object
(function () {

const quotesEl = document.querySelector('.quotes');
const loaderEl = document.querySelector('.loader');

// Get quotes from API
const getQuotes = async (page, limit) => {
    const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const response = await fetch(API_URL);
    // handle 404
    if(!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
    }
    return await response.json();
}

// show the quotes
const showQuotes = (quotes) => {
    quotes.forEach(quote => {
        const quoteEl = document.createElement('blockquote');
        quoteEl.classList.add('quote');

        quoteEl.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>${quote.author}</footer>
        `;

        quotesEl.appendChild(quoteEl);
    });
};


const hideLoader = () => {
    loaderEl.classList.remove('show');
};

const showLoader = () => {
    loaderEl.classList.add('show');
};

const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
};

// Load Quotes
const loadQuotes = async (page, limit) => {
    // Show loader
    showLoader();
    // 0.5 seconds later
    setTimeout(async () => {
        try {
            // if there are more quotes to fetch
            if(hasMoreQuotes(page, limit, total)) {
                // call API to get quotes
                const response = await getQuotes(page, limit);
                // Show quotes
                showQuotes(response.data);
                // Update the total
                total = response.total;
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            hideLoader();
        }
    }, 500);

};

// Define control variables
let currentPage = 1;
const limit = 10;
let total = 0;


window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMoreQuotes(currentPage, limit, total)) {
            currentPage++;
            loadQuotes(currentPage, limit);
        }
}, {
    passive: true
});


// Initialize
loadQuotes(currentPage, limit);

})();