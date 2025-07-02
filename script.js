function toggleInfo() {
  const popup = document.getElementById("infoPopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

const inputs = document.querySelectorAll("input, select");
inputs.forEach(el => el.addEventListener("input", calculatePremium));

function getAgeGroup(age) {
  if (age <= 20) return "18-20";
  if (age <= 26) return "21-26";
  if (age <= 46) return "27-46";
  return "47+";
}

function getZone(region) {
  const mapping = {
    kyiv: "Зона 1",
    lviv: "Зона 1",
    borispil: "Зона 2",
    odessa: "Зона 2",
    dnipro: "Зона 2",
    kharkiv: "Зона 2"
  };
  return mapping[region] || "Зона 2";
}

function calculatePremium() {
  const age = +document.getElementById("driverAge").value;
  const volume = +document.getElementById("engineVolume").value;
  const region = document.getElementById("region").value;
  const error = document.getElementById("volumeError");
  const resultBlock = document.getElementById("resultBlock");

  let category = "";
  if (volume === 0) category = "B5"; // електрокар
  else if (volume < 1600) category = "B1";
  else if (volume < 2000) category = "B2";
  else if (volume < 3000) category = "B3";
  else category = "B4";

  if (volume < 0 || volume > 6000) {
    error.textContent = "Введіть значення від 500 до 6000 см³ або 0 для електро";
    resultBlock.classList.remove("visible");
    resultBlock.innerHTML = "";
    return;
  } else {
    error.textContent = "";
  }

  if (age && volume >= 0 && region && category) {
    const zone = getZone(region);
    const ageGroup = getAgeGroup(age);
    const results = [];

    for (const company in insuranceData) {
      const companyData = insuranceData[company];
      let price = null;

      if (companyData[category] && companyData[category][zone]) {
        const target = companyData[category][zone];
        if (typeof target === "number") {
          price = target;
        } else {
          price = target[ageGroup] || null;
        }
      }

      if (price) {
        results.push({ company, price });
      }
    }

    if (results.length) {
      results.sort((a, b) => a.price - b.price);
      const min = results[0].price;
      let html = `<strong>Результати по страхових:</strong><br>`;
      results.forEach(({ company, price }) => {
        const isMin = price === min;
        html += `<div class="${isMin ? "cheapest" : ""}">
          ${isMin ? "💸" : ""} <strong>${company}:</strong> ${price} грн
        </div>`;
      });

      resultBlock.innerHTML = html;
      resultBlock.classList.add("visible");
    } else {
      resultBlock.textContent = "Даних для таких параметрів поки немає.";
      resultBlock.classList.add("visible");
    }

  } else {
    resultBlock.textContent = "⬅️ Заповніть дані для розрахунку";
    resultBlock.classList.remove("visible");
  }
}