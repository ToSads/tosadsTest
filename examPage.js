/* HaidarKhalid website for "ToSads" Team, All rights reserved © */

////// fetch the exam needed and show 
let json;
let mcqForm = document.querySelector('.firstMCQF')
async function fetchAndApplyData() {
    let json = JSON.parse(localStorage.getItem('exam'))

    let questionsHTML = `<h1>${json["exams"]['name']}</h1>`;
    console.log(json)
            Object.keys(json['exams']['questions']).forEach(element=> {
                let theQuestion = json['exams']['questions'][element]
                questionsHTML += `
                    <div class="firstMCQQ${element} MCQQ">
                    <h3>${theQuestion['question']}</h3>
                    <div class="answers">    
                `
                for (let h in theQuestion['answers']) {
                    questionsHTML+= `
                        <div class="answer answer${h} answer${theQuestion['answers'][h]['value'] ? "C" : "W"}">
                            <input type="checkbox" onchange="checkBoxToggle(this)" class="answerCheckBox">
                            <p>${theQuestion["answers"][h]['text']}</p>
                        </div>
                        `
                }
                questionsHTML+= `
                    </div>
                    </div>
                    `


            })
            startCountdown(json['exams']['timeInMinutes']);

        

    mcqForm.innerHTML = questionsHTML + '<button class="checkBtn" onclick="checkAnswers()">معرفة النتيجة</button>'
    
}
fetchAndApplyData()


///// Exam time
function startCountdown(minutes) {
    let seconds = minutes * 60;
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(() => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        
        countdownElement.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;

        if (seconds > 0) {
            seconds--;
        } else {
            clearInterval(interval);
            countdownElement.textContent = "Time's up!, cheking results in 5 seconds...";
            setTimeout(()=>checkAnswers(),5000)
        }
    }, 1000);
}

// Start the countdown with X minutes
// startCountdown(5);


// it will contain every answer for the student like this {"question number": "number":"answer number", "isTture":"boolean"}
let answers = {}

function checkBoxToggle(checkb) {
    // we will need that many times to see what answer the student choose 
    let answerCheckd = checkb.parentElement.className.split(' ')
    // know which qustion the user answered 
    let questionNumber = String(checkb.parentElement.parentElement.parentElement.className.split(" ")[0][9])
    let questionChoosenElement = document.querySelector(`.firstMCQQ${questionNumber}`)
    
    // declaring the answer in the answers object
    if (!checkb.checked) {
        delete answers[questionNumber]
    } else {
        answers[questionNumber] = {
            "number": answerCheckd[1][6],
            "isTrue": (answerCheckd[2][6] == 'W' ? false : true)
        }
    }

    /// see how many answers are in the question
    let checkBoxesAvailable = questionChoosenElement.children[1].children

    // uncheck the other answers
    Object.keys(checkBoxesAvailable).forEach(element => {
        if (element != answerCheckd[1][6]) {
            checkBoxesAvailable[element].children[0].checked = false
        }
    });
    console.log(answers)
}

async function checkAnswers() {
    let answersResult = {'wrongCount': 0,'correctCount': 0, "wrongAnswers": {}, "didntAnswer":{}, "didntAnswerCount":0}
    Object.keys(answers).forEach(answer =>{
        if (answers[answer].isTrue) {
            answersResult.correctCount++
        } else { // if answer is wrong for that qeustion Number(answer)

            answersResult.wrongCount++ 

            let wrongAnswerQuestion = document.querySelector(`.firstMCQQ${answer}`).children[0].textContent.trim()

            let wrongAnswerChoosen = document.querySelector(`.firstMCQQ${answer}`).children[1].children[answers[answer].number].children[1].textContent.trim()

            let wrongAnswerCorrect;

            let allAnswers = document.querySelector(`.firstMCQQ${answer}`).children[1].children  /// all answers for that question
            
            Object.keys(allAnswers).forEach(element =>{
                if (allAnswers[element].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                    let correctAnswerNumber = allAnswers[element].className.split(' ')[1][6] // get number of it 
                    let correctAnswerElement = document.querySelector(`.firstMCQQ${answer} .answer${correctAnswerNumber}`) // get the element from the html
                    wrongAnswerCorrect = (correctAnswerElement.textContent.trim()) // put only the text
                }
            })

           

            /// save the info for that question
            answersResult.wrongAnswers[answer] = {"question":wrongAnswerQuestion, "youChoose": wrongAnswerChoosen, "correctAnswer": wrongAnswerCorrect}
        }
    })  
         
    /// see the questions didnt answer on it
    let mcqForm = Object.keys(document.querySelector('.firstMCQF').children)
    console.log(mcqForm)
    mcqForm.pop()
    mcqForm.shift()
    mcqForm.forEach(element=>{
        console.log(mcqForm, element)
       if ((Object.keys(answers).indexOf(element)) == -1) {
        console.log((Object.keys(answers).indexOf(element)))
        answersResult.didntAnswerCount++
        let theQuestion = document.querySelector(`.firstMCQQ${element}`)
        console.log(element)
        console.log(theQuestion)
        let theQuestionText = theQuestion.children[0].textContent;
        
        let theQuestionAnswer;
        let allAnswers = theQuestion.children[1].children  /// all answers for that question
        Object.keys(allAnswers).forEach((singleAnswer) =>{
            if (allAnswers[singleAnswer].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                let correctAnswerNumber = allAnswers[singleAnswer].className.split(' ')[1][6] // get number of it 
                let correctAnswerElement = document.querySelector(`.firstMCQQ${element} .answer${correctAnswerNumber}`)
                theQuestionAnswer = (correctAnswerElement.textContent.trim()) // put only the text
            }

            /* 
            if (allAnswers[element].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                    let correctAnswerNumber = allAnswers[element].className.split(' ')[1][6] // get number of it 
                    let correctAnswerElement = document.querySelector(`.firstMCQQ${answer} .answer${correctAnswerNumber}`) // get the element from the html
                    wrongAnswerCorrect = (correctAnswerElement.textContent.trim()) // put only the text
                } */
        })
        answersResult.didntAnswer[element] = {"question":theQuestionText, "correctAnswer": theQuestionAnswer}

       }
    })

    console.log(answersResult)
    localStorage.setItem('result', JSON.stringify({"testInfo":{"name":"testing","catagory":"Biology","id":"1"},answersResult}))

    parent.location.pathname = "/tosadsTest/result.html"
}
