const logo = document.querySelector('#logo')
const form = document.querySelector('form');
const wordInput = document.querySelector('#searchWord');
const categoryInput = document.querySelector('#category');
const searchDetails = document.querySelector('#search')
const resultList = document.querySelector('ul');
const url = new URL('https://api.datamuse.com/words');


form.addEventListener('submit', (e) => {
  e.preventDefault();
  searchDetails.textContent = "";
  resultList.textContent = "";
  toggleLogoAnimation(true);
  const word = wordInput.value;
  const categoryCode = categoryInput.value;
  const categoryName = e.target["1"][e.target["1"].selectedIndex].text;
  console.log({ categoryInput })
  getWords(word, categoryCode, categoryName);
  toggleLogoAnimation(false);
})

resultList.addEventListener('click', (e) => {
  if (e.target.nodeName === 'LI') {
    copyWord(e.target.textContent);
  }
})

async function getWords(word, categoryCode, categoryName) {
  url.search = new URLSearchParams({
    max: 5,
    [categoryCode]: word
  });
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.length) {
        setTimeout(() => {
          searchDetails.textContent = `${word} ༼ つ ◕_◕ ༽つ ${categoryName}`;
          populateResults(data);
        }, 2000)
      } else {
        throw new Error("No results found! Please try another category or word!")
      }
    } else {
      throw new Error(`${response.statusText}. We are experiencing some technical difficulties. Please try again later.`)
    }
  } catch (error) {
    setTimeout(() => {
      searchDetails.textContent = `${word} ༼ つ ◕_◕ ༽つ ${categoryName}`;
      populateResults([{ word: error.message }])
    }, 2000)
  }
}

function populateResults(resultsArr) {
  resultsArr.forEach(result => {
    const entry = document.createElement('li');
    entry.textContent = result.word;
    entry.setAttribute('title', 'Click to copy')
    resultList.append(entry);
  });
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