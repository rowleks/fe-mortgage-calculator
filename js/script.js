const form = document.getElementById('form')
const clearBtn = document.getElementById('clear')
const inputs = document.querySelector('input')
const empty = document.querySelector('.empty')
const filled = document.querySelector('.filled')
const radios = document.querySelectorAll('input[type="radio"')
const monthElem = document.querySelector('.month')
const totalElem = document.querySelector('.total')
const radioDiv = document.querySelectorAll('.mtg-type')
const inputDiv = document.querySelectorAll('.input-brd')
const inputSpan = document.querySelectorAll('.sym')
const errMsg = document.querySelectorAll('.req')

/* 
    If your're reading this code, please bear with my naming conventions. It's terrible. I promise to change.
*/

function handleForm(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const fields = e.target.querySelectorAll('input')

    for (const key in data)
    {
        if(data[key]) 
        {
            const val = data[key].replace(/,/g, '')
            if (!isNaN(val)) { data[key] = parseFloat(val) }
        }
    }

        fields.forEach(field => 
        {
            if(field.type === "text" || field.type === "number")
            {
                if(!field.value)
                {
                    const parent = field.parentElement
                    parent.classList.add('l-invalid')
                    field.nextElementSibling?.classList.add('s-invalid')
                    field.previousElementSibling?.classList.add('s-invalid')
                    parent.nextElementSibling.classList.add('show')
                    return
                }
            }

            if(field.name === "type")
            {
                if(!data.type)
                {
                    field.parentElement.nextElementSibling.classList.add('show')
                }
            }
        }
        )


    const calculateRepayment = (data) => {
        const info = {...data}
        info.nper = info.term * 12
        info.periodicRate = (info.rate / 100) / 12

        const pmt = (info.amount * info.periodicRate) / (1 - (1 + info.periodicRate) ** -info.nper)

        const total = pmt * info.nper

        return { pmt, total}
    }

    const calculateInterestOnly = (data) => {
        const info = {...data}
        const interestPeriod = Math.ceil((info.term * 30)/100)
        info.term = (info.term) - interestPeriod
        info.periodicRate = (info.rate / 100) / 12

        const monthlyPay = info.amount * info.periodicRate
        const { total } = calculateRepayment(info)
        const totalPay = total + (monthlyPay * interestPeriod * 12)

        return { monthlyPay, totalPay}
    }

    if(data.amount && data.term && data.rate && data.type === "repayment") 
    {
        const { pmt, total} = calculateRepayment(data)

        empty.classList.add('none')
        filled.classList.remove('none')

        monthElem.textContent = pmt.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})

        totalElem.textContent = total.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})
    }

    if(data.amount && data.term && data.rate && data.type === "interest-only") 
    {
        const { monthlyPay, totalPay } = calculateInterestOnly(data)

        empty.classList.add('none')
        filled.classList.remove('none')

        monthElem.textContent = monthlyPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})

        totalElem.textContent = totalPay.toLocaleString('en-US', {maximumFractionDigits: 2, style: 'currency', currency: "GBP"})
    }

}

function handleDisplay(e) {
    let rawValue = e.value.replace(/,/g, ''); // Remove existing commas
    rawValue = rawValue.replace(/[^0-9.]/g, ''); // Remove any non-numeric and non-period characters

    if ((rawValue.match(/\./g) || []).length > 1) {
        rawValue = rawValue.replace(/\.(?=[^.]*$)/, ''); // Remove all periods except the last one
    }

    rawValue = rawValue.replace(/(\.\d{2})\d+/g, '$1'); // Limit to two decimal places

    if (rawValue === '') {
        e.value = '';
        return;
    }

    const [integer, decimal] = rawValue.split('.');

    const formattedInteger = Number(integer).toLocaleString('en-US'); // Format integer part with commas

    e.value = decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger; // Reconstruct the value with formatted integer and decimal parts
}

function handleReset() {
    form.reset()
    empty.classList.remove('none')
    filled.classList.add('none')
    radioDiv.forEach(div => div.classList.remove('checked'))
    inputDiv.forEach(div => div.classList.remove('l-valid', 'l-invalid'))
    inputSpan.forEach(span => span.classList.remove('s-valid', 's-invalid'))
    errMsg.forEach(msg => msg.classList.remove('show') )
}

function handleRadio(e) {
    radios.forEach(rad => 
        {
            const parentElement = rad.parentElement
            parentElement.classList.remove('checked')
            parentElement.nextElementSibling.classList.remove('show')
        })

        if(e.target.checked)
        {
            e.target.parentElement.classList.add('checked')
        }
}

function handleFocus(input) {
    if(parseFloat(input.value) === 0) 
        {
            input.parentElement.classList.add('l-invalid')
            input.previousElementSibling?.classList.add('s-invalid')
            input.nextElementSibling?.classList.add('s-invalid')
        }
        else if(parseFloat(input.value) > 0)
        {
            input.parentElement.classList.remove('l-invalid')
            input.previousElementSibling?.classList.remove('s-invalid')
            input.nextElementSibling?.classList.remove('s-invalid')
            input.parentElement.nextElementSibling.classList.remove('show')
            
            input.parentElement.classList.add('l-valid')
            input.previousElementSibling?.classList.add('s-valid')
            input.nextElementSibling?.classList.add('s-valid')
        }
}

function handleBlur(input) {
        input.parentElement.classList.remove('l-valid', 'l-invalid')
        input.previousElementSibling?.classList.remove('s-valid', 's-invalid')
        input.nextElementSibling?.classList.remove('s-valid', 's-invalid')
}


function handleInputs(input) {
    if(input.type === "text") { handleDisplay(input) }

    if(input.type === "text" || input.type === "number")
        {
            if(parseFloat(input.value) === 0) 
            {
                input.parentElement.classList.add('l-invalid')
                input.previousElementSibling?.classList.add('s-invalid')
                input.nextElementSibling?.classList.add('s-invalid')
            }
            else if(parseFloat(input.value) > 0)
            {
                input.parentElement.classList.remove('l-invalid')
                input.previousElementSibling?.classList.remove('s-invalid')
                input.nextElementSibling?.classList.remove('s-invalid')
                input.parentElement.nextElementSibling.classList.remove('show')
                
                input.parentElement.classList.add('l-valid')
                input.previousElementSibling?.classList.add('s-valid')
                input.nextElementSibling?.classList.add('s-valid')
            }
            else
            {
                input.parentElement.classList.remove('l-valid', 'l-invalid')
                input.previousElementSibling?.classList.remove('s-valid', 's-invalid')
                input.nextElementSibling?.classList.remove('s-valid', 's-invalid')
            }
        }
}

form.addEventListener('submit', handleForm)
form.addEventListener('input', e => {
    if(e.target.tagName === "INPUT") { handleInputs(e.target)}
})
form.addEventListener('focusin', e => {
    if(e.target.tagName === "INPUT") { handleFocus(e.target)}
})
form.addEventListener('focusout', e => {
    if(e.target.tagName === "INPUT") { handleBlur(e.target)}
})

clearBtn.addEventListener('click', handleReset)
radios.forEach(radio => { radio.addEventListener('change', handleRadio) })