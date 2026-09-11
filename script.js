let cachedRates = {};

async function loadCurrencies() {
  const fromSelect = document.getElementById('fromCurrency');
  const toSelect = document.getElementById('toCurrency');

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();

    if (data.result === "success") {
      cachedRates = data.rates;
      const currencies = Object.keys(data.rates).sort();

      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';

      currencies.forEach(curr => {
        const opt1 = document.createElement('option');
        opt1.value = curr;
        opt1.innerText = curr;
        if (curr === "USD") opt1.selected = true;
        fromSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = curr;
        opt2.innerText = curr;
        if (curr === "INR") opt2.selected = true;
        toSelect.appendChild(opt2);
      });

      convertCurrency();
    }
  } catch (error) {
    document.getElementById('convertedResult').innerText = "Failed to load currencies.";
  }
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  const resultElement = document.getElementById('convertedResult');
  const rateInfoElement = document.getElementById('rateInfo');

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.rates[to];
      const convertedAmount = amount * rate;

      resultElement.innerText = `${to} ${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      rateInfoElement.innerText = `1 ${from} = ${rate.toFixed(4)} ${to} (Live Rate)`;
    }
  } catch (error) {
    resultElement.innerText = "Error fetching rate.";
  }
}

function swapCurrencies() {
  const fromSelect = document.getElementById('fromCurrency');
  const toSelect = document.getElementById('toCurrency');
  
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  convertCurrency();
}

loadCurrencies();
