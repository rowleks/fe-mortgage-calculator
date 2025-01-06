const form = document.getElementById('form')
const clearBtn = document.getElementById('clear')
const input = document.querySelector('input[type="text"]')
const empty = document.querySelector('.empty')
const filled = document.querySelector('.filled')
const radios = document.querySelectorAll('input[type="radio"')
const monthElem = document.querySelector('.month')
const totalElem = document.querySelector('.total')
const radioDiv = document.querySelectorAll('.mtg-type')

function handleForm(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    for (const key in data)
    {
        if(data[key]) 
        {
            const val = data[key].replace(/,/g, '')
            if (!isNaN(val)) { data[key] = parseFloat(val) }
        }
    }


    const calculateRepayment = (data) => {
        const info = {...data}
        info.nper = info.term * 12
        info.periodicRate = (info.rate / 100) / 12

        const pmt = (info.amount * info.periodicRate) / (1 - (1 + info.periodicRate) ** -info.nper)

        const total = pmt * info.nper

        return [pmt, total]
    }

    const calculateInterestOnly = (data) => {
        const info = {...data}
        const interestPeriod = Math.ceil((info.term * 30)/100)
        info.term = (info.term) - interestPeriod
        info.periodicRate = (info.rate / 100) / 12

        const monthlyPay = info.amount * info.periodicRate
        const [mp, tp] = calculateRepayment(info)
        const totalPay = tp + (monthlyPay * interestPeriod * 12)

        return [monthlyPay, totalPay]
    }

    if(data.amount && data.term && data.rate && data.type === "repayment") 
    {
        const [monthlyPay, totalPay] = calculateRepayment(data)

        empty.classList.add('none')
        filled.classList.remove('none')

        monthElem.textContent = monthlyPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})

        totalElem.textContent = totalPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})
    }

    if(data.amount && data.term && data.rate && data.type === "interest-only") 
    {
        const [monthlyPay, totalPay] = calculateInterestOnly(data)

        empty.classList.add('none')
        filled.classList.remove('none')

        monthElem.textContent = monthlyPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})

        totalElem.textContent = totalPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})
    }

}

function handleDisplay(e) {
    let rawValue = e.target.value.replace(/,/g, '');
    rawValue = rawValue.replace(/[^0-9.]/g, ''); 

    if ((rawValue.match(/\./g) || []).length > 1) {
        rawValue = rawValue.replace(/\.(?=[^.]*$)/, ''); 
    }

    rawValue = rawValue.replace(/(\.\d{2})\d+/g, '$1');

    if (rawValue === '') {
        e.target.value = '';
        return;
    }

    const [integer, decimal] = rawValue.split('.');

    const formattedInteger = Number(integer).toLocaleString('en-US');

    e.target.value = decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
}

function handleReset() {
    form.reset()
    empty.classList.remove('none')
    filled.classList.add('none')
    radioDiv.forEach(div => div.classList.remove('checked'))
}

function handleRadio(e) {
    radios.forEach(rad => 
        {
            const parentElement = rad.parentElement
            parentElement.classList.remove('checked')
        })

        if(e.target.checked)
        {
            e.target.parentElement.classList.add('checked')
        }
}

form.addEventListener('submit', handleForm)
input.addEventListener('input', handleDisplay)
clearBtn.addEventListener('click', handleReset)
radios.forEach(radio => { radio.addEventListener('change', handleRadio) })