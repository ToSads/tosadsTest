
let data;
let catagoriesDiv = document.querySelector('.catagories')
async function fetchAndApplyData() {
    const url = "https://tosadsapiglobal-production.up.railway.app/exams";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      data = await response.json();
      console.log(data);
      document.querySelector('.loading-screen').style = 'display:none;'
    } catch (error) {
      console.error(error.message);
    }
    putHTML()
}
function putHTML() {
    catagoriesDiv.innerHTML = `
        <div onclick="catagoryClicked('Biology')" class="biologyDiv catagoryDiv">Biology - الاحياء</div>
        <div onclick="catagoryClicked('Physics')" class="physicsDiv catagoryDiv">Physics - الفيزياء</div>
        <div onclick="catagoryClicked('Chemistry')" class="chemistryDiv catagoryDiv">Chemistry - الكيمياء</div>
        <div onclick="catagoryClicked('English')" class="englishDiv catagoryDiv">English - اللغة الانجليزية</div>
        <div onclick="catagoryClicked('French')" class="frenchDiv catagoryDiv">French  - اللغة الفرنسية</div>
        <div onclick="catagoryClicked('Islamic')" class="islamicDiv catagoryDiv">التربية الاسلامية</div>
        <div onclick="catagoryClicked('Literature')" class="literatureDiv catagoryDiv">ادب</div>
        <div onclick="catagoryClicked('Grammar')" class="grammarDiv catagoryDiv">قواعد اللغة العربية</div>
    `
}
fetchAndApplyData()

function catagoryClicked(subject) {
    if (subject == 'Biology' || subject == 'Physics' || subject == 'Chemistry') {
        showLanguages(subject)
    } else {
        showGroups(subject)
    }
}

function showLanguages(subject) {
    catagoriesDiv.innerHTML = `
        <button onclick="putHTML()">الرجوع</button>
        <div onclick="showGroups('${subject}', 'English')" class="catagoryDiv">منهج انجليزي</div>
        <div onclick="showGroups('${subject}', 'Arabic')" class="catagoryDiv">منهج عربي</div>
    `
}

function showGroups(subject, language) {
    if (language) {
        catagoriesDiv.innerHTML = `
            <button onclick="putHTML()">الرجوع</button>
            <div onclick="showExams('${subject}', '2025','${language}')" class="catagoryDiv">دفعة 2025</div>
            <div onclick="showExams('${subject}', '2024','${language}')" class="catagoryDiv">دفعة 2024</div>
        `
    } else {
        catagoriesDiv.innerHTML = `
            <button onclick="putHTML()">الرجوع</button>
            <div onclick="showExams('${subject}', '2025')" class="catagoryDiv">دفعة 2025</div>
            <div onclick="showExams('${subject}', '2024')" class="catagoryDiv">دفعة 2024</div>
        `
    }
    
}

function showExams(subject, group, language) {
    let filterdExams = data.filter(exam => {
        if (subject == 'Biology' || subject == 'Physics' || subject == 'Chemistry') {
            return (exam['catagory'] == subject && exam['language'] == language && exam['group'].indexOf(group) != -1)
        } else {
            console.log(subject + group)
            return (exam['catagory'] == subject && exam['group'].indexOf(group) != -1)
        }
    })
    console.log(filterdExams)
    catagoriesDiv.innerHTML = '<button onclick="putHTML()">الرجوع</button>'
    if (filterdExams.length > 0) {
        for (let i in filterdExams) {
            catagoriesDiv.innerHTML += `
                <div onclick="examClick('${filterdExams[i]['_id']}')" class="catagoryDiv">${filterdExams[i]['name']} | الوقت بالدقائق: ${filterdExams[i]['timeInMinutes']}</div>
            `

        }
    } else {
        catagoriesDiv.innerHTML = `
        <button onclick="putHTML()">الرجوع</button>
        <p>لايوجد اختبارات</p>
        `
    }
}

function examClick(examId) {
    console.log(data)
    let exam = data.filter(id => id['_id'] == examId)
    if (exam.length > 1) {
        console.error('error: more than exam with this id')
    } else {
        let url = new URL(window.location.href);
        url.pathname = 'tosadsTest/examPage.html';
        url.searchParams.set('_id', examId);
        let newUrl = url.toString();
        window.location.href = newUrl;
    }
}
