/* HaidarKhalid website for "ToSads" Team, All rights reserved © */

/* reload when error var */
if (!localStorage.getItem('reload') || localStorage.getItem('reload') >= 5) {
    localStorage.setItem('reload',0)
}

////// fetch the exam needed and show 
let json;
let data;
async function fetchData() {
    const url = "https://tosadsapiglobal-production.up.railway.app/exams";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      data = await response.json();
      console.log(data);
      data.forEach(exam=>{
        if (exam['_id'] == window.location.search.split('=')[1]) json = exam;
      })
      if (json) {
        document.querySelector('.loading-screen').style = 'display:none;'
        localStorage.setItem('reload',0)
        console.log('hi')
        applyData()
        getPens()
        return
      } else {
        let url = new URL(window.location.href);
        url.pathname = 'tosadsTest';
        url.searchParams.delete('_id');
        let newUrl = url.toString();
        window.location.href = newUrl;
      }
    } catch (error) {
        localStorage.setItem('reload', Number(localStorage.getItem('reload')) + 1)
        if (localStorage.getItem('reload') < 5) {
          console.error(error.message);
          location.reload()
        }  else {
          let url = new URL(window.location.href);
          url.pathname = 'tosadsTest/error.html';
          let newUrl = url.toString();
          window.location.href = newUrl;
        }
}}
fetchData()
let mcqForm = document.querySelector('.firstMCQF')
async function applyData() {

    let questionsHTML = `<h1 class="examName">اسم الاختبار <br> "${json['name']}"</h1><h3 dir="rtl" style="margin-top: 10px;" class="examName">إبدأ !</h3>`;
    console.log(json)
            Object.keys(json['questions']).forEach(element=> {
                let theQuestion = json['questions'][element]
                questionsHTML += `
                    <div class="firstMCQQ${element} MCQQ">
                    <h3 class="question-text">${theQuestion['question']}</h3>
                    <div class="answers">    
                `
                for (let h in theQuestion['answers']) {
                    if (theQuestion['answers'].length % 2 == 1) {
                        if (h == theQuestion['answers'].length -1) {
                            questionsHTML+= `
                            <div onclick="checkBoxToggle(this)" style="grid-column: 1 / 3;" class="answer answer${h} answer${theQuestion['answers'][h]['value'] ? "C" : "W"} answerHover">
                                <p>${theQuestion["answers"][h]['text']}</p>
                            </div>
                            `
                            break;
                        }
                    }
                    questionsHTML+= `
                        <div onclick="checkBoxToggle(this)" class="answer answer${h} answer${theQuestion['answers'][h]['value'] ? "C" : "W"} answerHover">
                            <p>${theQuestion["answers"][h]['text']}</p>
                        </div>
                        `
                        // <input type="checkbox" onchange="checkBoxToggle(this)" class="answerCheckBox">

                }
                questionsHTML+= `
                    </div>
                    </div>
                    `


            })
            startCountdown(json['timeInMinutes']);

        

    mcqForm.innerHTML = questionsHTML + '<button class="checkBtn" onclick="checkAnswers()">معرفة النتيجة</button>'
    
}


///// Exam time
function startCountdown(minutes) {
    let seconds = minutes * 60;
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(() => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        
        // Format minutes and seconds with leading zeros if needed
        const formattedMin = min < 10 ? '0' + min : min;
        const formattedSec = sec < 10 ? '0' + sec : sec;

        countdownElement.innerHTML = `${formattedMin}<span class="seperator"><p>.</p><p>.</p></span>${formattedSec}`;

        if (seconds > 0) {
            seconds--;
        } else {
            clearInterval(interval);
            countdownElement.textContent = "انتهى الوقت";
            setTimeout(() => checkAnswers(), 5000);
        }
    }, 1000);
}


// Start the countdown with X minutes
// startCountdown(5);


// it will contain every answer for the student like this {"question number": "number":"answer number", "isTture":"boolean"}
let answers = {}

