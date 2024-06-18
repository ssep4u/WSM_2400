const showData = (data) => {
    //data 하나씩 뽑아서 <article> -> .product-container 의 자식으로 넣자 <- HTML
    const productContainerSection = document.getElementsByClassName("product-container")[0];

    articleString = "";
    data.forEach(element => {
        articleString += `            <article class="product-item">
                <img src="images/${element["image"]}" alt="${element.name}" class="product-image">
                <div class="product-name">${element.name}</div>
            </article>\n`;
    });

    productContainerSection.innerHTML = articleString;
}

const setData = (data) => {
    showData(data);

    // data = [{'이름':'아이유'},{'이름': '안유진'}, {'이름': '변우석'}]

    // array = {'이름': 'a', '나이': 'b','주소': 'c'}
    // console.log(data[2]['이름'], data[2].이름)
    // //무뚝둑.webp 출력하자
    // console.log(data[3].image)
    // console.log(data[3]["image"])

    // //허니버터칩 출력하자
    // console.log(data[9].name)
    // console.log(data[9]["name"])
}

const getData = (() => {
    const url = 'js/data.json';
    fetch(url)
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => console.log(error));
});
getData();