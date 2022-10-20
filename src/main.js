import "./css/index.css"
import IMask from "imask"

const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setTypeCard(card) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }
  ccBgColor1.setAttribute("fill", colors[card][0])
  ccBgColor2.setAttribute("fill", colors[card][1])

  ccLogo.src = `cc-${card}.svg`
}
globalThis.setTypeCard = setTypeCard

const handleInfoCard = (selector, value, defaultText) => {
  document.querySelector(selector).innerText =
    value.length > 0 ? value : defaultText
}

// obj inputs validation
const inputs = {
  inputCardNumber: document.getElementById("card-number"),
  inputSecurityCode: document.getElementById("security-code"),
  inputExpirationDate: document.getElementById("expiration-date"),
}

var cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )

    setTypeCard(foundMask.cardtype)
    return foundMask
  },
}
const cardNumberMasked = IMask(inputs.inputCardNumber, cardNumberPattern)
cardNumberMasked.on("accept", () =>
  handleInfoCard(
    ".cc-info .cc-number",
    cardNumberMasked.value,
    "1234 5678 9012 3456"
  )
)

var securityCodePattern = {
  mask: "000",
}
const securityCodeMasked = IMask(inputs.inputSecurityCode, securityCodePattern)
securityCodeMasked.on("accept", () =>
  handleInfoCard(
    ".cc-extra .cc-security div:nth-child(2)",
    securityCodeMasked.value,
    "190"
  )
)

var expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(
  inputs.inputExpirationDate,
  expirationDatePattern
)
expirationDateMasked.on("accept", () =>
  handleInfoCard(".cc-expiration .value", expirationDateMasked.value, "02/32")
)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  console.log(addButton)
})

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
})

const inputName = document.getElementById("card-holder")

inputName.addEventListener("input", () => {
  const holderLabel = document.querySelector(".cc-holder .value")

  holderLabel.innerText = inputName.value.length > 0 ? inputName.value : "HAMU"
})
