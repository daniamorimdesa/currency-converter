async function convertCurrency() {
    let amount = parseFloat(document.getElementById("amount").value);
    let sourceCurrency = document.getElementById("currencyFrom").value;
  
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number!");
      return;
    }
  
    let targetCurrencies = ["USD", "EUR", "GBP", "BRL", "JPY", "KRW"];
  
    // Fetch exchange rates using USD as an intermediary reference
    let url = `https://economia.awesomeapi.com.br/json/last/USD-BRL,USD-EUR,USD-GBP,USD-JPY,USD-KRW`;
  
    try {
      let response = await fetch(url);
      let data = await response.json();
  
      // Create an object with rates relative to USD
      let exchangeRates = {
        USD: 1, // USD to USD is always 1
        BRL: parseFloat(data["USDBRL"].bid), // USD to BRL
        EUR: parseFloat(data["USDEUR"].bid), // USD to EUR
        GBP: parseFloat(data["USDGBP"].bid), // USD to GBP
        JPY: parseFloat(data["USDJPY"].bid), // USD to JPY
        KRW: parseFloat(data["USDKRW"].bid), // USD to KRW
      };
  
      // Create inverse rates (e.g., BRL to USD, EUR to USD, etc.)
      let inverseRates = {};
      for (let currency in exchangeRates) {
        inverseRates[currency] = 1 / exchangeRates[currency];
      }
  
      let resultHTML = "";
      for (let targetCurrency of targetCurrencies) {
        if (sourceCurrency !== targetCurrency) {
          // Convert first to USD, then to the target currency
          let convertedAmount =
            (amount * inverseRates[sourceCurrency]) * exchangeRates[targetCurrency];
  
          let formattedAmount = convertedAmount.toLocaleString(undefined, {
            style: "currency",
            currency: targetCurrency,
          });
  
          resultHTML += `<p>${targetCurrency}: ${formattedAmount}</p>`;
        }
      }
  
      document.getElementById("result").style.display = "block";
      document.getElementById("result").innerHTML = resultHTML;
  
    } catch (error) {
      alert("Error fetching exchange rate data. Please try again later.");
      console.error("API Fetch Error:", error);
    }
  }