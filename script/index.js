//  hide everything on landing except the Banner and Footer
document.getElementById("nav").style.display="none";
document.getElementById("vocabulary").style.display="none";
document.getElementById("faq").style.display="none";

function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active")
    }
}
// loadLessons
function loadLessons() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      displayLessons(data.data);
    });
}
// {id: 101, level_no: 1, lessonName: 'Basic Vocabulary'}

// displayLessons
function displayLessons(lessons) {
  const lessonContainer = document.getElementById("lesson-container");
  for (let lesson of lessons) {
    const lessonDiv = document.createElement("div");
    lessonDiv.innerHTML = `
        <li id="btn-${lesson.level_no}" onclick="loadSelectedLessonWords(${lesson.level_no})" class="btn btn-outline btn-primary group">
            <a href="#vocabulary"> <i class="fa-solid fa-book-open text-indigo-800 group-hover:text-white"></i> Lesson-${lesson.level_no}</a>
          </li>
        `;
    lessonContainer.append(lessonDiv);
  }
}

// loadWords all
function loadWords() {
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      displayWords(data.data);
    });
}

// {id: 1, level: 3, word: 'Abundant', meaning: null, pronunciation: 'অবানডান্ট'}

// display all words
function displayWords(words) {
  const wordsContainer = document.getElementById("words-container");
  wordsContainer.innerHTML = '';
  if(words.length == 0){
    wordsContainer.innerHTML=`
            <div class="col-span-full text-center space-y-5 bg-stone-100 p-5">
            <p class="text-xs text-stone-600">এই lesson-এ এখনো কোনো vocbulary যোগ করা হয়নি</p>
            <p class="text-2xl font-medium">Next lesson-এ যান।</p>
          </div>
    `
    return;
  }
  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
        <div class="card bg-base-100 shadow-sm h-full">
            <div class="card-body">
                <div class='flex flex-col justify-center items-center space-y-2'>
                <h2 class="card-title font-bold text-2xl">${word.word}</h2>
                <p>Meaning /Pronounciation</p>
                <p class='font-semibold text-2xl'>''${word.meaning} /${word.pronunciation}''</p></div>
                <div class="flex justify-between">
                    <button  onclick = loadWordDetails('${word.id}') class="p-2 bg-slate-200 text-white    rounded">
                    <i class="fas fa-info-circle text-slate-700"></i>
                    </button>
                    <button class="p-2 bg-slate-200 text-white rounded">
                    <i class="fas fa-volume-up text-slate-700"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    wordsContainer.append(wordCard);
  });
}
// selected Lesson Words
const loadSelectedLessonWords=(id)=>{
    const url= `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        const clickedButton = document.getElementById(`btn-${id}`);
        removeActiveClass();
        clickedButton.classList.add("active");
        displayWords(data.data);
    })
}
// loadWordDetails
const loadWordDetails=(wordId)=>{
    const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        displayWordDetails(data.data);
    })
    }

    // display word details
    const displayWordDetails = (word)=>{
        document.getElementById("word_details").showModal();
        const wordDetailsContainer = document.getElementById("word-details-container");
        // load synonyms
        const loadSynonyms = (synonyms)=>{
            if (synonyms && synonyms.length > 0) {
              return `
                <div class="flex flex-wrap gap-2">
                  ${synonyms.map(synonym => 
                    `<button class="btn border text-sm font-thin text-gray-600 bg-sky-50">${synonym}</button>`
                  ).join('')}
                </div>
              `;
            } else {
              return `<p>No synonyms available.</p>`;
            }
        }        
        wordDetailsContainer.innerHTML=`
        <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold">${word.word}
        <p class="text-xl font-medium"><span class="font-normal text-gray-700">(<i class="fas fa-microphone"></i>:${word.pronunciation})</span></p>
        </h2>
        <div>
        <p class="font-semibold text-lg">Meaning</p>
        <p class="text-gray-700">${word.meaning}</p>
        </div>

        <div class="my-4">
          <p class="font-semibold text-lg">Example</p>
          <p>"${word.sentence || 'No example sentence available.'}"</p>
        </div>

        <div class="my-4">
          <p class="font-semibold text-lg">সমার্থক শব্দ গুলো</p>
          ${loadSynonyms(word.synonyms)}
        </div>

        <div class="card-actions">
          <form method="dialog">
            <button class="btn btn-primary">Complete Learning</button>
          </form>
        </div>
      </div>
    </div>
        `

    }
loadLessons();
