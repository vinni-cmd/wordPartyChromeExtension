const logo = document.querySelector('#logo')
const form = document.querySelector('form');
const wordInput = document.querySelector('#searchWord');
const categoryInput = document.querySelector('#category');
const resetButton = document.querySelector('#reset')
const searchDetails = document.querySelector('#search')
const resultList = document.querySelector('ul');
const url = new URL('https://api.datamuse.com/words');


// https://dictionaryapi.dev/

form.addEventListener('submit', (e) => {
  e.preventDefault();
  resetResults();
  toggleLogoAnimation(true);
  const word = wordInput.value;
  const categoryCode = categoryInput.value;
  getWords(word, categoryCode);
  toggleLogoAnimation(false);
})

resetButton.addEventListener('click', () => {
  resetResults();
})

resultList.addEventListener('click', (e) => {
  if (e.target.nodeName === 'BUTTON') {
    copyWord(e.target.textContent);
  }
})

function resetResults() {
  searchDetails.textContent = "";
  resultList.textContent = "";
}

async function getWords(word, categoryCode) {
  url.search = new URLSearchParams({
    max: 5,
    [categoryCode]: word,
  });
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.length) {
        console.log(data)
        setTimeout(() => {
          populateResults(data);
        }, 2000)
      } else {
        throw new Error("No results found! Please try another category or word!")
      }
    } else {
      throw new Error(`${response.statusText}. We are experiencing some technical difficulties. Please try again later.`)
    }
  } catch (error) {
    console.log(error.message)
    setTimeout(() => {
      populateResults(error.message)
    }, 2000)
  }
}

function populateResults(results) {
  searchDetails.textContent = `༼ つ ◕_◕ ༽つ`;
  if (Array.isArray(results)) {
    results.forEach(result => {
      const entryLi = document.createElement('li');
      const entryBtn = document.createElement('button');
      entryBtn.setAttribute('aria-label', `click to copy '${result}' to clipboard`);
      entryBtn.textContent = result.word;
      entryLi.append(entryBtn);
      resultList.append(entryLi);
    });
  } else {
    const entryLi = document.createElement('li');
    entryLi.textContent = results;
    resultList.append(entryLi);
  }
}

// api loading
function toggleLogoAnimation(bool) {
  if (bool) {
    logo.classList.add('animate')
  } else {
    setTimeout(() => {
      logo.classList.remove('animate');
    }, 2000)
  }
}

async function copyWord(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}