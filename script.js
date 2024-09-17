const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");

let currentStep = 1;
let currentCircle = 0;
let isYearly = false; // To track if we're using yearly or monthly pricing

const selectedPlan = {
  name: null,
  price: null,
};

const selectedAddons = [];

// Function to handle Next Button clicks
function handleNextStep() {
  document.querySelector(`.step-${currentStep}`).style.display = "none";

  // Validation
  if (currentStep === 1 && !validateForm()) {
    return;
  }

  currentStep++;
  currentCircle++;

  document.querySelector(`.step-${currentStep}`).style.display = "flex";
  circleSteps[currentCircle].classList.add("active");

  // Update total only after step 2
  if (currentStep > 2) {
    updateTotal();
  }

  // Update summary
  updateSummary();
}

// Function to handle Previous Button clicks
function handlePreviousStep() {
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  currentStep--;
  currentCircle--;
  document.querySelector(`.step-${currentStep}`).style.display = "flex";
  circleSteps[currentCircle].classList.remove("active");
}

// Function to validate the form in step 1
function validateForm() {
  let isValid = true;
  for (let i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
      isValid = false;
      formInputs[i].classList.add("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
    } else {
      isValid = true;
      formInputs[i].classList.remove("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "none";
    }
  }
  return isValid;
}

// Helper function to find the label associated with an input
function findLabel(element) {
  const idVal = element.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor === idVal) return labels[i];
  }
}

// Function to handle plan selection
function handlePlanSelection(planElement) {
  // Deselect any previous plan
  document.querySelector(".selected").classList.remove("selected");
  planElement.classList.add("selected");

  selectedPlan.name = planElement.querySelector("b").innerText;
  selectedPlan.price = planElement.querySelector(".plan-priced").innerText;
}

// Function to handle yearly/monthly switch
function handleSwitchClick() {
  isYearly = switcher.querySelector("input").checked;

  if (isYearly) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }
  switchPrice();
}

// Function to switch prices based on yearly/monthly
function switchPrice() {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll(".plan-priced");
  if (isYearly) {
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
  }
}

// Function to handle addon selection
function handleAddonSelection(addonElement) {
  const addonSelect = addonElement.querySelector("input");
  const ID = addonElement.getAttribute("data-id");

  if (addonSelect.checked) {
    addonSelect.checked = false;
    addonElement.classList.remove("ad-selected");
    removeAddon(ID);
  } else {
    addonSelect.checked = true;
    addonElement.classList.add("ad-selected");
    addAddon(ID);
  }
}

// Function to add an addon to the list
function addAddon(ID) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");

  serviceName.innerText = document.querySelector(
    `[data-id="${ID}"] label`
  ).innerText;
  servicePrice.innerText = document.querySelector(
    `[data-id="${ID}"] .price`
  ).innerText;
  clone.querySelector(".selected-addon").setAttribute("data-id", ID);

  document.querySelector(".addons").appendChild(clone);
  selectedAddons.push(ID); // Update selectedAddons list
}

// Function to remove an addon from the list
function removeAddon(ID) {
  const addons = document.querySelectorAll(".selected-addon");
  addons.forEach((addon) => {
    const attr = addon.getAttribute("data-id");
    if (attr == ID) {
      addon.remove();
    }
  });
  selectedAddons.splice(selectedAddons.indexOf(ID), 1); // Update selectedAddons list
}

// Function to update the total price
function updateTotal() {
  let totalValue = 0;

  // Calculate total price of selected addons
  selectedAddons.forEach((ID) => {
    const priceStr = document.querySelector(
      `[data-id="${ID}"] .price`
    ).innerText;
    totalValue += parseInt(priceStr.replace(/\D/g, ""), 10);
  });

  const planPriceValue = parseInt(selectedPlan.price.replace(/\D/g, ""), 10);

  // Update total with selected plan and addon prices
  total.innerHTML = `$${(totalValue + planPriceValue).toLocaleString()}/${
    isYearly ? "yr" : "mo"
  }`;
}

// Function to update the summary
function updateSummary() {
  const planName = document.querySelector(".plan-name");

  planName.innerHTML = `${selectedPlan.name} (${
    isYearly ? "yearly" : "monthly"
  })`;
  planPrice.innerHTML = selectedPlan.price;
}

// Event Listeners
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");
  if (prevBtn) {
    prevBtn.addEventListener("click", handlePreviousStep);
  }
  nextBtn.addEventListener("click", handleNextStep);
});

plans.forEach((plan) => {
  plan.addEventListener("click", () => handlePlanSelection(plan));
});

switcher.addEventListener("click", handleSwitchClick);

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => handleAddonSelection(addon));
});