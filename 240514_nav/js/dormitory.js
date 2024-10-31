let allData;                //초기 설정에 필요한 모든 데이터: 세탁기, 시간, 호실
let weeklyReservation;      //미리 정해진 요일별 예약 데이터
let newReservation;         //사용자가 새롭게 지금 입력하는 예약 정보. 1페이지에서 초기화하자
let reservations;           //사용자가 예약한 정보들의 덩어리


//selection-item 요소들 가져오자
const selectionItemDivs = document.getElementsByClassName("selection-item");

//네 개의 페이지 요소 가져오자
const calendarDiv = document.getElementById("calendar");
const selectionWashingmachineTimeDiv = document.getElementById("selection-washingmachine-time");
const selectionRoomNameDiv = document.querySelector("#selection-room-name");
const boardDiv = document.querySelector("#board");

const pageDivs = [calendarDiv, selectionWashingmachineTimeDiv, selectionRoomNameDiv, boardDiv];
// console.log(pageDivs);

//초기 데이터 가져오자. allData.json, weekly-reservation.json
const initData = () => {
    const getAllData = () => {
        const url = 'js/allData.json';
        fetch(url)
        .then(response => response.json())
        .then(data => allData = data)
        .catch(error => console.log(error.message));
    }
    const getWeeklyReservation = async () => {
        const url = 'js/weekly-reservation.json';
        try {
            const response = await fetch(url);
            const data = await response.json();
            weeklyReservation = data;
        } catch (error) {
            console.log(error.message);
        }
    }
    
    getAllData();
    getWeeklyReservation();
}

const setPage = (page) => {
    //clear selection
    for (const selectionItemDiv of selectionItemDivs) {
        selectionItemDiv.classList.remove("select-menu");
    }
    
    //selection 칠하자
    if (page != 4) {    //세탁기 예약 현황표는 selection이 없음
        selectionItemDivs[page-1].classList.add("select-menu");
    }


    //clear pageDiv
    pageDivs.forEach(pageDiv => {
        pageDiv.style.display = "none";
    });

    //show pageDiv 1
    pageDivs[page-1].style.display = "block";
}
const clickDate = (event) => {
    //예약정보 초기화하자
    newReservation = {
        "name": undefined,
        "room": undefined,
        "date": undefined,
        "time": undefined,
        "washingmachine": undefined,
        "notification": true
    };

    //날짜 data 가져오자
    const dateString = event.target.dataset.date;
    const dateDate = new Date(dateString);
    //날짜 data 보관하자
    newReservation.date = dateDate;
    //2페이지로 가자
    setPage(2);
}

initData();
setPage(1);