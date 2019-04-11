let correctAnswer,
    correctNumber = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
    incorrectNumber = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    eventListeners();
});

eventListeners = () => {
    document.getElementById('check-answer').onclick = validateAnswer;

    document.getElementById('clear-storage').onclick = clearResults;
}

// Loads a new question from an API
loadQuestion = () => {
    const url = 'https://opentdb.com/api.php?amount=1&category=18';

    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results));
}

// Display the questions HTML from API
displayQuestion = questions => {
    // Create the html question
    const questionHTML = document.createElement('div');
    questionHTML.classList.add('col-12');

    questions.forEach(question => {

        // Read the correct answer
        correctAnswer = question.correct_answer;

        // Inject the correct answer in the possible answers
        let possibleAnswers = question.incorrect_answers;
        possibleAnswers.splice( Math.floor( Math.random() * 3 ), 0, correctAnswer );

        // Add the HTML for the Current Question
        questionHTML.innerHTML = `
            <div class="row justify-content-between heading">
                <p class="category">Category: ${question.category}</p>
                <div class="totals">
                    <span class="badge badge-success">${correctNumber}</span>
                    <span class="badge badge-danger">${incorrectNumber}</span>
                </div>
            </div>
            <h2 class="text-center">${question.question}</h2>
        `;

        // Generate the HTML for possible answers
        const answerList = document.createElement('ul');
        answerList.classList.add('questions', 'row', 'justify-content-around', 'mt-4');
        possibleAnswers.forEach(answer => {
            const answerHTML = document.createElement('li');
            answerHTML.classList.add('col-12', 'col-md-5');
            answerHTML.textContent = answer;

            // Attach an event click the answer is clicked
            answerHTML.onclick = selectAnswer;

            answerList.appendChild(answerHTML);
        });

        questionHTML.appendChild(answerList);

        // Render in the html
        document.querySelector('#app').appendChild(questionHTML)
    });
    
}

// When the answer is selected
selectAnswer = e => {
    

    // Remove the previous active class for the answer
    if(document.querySelector('.questions .active')) {
        const activeAnswer = document.querySelector('.questions .active');
        activeAnswer.classList.remove('active');
    }

    // Adds the current answer
    e.target.classList.add('active')
}

// Checks if the answer is correct and 1 answer is selected
validateAnswer = () => {
    if(document.querySelector('.questions .active')) {
        // everything is fine, check if the answer is correct or not
        checkAnswer()
    } else {
        // error, the user didn't select anything
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
        errorDiv.textContent = 'Please select 1 answer';

        // Select the questions div to insert the alert
        const questionDiv = document.querySelector('.questions');
        questionDiv.appendChild(errorDiv);

        // Remove the error
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000)
    }
}

// Check if the answer is correct or not
checkAnswer = () => {
    const userAnswer = document.querySelector('.questions .active');
    
    if(userAnswer.textContent === correctAnswer) {
        correctNumber++
    } else {
        incorrectNumber++
    }
    // Sve into localstorage
    saveIntoStorage();

    // Clear previous HTML
    const app = document.getElementById('app');
    while(app.firstChild) {
        app.removeChild(app.firstChild)
    }

    // Load a new question
    loadQuestion()
}

// Sves correct or incorrect total into storage
saveIntoStorage = () => {
    localStorage.setItem('quiz_game_correct', correctNumber);
    localStorage.setItem('quiz_game_incorrect', incorrectNumber);
}

// Clears the results from storage
clearResults = () => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 500)
}