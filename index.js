document.addEventListener("DOMContentLoaded", async function () {
  const Main_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

  const dropDowns = document.querySelectorAll(".dropdown select");
  const button = document.querySelector("#ex-btn");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".message");
  const amountInput = document.querySelector(".amount input");

  dropDowns.forEach((select) => {
    for (const code in countryList) {
      const newOption = document.createElement("option");
      newOption.innerText = code;
      newOption.value = code;
      select.appendChild(newOption);
    }

    select.addEventListener("change", async (evt) => {
      updateFlag(evt.target);
      const fromCurrency = fromCurr.value;
      const toCurrency = toCurr.value;
      const newRate = await fetchConversionRate(fromCurrency, toCurrency);
      updateMessage(newRate);
    });
  });

  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");

  // Set default option for "from" select to "USD"
  fromSelect.value = "USD";

  // Set default option for "to" select to "INR"
  toSelect.value = "INR";

  // Fetch initial conversion rate and update message
  const initialRate = await fetchConversionRate(fromCurr.value, toCurr.value);
  updateMessage(initialRate);

  button.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amtVal = amountInput.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amountInput.value = "1";
    }
    const rate = await fetchConversionRate(fromCurr.value, toCurr.value);
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  });

  amountInput.addEventListener("keydown", async (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      let amtVal = amountInput.value;
      if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
      }
      const rate = await fetchConversionRate(fromCurr.value, toCurr.value);
      let finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(
        2
      )} ${toCurr.value}`;
    }
  });

  async function fetchConversionRate(fromCurrency, toCurrency) {
    const URL = `${Main_URL}/${fromCurrency.toLowerCase()}/${toCurrency.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    return data[toCurrency.toLowerCase()];
  }

  function updateMessage(rate) {
    msg.innerText = `1 ${fromCurr.value} = ${rate.toFixed(2)} ${toCurr.value}`;
  }

  const updateFlag = (element) => {
    let code = element.value;
    let countryCode = countryList[code];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };
});
