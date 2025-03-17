function loadLessons(){
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res)=> res.json())
    .then((data)=>{
        displayLessons(data.data);
    })
}
// {id: 101, level_no: 1, lessonName: 'Basic Vocabulary'}
function displayLessons(lessons){
    const lessonContainer = document.getElementById("lesson-container");
    for(let lesson of lessons){
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
        <li class="btn btn-outline btn-primary group">
            <a href="#vocabulary"> <i class="fa-solid fa-book-open text-indigo-800 group-hover:text-white"></i> Lesson-${lesson.level_no}</a>
          </li>
        `
        lessonContainer.append(lessonDiv);
    }
}
loadLessons();