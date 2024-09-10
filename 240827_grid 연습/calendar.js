//달력

//현재 날짜 구하자
let currentDate = new Date();

const setCalendarHeader = (date) => {
    //연도 구하자
    const year = date.getFullYear();
    //달 구하자
    const month = date.getMonth();  //0: 1월, 1: 2월

    titleString = `${year}년 ${month + 1}월`;
    const calendarHeaderH1 = document.querySelector("#calendar-header h1");
    calendarHeaderH1.innerHTML = titleString;
}
//일 구하자

//첫 날의 요일 구하자
//마지막 날짜 구하자
//마지막 날의 요일 구하자

//이전 달 뒷날짜 구하자

//다음 달 앞날짜 구하자


setCalendarHeader(currentDate);