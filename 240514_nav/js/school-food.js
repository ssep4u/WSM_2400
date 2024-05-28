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
days = days.split("");  // 일월화수목금토 -> ['일', '월', '화', ...]
// 제목 텍스트를 변경
const schoolFoodTitleHeader = document.getElementsByClassName("school-food-title")[0];
const titleText = `🍚 ${days[day]}요일(${month}/${date})의 메뉴 🍚`
schoolFoodTitleHeader.innerText = titleText;
}

// 날짜 변경하고 화면에 표시하는 함수
const changeDate = (diff) => {
// 현재 날짜에 diff만큼 더하거나 빼기
    currentDate.setDate(currentDate.getDate() + diff);
    // YYYYMMDD로 변환하고
    const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    // 변경된 날짜를 화면에 표시
    displayDate();
}