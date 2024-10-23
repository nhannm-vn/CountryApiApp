// tạo sẵn đường link
const baseURL = "https://restcountries.com/v3.1/name/india?fullText=true";

//class Http, tuy nhiên mình chỉ cần api lấy dữ liệu về thôi

class Http {
  get(url) {
    return fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }
}

//class store chuyên lấy dữ liệu về, và xử lí dữ liệu
class Store {
  constructor() {
    this.http = new Http();
  }
  //lấy dữ liệu về từ server, cụ thể chi tiết là một quốc gia
  //nhận vào tên của quốc gia và tìm và đưa cho cục countryInfor
  getCountry(nameCountry) {
    const baseURL = `https://restcountries.com/v3.1/name/${nameCountry}?fullText=true`;
    return this.http.get(baseURL);
  }
}

//class renderui chuyên lấy dữ liệu xong hiển thị lên ui
class RenderUI {
  renderCountry(country) {
    //lấy các dữ liệu cần từ country sau đó nhét vào giao diện
    const img = country[0].flags.png;
    const name = country[0].name.common.toUpperCase();
    const capital = country[0].capital[0];
    const continent = country[0].continents[0];
    const population = country[0].population;
    const area = country[0].area;
    const currency = Object.keys(country[0].currencies)[0];
    const languages = country[0].languages;

    //dom tới
    let htmlContent = `
                <img src="${img}" alt="Img error">
                <h2 class="card-name-country">${name}</h2>
                <div class="card-content">
                    <p id="capital">
                        <strong>Capital:</strong> ${capital}
                    </p>
                    <p id="continent">
                        <strong>Continent:</strong> ${continent}
                    </p>
                    <p id="population">
                        <strong>Population:</strong> ${population}
                    </p>
                    <p id="area">
                        <strong>Area:</strong> ${area}
                    </p>
                    <p id="currency">
                        <strong>Currency:</strong> ${currency}
                    </p>
                    <p id="language">
                        <strong>Comman Languages:</strong> English, Hindi, Tamil
                    </p>
        `;
    document.querySelector(".card").innerHTML = htmlContent;
    //chỉ riêng thằng comman language có khi nó dùng nhiều ngôn ngữ nên phải nhét kiểu khác
    //tuy nhiên mình cần nhét mấy kia cho có phàn tử mới dom vô được

    let tmp = [];
    for (const key in languages) {
      tmp.push(languages[key]);
    }
    tmp = tmp.join(", ");
    let listLanguage = `<strong>Comman Languages:</strong> ` + tmp;
    document.querySelector("#language").innerHTML = listLanguage;
  }
}

//bắt sự kiện submit của form
document.querySelector("form").addEventListener("submit", (event) => {
  //ngăn sự kiện load của nó
  event.preventDefault();
  //dom tới để lấy dữ liệu, nhưng biến nó về dạng chữ thường hết
  let countryName = document.querySelector("#country-inp").value.toLowerCase();

  //tạo ra 2 instance từ class
  const store = new Store();
  const ui = new RenderUI();

  //nhờ store lấy dữ liệu về
  store
    .getCountry(countryName)
    .then((countryInfor) => {
      document.querySelector(".notification-error").style.display = "none";
      console.log(countryInfor);
      ui.renderCountry(countryInfor);
    })
    .catch(() => {
      //nếu có bị lỗi
      //nếu như bỏ trống mà bấm
      if (countryName.length == 0) {
        document.querySelector(".notification-error").textContent =
          "The input field cannot be empty";
        document.querySelector(".notification-error").style.display = "block";
      } else {
        document.querySelector(".notification-error").textContent =
          "Please enter the valid country name";
        document.querySelector(".notification-error").style.display = "block";
      }
    });
});
