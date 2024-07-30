let {testInfo, answersResult} = JSON.parse(localStorage.getItem('result'))
    
console.log(testInfo)
console.log(answersResult)

document.querySelector('.exam-name').innerHTML = `اسم الاختبار: ${testInfo['name']}`

let precentigResult = Math.floor((answersResult["correctCount"] / (answersResult["correctCount"] + answersResult["wrongCount"] + answersResult["didntAnswerCount"])) * 100)

let testResult = document.querySelector('.testResult')
let resultParagraph = `
    <p>عدد الإجابات الصحيحة: ${answersResult["correctCount"]} </p>
    <p>عدد الإجابات الخاطئة: ${answersResult["wrongCount"]} </p>
    <p>عدد الاسئلة المتروكة: ${answersResult["didntAnswerCount"]} </p>
    <p dir="rtl">درجتك المئوية في الاختبار هي: ${precentigResult}%</p>
`

testResult.innerHTML = resultParagraph
let uncorrectList = document.querySelector('.uncorrectList')
let wrongParagprah;

if (Object.keys(answersResult['wrongAnswers']).length > 0) {
    wrongParagprah = 'الإجابات الخاطئة'
    uncorrectList.innerHTML += `<h3>${wrongParagprah}</h3>`
    Object.keys(answersResult['wrongAnswers']).forEach(answer =>{
        wrongParagprah= `
        <p>السؤال ${answer}: ${answersResult["wrongAnswers"][answer]['question']} </p>
        <p>قمت بإختيار: ${answersResult["wrongAnswers"][answer]['youChoose']} </p>
        <p>الجواب الصحيح: ${answersResult["wrongAnswers"][answer]['correctAnswer']} </p>
        `
        uncorrectList.innerHTML += `<li>${wrongParagprah.trim()}</li>`
    })
}


if (Object.keys(answersResult['didntAnswer']).length > 0) {
    wrongParagprah = 'الاسئلة المتروكة'
    uncorrectList.innerHTML += `<h3>${wrongParagprah}</h3>`
    Object.keys(answersResult['didntAnswer']).forEach(answer =>{
        wrongParagprah= `
        <p>السؤال ${answer}: ${answersResult["didntAnswer"][answer]['question']} </p>
        <p>الجواب الصحيح: ${answersResult["didntAnswer"][answer]['correctAnswer']} </p>
        `
        uncorrectList.innerHTML += `<li>${wrongParagprah.trim()}</li>`
    })
}