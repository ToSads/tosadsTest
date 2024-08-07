let {answersResult, json} = JSON.parse(localStorage.getItem('result'))
    
console.log(answersResult)
console.log(json)
let precentigResult;

// document.querySelector('.exam-name').innerHTML = ``

precentigResult = Math.floor((answersResult["correctCount"] / (answersResult["correctCount"] + answersResult["wrongCount"] + answersResult["didntAnswerCount"])) * 100)

let testResult = document.querySelector('.testResult')
let resultParagraph = `
    <h1 class="examName" style="margin: 10px auto; font-size:1.8rem;">نتيجة الاختبار <br> "${json['name']}"</h1>
    <p dir="rtl">درجتك المئوية: <span style="color: ${precentigResult < 50 ? 'red': 'green'};">${precentigResult}%</span></p>
    <div class="countContainer">
        <div><p>عدد الإجابات  <span style="color:green;">الصحيحة</span></p> <p>${answersResult["correctCount"]} </p></div>
        <div><a href="#wrongAnswersList">عدد الإجابات  <span style="color:red; text-decoration:underline;">الخاطئة</span></a> <p>${answersResult["wrongCount"]} </p></div>
        <div><a href="#didntAnswerList">عدد الاسئلة  <span style="color:orange; text-decoration:underline;">المتروكة</span></a> <p>${answersResult["didntAnswerCount"]} </p></div>
    </div>
    <hr>
    `
    /* ${precentigResult < 50 ? '<iconify-icon class="happySadIcon" icon="mingcute:sad-fill" width="100" height="100"  style="color: red"></iconify-icon>' : '<iconify-icon class="happySadIcon" icon="rivet-icons:happy-solid" width="100" height="100"  style="color: green"></iconify-icon>'} */ 

testResult.innerHTML = resultParagraph
let uncorrectList = document.querySelector('.uncorrectList')
let wrongParagprah;

if (Object.keys(answersResult['wrongAnswers']).length > 0) {
    uncorrectList.innerHTML += '<h1 class="questionsTypeHeader typeWrong" id="wrongAnswersList">الإجابات <span style="color:red;">الخاطئة</span></h1>'
    applyData('wrongAnswers')
} else {
    uncorrectList.innerHTML += '<h1 class="questionsTypeHeader typeWrong" id="wrongAnswersList">ليس لديك اجوبة <span style="color:red;">خاطئة</span></h1>'
}


if (Object.keys(answersResult['didntAnswer']).length > 0) {
    uncorrectList.innerHTML += '<h1 class="questionsTypeHeader typeWrong" id="didntAnswerList">الاسئلة <span style="color:orange;">المتروكة</span></h1>'
    applyData('didntAnswer')
    getFaces()

} else {
    uncorrectList.innerHTML += '<h1 class="questionsTypeHeader typeWrong" id="didntAnswerList">ليس لديك اسئلة <span style="color:orange;">متروكة</span></h1>'
    getFaces()
}





async function applyData(type) {
    console.log(type)
    let useData = answersResult[type]
    let questionsHTML = ``
    console.log(useData)
            Object.keys(useData).forEach(element=> {
                let theQuestion = json['questions'][element]
                console.log(theQuestion)
                questionsHTML += `
                    <div class="firstMCQQ${element} MCQQ  ${type}">
                    <h3 class="question-text">${theQuestion['question']}</h3>
                    <div class="answers">    
                `
                for (let h in theQuestion['answers']) {
                    if (theQuestion['answers'].length % 2 == 1) {
                        if (h == theQuestion['answers'].length -1) {
                            questionsHTML+= `
                            <div style="grid-column: 1 / 3;" class="answer answer${h} answer${theQuestion['answers'][h]['value'] ? "C" : "W"}">
                                <p>${theQuestion["answers"][h]['text']}</p>
                            </div>
                            `
                            break;
                        }
                    }
                    questionsHTML+= `
                        <div class="answer answer${h} answer${theQuestion['answers'][h]['value'] ? "C" : "W"}">
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


            uncorrectList.innerHTML += questionsHTML
            if (type == 'didntAnswer') {

                Object.keys(useData).forEach(element => {
                    let thisQuestion = document.querySelector(`.firstMCQQ${useData[element]['jsonInfo']['questionNumber']}`)
                    thisQuestion.children[1].children[Number(useData[element]['jsonInfo']["correctAnswerNumber"])].classList.add('correctAnswer')
                })
            } else if (type == 'wrongAnswers') {

                Object.keys(useData).forEach(element => {
                    let thisQuestion = document.querySelector(`.firstMCQQ${useData[element]['jsonInfo']['questionNumber']}`)
                    thisQuestion.children[1].children[Number(useData[element]['jsonInfo']["correctAnswerNumber"])].classList.add('correctAnswer')
                    thisQuestion.children[1].children[Number(useData[element]['jsonInfo']["youChooseNumber"])].classList.add('wrongAnswer')
                })
            }
    
}




function getFaces() {
    const allElements = document.querySelectorAll('*');
    let height = 0;
  
    allElements.forEach((element) => {
      height = Math.max(height, element.offsetTop + element.offsetHeight);
    });
  
    const width = (document.body.offsetWidth)
    
    for (let i = 0; i <= 13; i++) {

        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        const rotate = Math.floor(Math.random() * 360)
        if (precentigResult >= 50) {
            document.querySelector('.pens').innerHTML += `<iconify-icon class="pen happySadIcon" style="top:${y}px; left: ${x}px; rotate: ${rotate}deg; color: green; opacity:0.16;" icon="rivet-icons:happy-solid" width="40" height="40"></iconify-icon>`
        } else if (precentigResult < 50) {
            document.querySelector('.pens').innerHTML += `<iconify-icon class="pen happySadIcon" style="top:${y}px; left: ${x}px; rotate: ${rotate}deg; color: red; opacity:0.16;" icon="mingcute:sad-fill" width="40" height="40"></iconify-icon>`
        }
        
    }
  }
  
  
