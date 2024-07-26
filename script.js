const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

const expenseList = document.querySelector('ul')
const expensesQuantity = document.querySelector('aside header p span')
const expensesTotal = document.querySelector('aside header h2')

window.onload = () => {
    expense.focus()
}

amount.oninput = () => {
   let value = amount.value.replace(/\D/g, "")

   value = Number(value) / 100
   amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
    try {
        //throw new Error("Erro de teste")
        const expenseItem = document.createElement('li')
        expenseItem.classList.add('expense')

        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src', `./img/${newExpense.category_id}.svg`) 
        expenseIcon.setAttribute('alt', newExpense.category_name)
        
        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')
        
        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense
        
        const expenseCat = document.createElement('span')
        expenseCat.textContent = newExpense.category_name
        expenseInfo.append(expenseName, expenseCat)
        
        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
            .toUpperCase()
            .replace('R$', '')}`

        const removeIcon = document.createElement('img')
        removeIcon.classList.add('remove-icon')
        removeIcon.setAttribute('src', './img/remove.svg') 
        removeIcon.setAttribute('alt', 'remover')

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
        expenseList.append(expenseItem)
        
        formClear()
        updateTotals()
    } catch(error) {
        alert('Não foi possível atualizar a lista de despensas')
        console.log(error)
    }
}

function updateTotals() {
    try {
        //throw new Error("Erro de teste")
        const items = expenseList.children
        
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        let total = 0
        for(let index = 0; index < items.length; index++) {
            const itemAmount = items[index].querySelector('.expense-amount')

            //a expressao regular remove caracteres nao numericos
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',','.')
            value = parseFloat(value)
            
            if(isNaN(value)) {
                return alert("Nao foi possivel calcular o total.")
            }

            total += value
        }

        const symbolBRL = document.createElement('small')
        symbolBRL.textContent = "R$"
        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')
        expensesTotal.innerHTML = ''
        expensesTotal.append(symbolBRL, total)

    } catch(error) {
        alert('Não foi possível atualizar os totais')
        console.log(error)
    }
}

expenseList.addEventListener('click', (event) => {
    if(event.target.classList.contains('remove-icon')) {
        const item = event.target.closest('.expense')
        item.remove()
    }
    updateTotals()
})

function formClear() {
    amount.value = ''
    category.value = ''
    expense.value = ''

    expense.focus()
}