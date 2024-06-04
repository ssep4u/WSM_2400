// 현재 날짜를 저장하는 변수 선언
let currentDate = new Date();

// 날짜, 요일을 화면에 표시하는 함수
const displayDate = () => {
    // 요일을 나타내는 문자열을 선언
    let days = "일월화수목금토";
    // 현재 월 가져오기 (month는 0부터 시작이라, +1을 해줘야 함)
    let month = currentDate.getMonth() + 1;
    // 현재 날짜 가져오기
    let date = currentDate.getDate();
    // 현재 요일 가져오기 (0: 일요일, 1: 월요일)
    let day = currentDate.getDay();
    // days = days.split("");  // 일월화수목금토 -> ['일', '월', '화', ...]
    // 제목 텍스트를 변경
    const schoolFoodTitleHeader = document.getElementsByClassName("school-food-title")[0];
    const titleText = `🍚 ${days.charAt(day)}요일(${month}/${date})의 메뉴 🍚`
    schoolFoodTitleHeader.innerText = titleText;
}


// displayDate();

//학교 급식 API 이용해서 급식 정보 가져오자
const API_KEY = "e323d599705a47c2ad3a8a579bc7b2ac";
const URL = "https://open.neis.go.kr/hub/mealServiceDietInfo";
const ATPT_OFCDC_SC_CODE = "B10";   //서울특별시교육청
const SD_SCHUL_CODE = "7011569";
const TYPE = "json";

const getSchoolFoodMenu = (dateData) => {
    let api_url = `${URL}?\
KEY=${API_KEY}\
&Type=${TYPE}\
&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}\
&SD_SCHUL_CODE=${SD_SCHUL_CODE}\
&MLSV_YMD=${dateData}`;

    // console.log(api_url);

    //비동기 요청
    //error 없이 응답오면, 데이터 처리
    //error 있으면, 에러 처리

    fetch(api_url)  //api_url에 비동기적으로 요청
        .then((response) => response.json())
        .then((data) => setSchoolFoodMenu(data))    //학교 급식 정보를 HTML에 표시하자
        .catch((error) => console.error(error));
}

//학교 급식 정보 표시하자
const setSchoolFoodMenu = (data) => {
    // HTML -> js 변수
    const breakfastMenuUl = document.getElementsByClassName("menu breakfast")[0];
    const lunchMenuUl = document.getElementsByClassName("menu lunch")[0];
    const dinnerMenuUl = document.getElementsByClassName("menu dinner")[0];
    //초기화 안하면, 기존 값이 남아있음 ! 주의
    breakfastMenuUl.innerHTML = "<li>급식 정보가 없습니다.</li>";
    lunchMenuUl.innerHTML = "<li>급식 정보가 없습니다.</li>";
    dinnerMenuUl.innerHTML = "<li>급식 정보가 없습니다.</li>";

    // data 적절히 처리: 조식음식들, 중식음식들, 석식음식들
    // 식사들 가져오자

    //급식 정보가 없을 때, data["mealServiceDietInfo"] undefined 로 나온다. 그럼 나가자
    if (data["mealServiceDietInfo"] === undefined) return;
    const menuData = data["mealServiceDietInfo"][1]["row"];
    
    // 하나씩 꺼내자
    menuData.forEach((menuRow) => {
        let menuFood = "";   //음식 하나씩 <li>태그로 깜싼 덩어리
        
        // 음식들 가져오자
        let menu = menuRow["DDISH_NM"];
        //menu: 음식 (1.2.3.)<br/>음식2.(S)<br/>음식3 (J)
        //정규표현식: (...) 찾아서 ""로 대체
        menu = menu.replace(/\([^()]*\)/g, "");
        //정규표현식: . 찾아서 ""로 대체
        menu = menu.replace(/\./g, "");
        //정규표현식: * 찾아서 ""로 대체
        menu = menu.replace(/\*/g, "");

        // 음식들 <br/>태그로 나누자
        menu = menu.split("<br/>");
        // 하나씩 꺼내어 <li class="menu-food">하나의 꺼낸 음식</li>
        menu.forEach((food) => {
            menuFood += `<li class="menu-food">${food}</li>\n`;
        });

        // js 변수 -> HTML 표시
        if (menuRow["MMEAL_SC_NM"] === "조식") {
            breakfastMenuUl.innerHTML = menuFood;
        } else if (menuRow["MMEAL_SC_NM"] === "중식") {
            lunchMenuUl.innerHTML = menuFood;
        } else if (menuRow["MMEAL_SC_NM"] === "석식") {
            dinnerMenuUl.innerHTML = menuFood;
        }
    });
};

// let 변우석 = {
//     'name': '변우석',
//     'age': 34,
//     'height': 189,
//     'filmography': ['선재업고튀어', '20세기 소녀'],
// }
// console.log(변우석.age);
// console.log(변우석["age"]);
// console.log(변우석.filmography);
// console.log(변우석["filmography"]);
// console.log(변우석.filmography[0]);
// console.log(변우석["filmography"][0]);
// console.log(변우석);

// 날짜 변경하고 화면에 표시하는 함수
const changeDate = (diff) => {
    // 현재 날짜에 diff만큼 더하거나 빼기
    currentDate.setDate(currentDate.getDate() + diff);
    // 변경된 날짜를 화면에 표시
    displayDate();

    // YYYYMMDD로 변환하고
    const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    getSchoolFoodMenu(dateData);
}
changeDate(0);  //페이지 열자마자 오늘날짜 구해서 표시하자