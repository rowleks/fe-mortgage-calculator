const data = {
    pv: 300000, // Present value (loan amount)
    rate: 5.25 / 100, // Annual interest rate as a decimal
    year: 20 // Loan term in years
};

data.nper = data.year * 12; // Total number of payments (months)
data.prate = data.rate / 12; // Monthly interest rate

// Correct PMT formula
const pmt = (data.pv * data.prate) / (1 - (1 + data.prate) ** -data.nper);

const total = pmt * data.nper

console.log(pmt.toLocaleString('en-US', { maximumFractionDigits: 2, style: "currency", currency: "GBP" })); // Properly formatted PMT
console.log(total.toLocaleString('en-US', { maximumFractionDigits: 2, style: "currency", currency: "GBP" })); // Properly formatted total
