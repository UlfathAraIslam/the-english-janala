const getStartedBtn = document.getElementById("get-started-btn");
const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const banner = document.getElementById("banner");
const navbar = document.getElementById("nav");
const vocabulary = document.getElementById("vocabulary");
const faq = document.getElementById("faq");

// Initially hide sections except banner and footer
navbar.style.display= "none";
vocabulary.style.display = "none";
faq.style.display = "none";

// get started btn

getStartedBtn.addEventListener("click",function(event){
    event.preventDefault();
    const username = nameInput.value.trim();
    const password = passwordInput.value;

    if(!username){
      Swal.fire({
        title: "Error!",
        text: "Please enter your name",
        icon: "warning",
        confirmButtonText: "OK"
    });
        return;
    }
    if(password !== "123456"){
      Swal.fire({
        title: "Oops!",
        text: "Incorrect password!",
        icon: "error",
        confirmButtonText: "Try Again"
    });
        return;
    }
    Swal.fire({
      title: "Welcome!",
      text: "Login successful!",
      icon: "success",
      confirmButtonText: "Continue"
  })
    banner.style.display = "none";
    navbar.style.display = "flex";
    vocabulary.style.display = "block";
    faq.style.display = "block"
})

// logout btn

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click",function(){
navbar.style.display= "none";
vocabulary.style.display = "none";
faq.style.display = "none";
})
// show loader
const showLoader=()=>{
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("words-container").classList.add("hidden");
}
// hide loader
const hideLoader=()=>{
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("words-container").classList.remove("hidden");
}
// remove active class
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
  showLoader();
  wordsContainer.innerHTML = "";
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      displayWords(data.data);
      hideLoader();
    });
}
// pronounce
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}


// display all words
function displayWords(words) {
  const wordsContainer = document.getElementById("words-container");
  wordsContainer.innerHTML = '';
  if(!words || words.length === 0){
    wordsContainer.innerHTML=`
            <div class="col-span-full flex flex-col justify-center items-center space-y-5 bg-stone-100 p-5">
            <img src="./assets/alert-error.png" alt="">
            <p class="text-xs text-stone-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="text-2xl font-medium">নেক্সট Lesson এ যান</p>
          </div>
    `
    hideLoader();
    return;
  }
  words.forEach((word) => {
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
        <div class="card bg-base-100 shadow-sm h-full">
            <div class="card-body">
                <div class='flex flex-col justify-center items-center space-y-2'>
                <h2 class="card-title font-bold text-2xl">${word.word || "অজানা শব্দ"}</h2>
                <p>Meaning /Pronounciation</p>
                <p class='font-semibold text-2xl'>''${word.meaning || "অর্থ নেই"} /${word.pronunciation}''</p></div>
                <div class="flex justify-between">
                    <button  onclick = loadWordDetails('${word.id}') class="p-2 bg-slate-200 text-white    rounded">
                    <i class="fas fa-info-circle text-slate-700"></i>
                    </button>
                    <button onclick="pronounceWord('${word.word}')" class="p-2 bg-slate-200 text-white rounded">
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
  showLoader();
    const url= `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
        const clickedButton = document.getElementById(`btn-${id}`);
        removeActiveClass();
        clickedButton.classList.add("active");
        displayWords(data.data);
        hideLoader();
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
              return `<p>কোনো সমার্থক শব্দ পাওয়া যায়নি।</p>`;
            }
        }        
        wordDetailsContainer.innerHTML=`
        <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold">${word.word || "অজানা শব্দ"}
        <p class="text-xl font-medium"><span class="font-normal text-gray-700">(<i class="fas fa-microphone"></i>:${word.pronunciation || "উচ্চারণ পাওয়া যায়নি" })</span></p>
        </h2>
        <div>
        <p class="font-semibold text-lg">Meaning</p>
        <p class="text-gray-700">${word.meaning || "অর্থ নেই"}</p>
        </div>

        <div class="my-4">
          <p class="font-semibold text-lg">Example</p>
          <p>"${word.sentence || 'কোনো উদাহরণ পাওয়া যায়নি।'}"</p>
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