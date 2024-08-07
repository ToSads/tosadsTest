
let data;
let catagoriesDiv = document.querySelector('.catagories')
if (!localStorage.getItem('reload') || localStorage.getItem('reload') >= 5) {
    localStorage.setItem('reload',0)
}


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
      localStorage.setItem('reload',0)
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

    }
    putHTML()
}
function putHTML() {
    catagoriesDiv.innerHTML = `
        <div onclick="catagoryClicked('Biology')" class="biologyDiv catagoryDiv">
        <iconify-icon icon="material-symbols-light:microbiology" width="65" height="65"  style="color: white"></iconify-icon>
        <p>الاحياء</p>
        </div>

        <div onclick="catagoryClicked('Physics')" class="physicsDiv catagoryDiv">
        <iconify-icon icon="hugeicons:physics" width="65" height="65"  style="color: white"></iconify-icon>
        <p>الفيزياء</p>
        </div>

        <div onclick="catagoryClicked('Chemistry')" class="chemistryDiv catagoryDiv">
        <iconify-icon icon="healthicons:biochemistry-laboratory" width="65" height="65"  style="color: white"></iconify-icon>
        <p>الكيمياء</p>
        </div>

        <div onclick="catagoryClicked('English')" class="englishDiv catagoryDiv">
        <iconify-icon icon="icon-park-solid:english" width="65" height="65"  style="color: white"></iconify-icon>
        <p>اللغة الانجليزية</p>
        </div>

        <div onclick="catagoryClicked('French')" class="frenchDiv catagoryDiv">
        <iconify-icon icon="mdi:france" width="65" height="65"  style="color: white"></iconify-icon>
        <p>اللغة الفرنسية</p>
        </div>

        <div onclick="catagoryClicked('Islamic')" class="islamicDiv catagoryDiv">
        <iconify-icon icon="mdi:religion-islamic" width="65" height="65"  style="color: white"></iconify-icon>
        <p>التربية الاسلامية</p>
        </div>

        <div onclick="catagoryClicked('Literature')" class="literatureDiv catagoryDiv">
        <iconify-icon icon="game-icons:archive-research" width="65" height="65"  style="color: white"></iconify-icon>
        <p>ادب</p>
        </div>

        <div onclick="catagoryClicked('Grammar')" class="grammarDiv catagoryDiv">
        <iconify-icon icon="fluent:text-grammar-checkmark-24-regular" width="65" height="65"  style="color: white"></iconify-icon>
        <p>قواعد اللغة العربية</p>
        </div>

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
        <button class="homeBtn" onclick="putHTML()">
        <iconify-icon icon="mdi:home" width="34" height="34"  style="color: white"></iconify-icon>
        </button>
        <div onclick="showGroups('${subject}', 'English')" class="catagoryDiv">منهج انجليزي</div>
        
        <div onclick="showGroups('${subject}', 'Arabic')" class="catagoryDiv">منهج عربي</div>
    `
}

function showGroups(subject, language) {
    if (language) {
        catagoriesDiv.innerHTML = `
            <button class="homeBtn" onclick="putHTML()">
            <iconify-icon icon="mdi:home" width="34" height="34"  style="color: white"></iconify-icon>
            </button>
            <div onclick="showExams('${subject}', '2025','${language}')" class="catagoryDiv">دفعة 2025</div>
            <div onclick="showExams('${subject}', '2024','${language}')" class="catagoryDiv">دفعة 2024</div>
        `
    } else {
        catagoriesDiv.innerHTML = `
            <button class="homeBtn" onclick="putHTML()">
            <iconify-icon icon="mdi:home" width="34" height="34"  style="color: white"></iconify-icon>
            </button>
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
    catagoriesDiv.innerHTML = `<button class="homeBtn" onclick="putHTML()">
    <iconify-icon icon="mdi:home" width="34" height="34"  style="color: white"></iconify-icon>
    </button>`
    if (filterdExams.length > 0) {
        for (let i in filterdExams) {
            catagoriesDiv.innerHTML += `
                <div onclick="examClick('${filterdExams[i]['_id']}')" class="examDiv">
                    <p>
                        <iconify-icon icon="mdi:rename" width="25" height="25"  style="color: white"></iconify-icon>

                        ${filterdExams[i]['name']} 
                        </p>
                    <p>
                        <iconify-icon icon="carbon:time-filled" width="25" height="25"  style="color: white"></iconify-icon>

                        ${filterdExams[i]['timeInMinutes']} دقيقة 
                    </p>
                 </div>
            `

        }
    } else {
        catagoriesDiv.innerHTML = `
        <button class="homeBtn" onclick="putHTML()">
        <iconify-icon icon="mdi:home" width="34" height="34"  style="color: white"></iconify-icon>
        </button>
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
