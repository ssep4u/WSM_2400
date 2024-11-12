let allData;                //초기 설정에 필요한 모든 데이터: 세탁기, 시간, 호실
let weeklyReservations;      //미리 정해진 요일별 예약 데이터
let newReservation;         //사용자가 새롭게 지금 입력하는 예약 정보. 1페이지에서 초기화하자
let reservations;           //사용자가 예약한 정보들의 덩어리


//selection-item 요소들 가져오자
const selectionItemDivs = document.getElementsByClassName("selection-item");

//네 개의 페이지 요소 가져오자
const calendarDiv = document.getElementById("calendar");
const selectionWashingmachineTimeDiv = document.getElementById("selection-washingmachine-time");
const washingmachineSelect = document.getElementById("washingmachine");
const timeSelect = document.getElementById("time");
const selectionRoomNameDiv = document.querySelector("#selection-room-name");
const boardDiv = document.querySelector("#board");
const roomSelect = document.getElementById("room");
const nameInput = document.getElementById("name");

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
            weeklyReservations = data;
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
        selectionItemDivs[page - 1].classList.add("select-menu");
    }


    //clear pageDiv
    pageDivs.forEach(pageDiv => {
        pageDiv.style.display = "none";
    });

    //show pageDiv 1
    pageDivs[page - 1].style.display = "block";

    if (page === 2) {   //시간 선택: 세탁기, 시간
        initWashingmachineTime();
    } else if (page === 3) {    //호실 이름
        //세탁기 번호, 시간 보관하자
        newReservation.washingmachine = washingmachineSelect.value; //세탁기 option에서 사용자가 선택한 세탁기의 value속성값을 가져오자
        newReservation.time = timeSelect.value;

        initRoomName();
    } else if (page === 4) {    //세탁기 예약 현황표
        //호실, 이름 보관하자
        newReservation.room = roomSelect.value;
        newReservation.name = nameInput.value;

        console.log(newReservation);

        // initTable();
    }

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

const initWashingmachineTime = () => {
    let allWashingmachineTime = {};
    let washingmachines;    //세탁기 번호 모음

    //초기 데이터 세팅하자: {"1": ["1","2","3"],"2": ["1","2","3"],"3": ["1","2","3"]}
    //allData.washingmachine에서 하나씩 꺼내자 => washingmachine
    allData.washingmachine.forEach((washingmachine) => {
        allWashingmachineTime[washingmachine] = Object.keys(allData.time); //aWT["1"] = ["1", "2", "3"] => aWT = {"1": ["1", "2", "3"]}
    });

    //선택한 날짜의 요일 구하자
    let weekday = newReservation.date.getDay();

    //그 요일의 미리 예약된 세탁기와 시간 파악하자
    //예약된게 있으면 select 목록에서 빼자
    weeklyReservations.forEach((weeklyReservation) => {
        if (weeklyReservation.weekday === weekday) {
            const { washingmachine, time } = weeklyReservation;
            // const washingmachine = weeklyReservation.washingmachine;
            // const time = weeklyReservation.time;

            const index = allWashingmachineTime[washingmachine].indexOf(String(time));  //1 -> "1"
            if (index > -1) {   //예약된 시간 찾았다면
                allWashingmachineTime[washingmachine].splice(index, 1); // 그 시간 빼자
            }
        }
    });

    //TODO: 사용자가 예약한 내용도 위의 것을 다 파악해서 빼자


    //select 들: 세탁기 번호, 시간들 만들자
    washingmachineSelect.innerHTML = "";    //세탁기 option 없애자
    washingmachines = Object.keys(allWashingmachineTime);
    //예약할 시간이 없으면, 세탁기 번호도 빼자      allWashingmachineTime = {세탁기번호: [시간, 시간, 시간]}
    washingmachines = washingmachines.filter((washingmachine) => allWashingmachineTime[washingmachine].length > 0);

    washingmachines.forEach((washingmachine) => {
        // <option value="1">1번 세탁기</option>
        // option 태그 만들자
        const newOption = document.createElement("option");
        // 값 넣자
        newOption.value = washingmachine;
        // 텍스트 넣자
        newOption.textContent = `${washingmachine}번 세탁기`;

        // washingmachineSelect에 저거 넣자
        washingmachineSelect.appendChild(newOption);
    });

    const initTime = () => {
        const selectedWashingmachine = washingmachineSelect.value;  //선택한 세탁기 option의 value

        timeSelect.innerHTML = "";      //시간 option 없애자
        allWashingmachineTime[selectedWashingmachine].forEach((time) => {
            // <option value="1">7시 ~ 8시 10분</option>
            const newOption = document.createElement("option");
            newOption.value = time;
            newOption.textContent = allData.time[time];   //"2" -> allData.time["2"](8시 10분 ~ 9시 20분). time -> allData.time[time]

            timeSelect.appendChild(newOption);
        });
    }
    initTime();

    //세탁기 번호가 바뀌면, 다시 시간을 불러오자
    washingmachineSelect.onchange = initTime;

    //3page에 세탁기, 시간 넘기자

}

const initRoomName = () => {
    // 모든 호실 표시하자
    //allData에서 방 정보 가져와서 <option value="401">401호</option> 만들어서 roomSelect에 자식으로 붙이자
    let rooms = allData.room;
    let optionString = "";
    rooms.forEach((room) => {
        optionString += `<option value="${room}">${room}호</option>`;
    });
    roomSelect.innerHTML = optionString;

    // 이름 초기화하자
    nameInput.value = "";

    // 4page에 호실, 이름 넘기자
}