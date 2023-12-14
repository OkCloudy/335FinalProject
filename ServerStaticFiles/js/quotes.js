const api_url ="https://zenquotes.io/api/random/";
const quoteDiv = document.getElementById("quote");

async function getQuote() {
    console.log("yup");
    const response = await fetch("/get-quote");
    let data = await response.json();
    console.log(data[0]);

    // Creating Quote
    let quoteText = document.createElement("p");
    quoteText.textContent = data[0]["q"];
    quoteDiv.appendChild(quoteText);

    // Creating Author 
    let quoteAuthor = document.createElement("p");
    quoteAuthor.textContent = "- " + data[0]["a"];
    quoteDiv.appendChild(quoteAuthor);
}

getQuote();