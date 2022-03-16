const inputBaseAmount = document.querySelector("#base-amount");
const inputTargetAmount = document.querySelector("#target-amount");

const baseUnit = document.querySelector("#base-unit");
const targetRate = document.querySelector("#target-rate");

const selectBaseCode = document.querySelector("#base-code");
const selectTargetCode = document.querySelector("#target-code");
const errorMsg = document.querySelector(".error-message");
let supportedCodes = [];
let conversionRate = 0;

const updateExchangeRate = async () => {
  const baseCode = selectBaseCode.value;
  const targetCode = selectTargetCode.value;

  document.querySelector(".exchange-info").classList.add("visible");
  document.querySelector(".skeleton").classList.remove("visible");

  conversionRate = await getConversionRate(baseCode, targetCode);

  document.querySelector(".skeleton").classList.add("visible");
  document.querySelector(".exchange-info").classList.remove("visible");

  const baseName = supportedCodes.find((code) => code[0] === baseCode)[1];
  const targetName = supportedCodes.find((code) => code[0] === targetCode)[1];
  baseUnit.textContent = `1 ${baseName} equals`;
  targetRate.textContent = `${conversionRate} ${targetName}`;
};

const caculateTargetAmount = () => {
  inputTargetAmount.value =
    Math.round(Number(inputBaseAmount.value) * conversionRate * 10 ** 6) /
    10 ** 6;
};

const caculateBasetAmount = () => {
  inputBaseAmount.value =
    Math.round((Number(inputTargetAmount.value) / conversionRate) * 10 ** 6) /
    10 ** 6;
};

selectBaseCode.addEventListener("change", updateExchangeRate);
selectBaseCode.addEventListener("change", caculateTargetAmount);

selectTargetCode.addEventListener("change", updateExchangeRate);
selectTargetCode.addEventListener("change", caculateTargetAmount);

inputBaseAmount.addEventListener("input", caculateTargetAmount);

inputTargetAmount.addEventListener("input", caculateBasetAmount);

const initialize = async () => {
  // Get Supported Code

  document.querySelector(".exchange-info").classList.add("visible");
  document.querySelector(".skeleton").classList.remove("visible");

  supportedCodes = await getSupportedCode();
  if (!supportedCodes.length) {
    errorMsg.textContent = "No supported codes!";
    return;
  }

  document.querySelector(".skeleton").classList.add("visible");
  document.querySelector(".exchange-info").classList.remove("visible");

  // Put options into the select boxes
  supportedCodes.forEach((code) => {
    const baseOption = document.createElement("option");
    baseOption.value = code[0];
    baseOption.textContent = code[1];
    selectBaseCode.appendChild(baseOption);

    const targetOption = document.createElement("option");
    targetOption.value = code[0];
    targetOption.textContent = code[1];
    selectTargetCode.appendChild(targetOption);
  });

  // Set VND to USD as default
  selectBaseCode.value = "VND";
  selectTargetCode.value = "USD";

  //  Update display info
  await updateExchangeRate();
};

const selectBtnExchange = document.querySelector(".btn-exchange");
selectBtnExchange.addEventListener("click", async () => {
  let tempExchange;

  inputBaseAmount.value = inputTargetAmount.value;
  caculateTargetAmount();

  tempExchange = selectBaseCode.value;
  selectBaseCode.value = selectTargetCode.value;
  selectTargetCode.value = tempExchange;

  await updateExchangeRate();
});

initialize();
