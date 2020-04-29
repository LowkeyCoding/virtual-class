var startSession = () => {
    var TripInfo = requestTripInfo();
    alert(TripInfo);
    var price = processTripInfo(TripInfo);
    var paymentType = requestPayment();
    var amountPaid = processPayment(paymentType, price);
    if (amountPaid >= price) {
        alert("Dispensing Ticket")
        alert("Please remove the ticket")
        if (amountPaid > price) {
            alert("Dispensing Change: " + amountPaid - price);
            alert("Remember to take the change");
            alert("Thank you for using project x ticket vending machines")
        }
    }
}

var requestTripInfo = () => {
    return { dest: "bus to dollorupvej" }
}
var processTripInfo = (tripInfo) => {
    var dest = tripInfo.dest;
    price = dest.length * 100;
    return price
}
var requestPayment = () => {
    var paymentType = prompt("Chooses payment type: (Card or Cash)", "Card")
    return paymentType;
}
var processPayment = (paymentType, price) => {
    if (paymentType == "Card") {
        var card = {
            number: prompt("Card number: ", "000000000000000"),
            cvc: prompt("Card cvc", "000"),
            holder: prompt("Cardholder", "firstname lastname"),
            experationDate: prompt("Card experation date:", "xx/xx/xx")
        }
        if (card.Number.length === "000000000000000".length && card.cvc.length === 3 && card.experationDate.length === 8)
            return price;
    } else if (paymentType == "Cash") {
        return prompt("Amount to pay \"" + price + "\"", price)
    } else {
        alert("Invalid payment type: " + paymentType);
    }

}