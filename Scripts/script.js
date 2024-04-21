document.addEventListener('DOMContentLoaded', function () {
    const balanceDiv = document.getElementById('balance');
    const transactionList = document.getElementById('transaction-list');

    let transactions = [];

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function renderTransactions() {
        // Limpiamos la lista antes de renderizar para evitar duplicados
        transactionList.innerHTML = '';

        transactions.forEach((transaction, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const transactionType = transaction.type === 'income' ? 'text-success' : 'text-danger';
            listItem.innerHTML = `
                <div>
                    <span class="${transactionType}">${transaction.type.toUpperCase()}: $${transaction.amount} - ${transaction.category} (${transaction.description || 'Sin descripción'})</span>
                </div>
                <div>
                    <button class="btn btn-danger delete-btn" data-index="${index}">Eliminar</button>
                </div>
            `;

            listItem.querySelector('.delete-btn').addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                deleteTransaction(index);
            });

            transactionList.appendChild(listItem);
        });
    }

    function deleteTransaction(index) {
        transactions.splice(index, 1);
        saveTransactions();
        renderTransactions();
        updateBalance();
    }

    function updateBalance() {
        const totalIncome = transactions.filter(transaction => transaction.type === 'income')
            .reduce((total, transaction) => total + transaction.amount, 0);
        const totalExpense = transactions.filter(transaction => transaction.type === 'expense')
            .reduce((total, transaction) => total + transaction.amount, 0);
        const balance = totalIncome - totalExpense;

        balanceDiv.textContent = `Balance: $${balance.toFixed(2)}`;

        // Advertir al usuario si el balance es negativo
        if (balance < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Tu balance es negativo. Por favor, revisa tus gastos e ingresos.'
            });
        }
    }

    // Cargar transacciones al inicio
    fetch('data/transactions.json')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            renderTransactions();
            updateBalance();
        })
        .catch(error => {
            console.error('Error al cargar las transacciones:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las transacciones. Por favor, inténtalo de nuevo más tarde.'
            });
        });

    const form = document.getElementById('transaction-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        if (isNaN(amount) || amount <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, introduce una cantidad válida.'
            });
            return;
        }

        const transaction = {
            type,
            amount,
            category,
            description
        };

        transactions.push(transaction);
        saveTransactions();
        renderTransactions();
        updateBalance();
        form.reset();

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La transacción ha sido registrada correctamente.'
        });
    });
});
