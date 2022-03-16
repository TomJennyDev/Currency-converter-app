const API_KEY = "4af3378f06778fe73ea8ca5c";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

async function getSupportedCode() {
  try {
    const response = await fetch(`${BASE_URL}/codes`);
    if (response.ok) {
      const data = await response.json();
      codes = data["supported_codes"];
      return codes;
    }
    return [];
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

const getConversionRate = async (baseCode, targetCode) => {
  try {
    const response = await fetch(`${BASE_URL}/pair/${baseCode}/${targetCode}`);
    const data = await response.json();
    const rate = data["conversion_rate"];
    return rate;
  } catch (error) {
    console.log(error.message);
    return 0;
  }
};
