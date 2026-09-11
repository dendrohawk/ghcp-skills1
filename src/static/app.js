document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("flight-form");
  const alertButton = document.getElementById("alert-button");
  const alertMessage = document.getElementById("alert-message");
  const targetPrice = document.getElementById("target-price");
  const resultsHeading = document.getElementById("results-heading");
  const resultCount = document.querySelector(".result-count");
  const resultList = document.getElementById("flight-results");
  const emptyResults = document.getElementById("empty-results");
  const excludedAirlines = document.getElementById("excluded-airlines");
  const airlineCheckboxes = [...document.querySelectorAll('input[name="excluded-airline"]')];

  const updateFlightResults = () => {
    const excluded = new Set(
      airlineCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value),
    );
    const flights = [...resultList.querySelectorAll(".flight-card")];
    const visibleFlights = flights.filter((flight) => !excluded.has(flight.dataset.airline));

    flights.forEach((flight) => {
      flight.hidden = excluded.has(flight.dataset.airline);
    });
    resultCount.textContent = `${visibleFlights.length} ${visibleFlights.length === 1 ? "option" : "options"} · sorted by price`;
    emptyResults.hidden = visibleFlights.length > 0;
    excludedAirlines.replaceChildren(
      ...[...excluded].map((airline) => {
        const chip = document.createElement("span");
        const removeButton = document.createElement("button");
        chip.className = "exclusion-chip";
        chip.append(document.createTextNode(airline));
        removeButton.type = "button";
        removeButton.setAttribute("aria-label", `Include ${airline} again`);
        removeButton.textContent = "×";
        chip.append(removeButton);
        removeButton.addEventListener("click", () => {
          const checkbox = airlineCheckboxes.find((option) => option.value === airline);
          checkbox.checked = false;
          updateFlightResults();
        });
        return chip;
      }),
    );
  };

  airlineCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", updateFlightResults));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const origin = document.getElementById("origin").value.trim().toUpperCase() || "MCI";
    document.getElementById("origin").value = origin;
    resultsHeading.textContent = "Best matches";
    updateFlightResults();
    alertMessage.textContent = "Search criteria saved — connect a provider for live fares.";
    alertMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  alertButton.addEventListener("click", () => {
    const price = Number(targetPrice.value);
    if (!price || price < 1) {
      alertMessage.textContent = "Enter a target price above $0.";
      alertMessage.style.color = "#b42318";
      targetPrice.focus();
      return;
    }
    alertMessage.style.color = "";
    alertMessage.textContent = `Price alert ready at $${price.toLocaleString()} for 2 tickets.`;
    alertButton.textContent = "Alert created ✓";
    alertButton.disabled = true;
  });
});