function checkBoxToggle(checkb) {
    // we will need that many times to see what answer the student choose 
    let answerCheckd = checkb.className.split(' ')
    console.log(answerCheckd)
    // know which qustion the user answered 
    let questionNumber = String(checkb.parentElement.parentElement.className.split(" ")[0][9])
    let questionChoosenElement = document.querySelector(`.firstMCQQ${questionNumber}`)
    
    /// see how many answers are in the question
    let checkBoxesAvailable = questionChoosenElement.children[1].children


    Object.keys(checkBoxesAvailable).forEach(element => {
        if (element == answerCheckd[1][6] && checkBoxesAvailable[element].className.split(' ').indexOf('checked') >= 0) {
            return checkBoxesAvailable[element].classList.remove('checked')
        }
        if (element == answerCheckd[1][6] && checkBoxesAvailable[element].className.split(' ').indexOf('checked') != 0) {
            
            return checkBoxesAvailable[element].classList.add('checked')

        } 
        if (element != answerCheckd[1][6] && checkBoxesAvailable[element].className.split(' ').indexOf('checked') >= 0) {
            return checkBoxesAvailable[element].classList.remove('checked')

        }
});

    console.log(questionChoosenElement)
    // declaring the answer in the answers object
    if (checkb.className.split(' ').indexOf('checked') == -1) {
        questionChoosenElement.style = "box-shadow: 0 0 7px 1px white;"
        delete answers[questionNumber]
    } else {
        answers[questionNumber] = {
            "number": answerCheckd[1][6],
            "isTrue": (answerCheckd[2][6] == 'W' ? false : true)            
        }
        questionChoosenElement.style = "box-shadow: 0 0 7px 1px #57abb5;"

    }
    // uncheck the other answers
/*     Object.keys(checkBoxesAvailable).forEach(element => {
        if (element != answerCheckd[1][6]) {
            if (checkBoxesAvailable[element].className.split(' ').indexOf('checked') >= 0) {
                checkBoxesAvailable[element].classList.remove('checked')
            }
        }
    }); */
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

            let wrongAnswerChoosenElement = document.querySelector(`.firstMCQQ${answer}`).children[1].children[answers[answer].number].children[0]
            let wrongAnswerChoosen = wrongAnswerChoosenElement.textContent.trim()
            
            let wrongAnswerCorrect;
            let cAN; 
            let allAnswers = document.querySelector(`.firstMCQQ${answer}`).children[1].children  /// all answers for that question
            
            Object.keys(allAnswers).forEach(element =>{
                if (allAnswers[element].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                    let correctAnswerNumber = allAnswers[element].className.split(' ')[1][6] // get number of it 
                    let correctAnswerElement = document.querySelector(`.firstMCQQ${answer} .answer${correctAnswerNumber}`) // get the element from the html
                    wrongAnswerCorrect = (correctAnswerElement.textContent.trim()) // put only the text
                    cAN = correctAnswerNumber
                }
            })

           

            /// save the info for that question
            answersResult.wrongAnswers[answer] = {"question":wrongAnswerQuestion, "youChoose": wrongAnswerChoosen, "correctAnswer": wrongAnswerCorrect, jsonInfo: {
                "questionNumber": answer,
                "correctAnswerNumber": cAN,
                "youChooseNumber": answers[answer].number
            }}
            console.log(answersResult)
        }
    })  
         
    /// see the questions didnt answer on it
    let mcqForm = Object.keys(document.querySelector('.firstMCQF').children)
    mcqForm.pop()
    mcqForm.pop()
    mcqForm.shift()
    mcqForm.forEach(element=>{
       if ((Object.keys(answers).indexOf(element)) == -1) {
        // console.log((Object.keys(answers).indexOf(element)))
        answersResult.didntAnswerCount++
        let theQuestion = document.querySelector(`.firstMCQQ${element}`)


        let theQuestionText = theQuestion.children[0].textContent;
        let theQuestionAnswer;
        let cAN;
        let allAnswers = theQuestion.children[1].children  /// all answers for that question
        Object.keys(allAnswers).forEach((singleAnswer) =>{
            if (allAnswers[singleAnswer].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                let correctAnswerNumber = allAnswers[singleAnswer].className.split(' ')[1][6] // get number of it 
                let correctAnswerElement = document.querySelector(`.firstMCQQ${element} .answer${correctAnswerNumber}`)
                theQuestionAnswer = (correctAnswerElement.textContent.trim()) // put only the text
                cAN = correctAnswerNumber;
            }

            /* 
            if (allAnswers[element].className.split(' ').indexOf('answerC') != -1) { // get the correct answers
                    let correctAnswerNumber = allAnswers[element].className.split(' ')[1][6] // get number of it 
                    let correctAnswerElement = document.querySelector(`.firstMCQQ${answer} .answer${correctAnswerNumber}`) // get the element from the html
                    wrongAnswerCorrect = (correctAnswerElement.textContent.trim()) // put only the text
                } */
        })
        answersResult.didntAnswer[element] = {"question":theQuestionText, "correctAnswer": theQuestionAnswer, jsonInfo: {
            "questionNumber": element,
            "correctAnswerNumber": cAN}}}

       }
    )

    console.log(answersResult)
    /* ,"catagory":json['catagory'],"_id":json['_id'] */
    localStorage.setItem('result', JSON.stringify({answersResult, json}))

    parent.location.pathname = "tosadsTest/result.html"
}




function getPens() {
    const allElements = document.querySelectorAll('*');
    let height = 0;
  
    allElements.forEach((element) => {
      height = Math.max(height, element.offsetTop + element.offsetHeight);
    });
  
    const width = (document.body.offsetWidth)
    let times = Math.floor(Math.random() * 30)
    if (times < 20) {
        times = 20 
    }
    for (let i = 0; i <= times; i++) {

        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        const rotate = Math.floor(Math.random() * 70)
        const randomChoose = Math.floor(Math.random() * 4) 
        if (randomChoose == 0) {
            document.querySelector('.pens').innerHTML += `
            <img style="top:${y}px; left: ${x}px; rotate: ${rotate}deg;" class="pen" src="media/images/icons/pen.png">
            `
        }  else if (randomChoose == 1) {
            document.querySelector('.pens').innerHTML += `
            <iconify-icon class="pen" icon="maki:doctor" width="25" height="25"  style="top:${y}px; left: ${x}px; rotate: ${rotate}deg;"></iconify-icon>
            `
        } else if (randomChoose == 2) {
            document.querySelector('.pens').innerHTML += `
            <iconify-icon class="pen" icon="codicon:law" width="25" height="25"  style="top:${y}px; left: ${x}px; rotate: ${rotate}deg;"></iconify-icon>
            `
        } else if (randomChoose == 3) {
            document.querySelector('.pens').innerHTML += `
            <iconify-icon class="pen"icon="healthicons:pharmacy" width="25" height="25"  style="top:${y}px; left: ${x}px; rotate: ${rotate}deg;"></iconify-icon>
            `
        } else {
            console.log(randomChoose)
        }
    }
  }
  
  

