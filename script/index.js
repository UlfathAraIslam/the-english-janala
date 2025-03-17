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
                    <button class="p-2 bg-slate-200 text-white        rounded">
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
loadLessons();
// loadWords();
