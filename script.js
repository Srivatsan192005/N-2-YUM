// Function to navigate between pages
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = page.id === pageId ? 'block' : 'none';
  });
}

// Navigate to the menu page
function navigateToMenu(menuPageId, origin) {
  sessionStorage.setItem('origin', origin);
  showPage(menuPageId);
}

// Collect items with quantities and go to token page
function goToTokenPage(menuPageId, origin) {
  const selectedItems = [];
  const items = document.querySelectorAll(`#${menuPageId} ul li`);

  items.forEach(item => {
    const itemName = item.textContent.split(' ')[0];
    const quantityInput = item.querySelector('input[type="number"]');
    const quantity = parseInt(quantityInput.value);

    if (quantity > 0) {
      selectedItems.push(`${itemName}: ${quantity}`);
    }
  });

  // Store selected items and origin in sessionStorage
  sessionStorage.setItem('selectedItems', selectedItems.join(', '));
  sessionStorage.setItem('origin', origin);

  showPage('tokenPage');
}

// Send token and add order to the table
function sendToken() {
  const token = document.getElementById('tokenInput').value;
  const selectedItems = sessionStorage.getItem('selectedItems') || '';
  const origin = sessionStorage.getItem('origin');

  const order = {
    token,
    items: selectedItems,
    origin,
    status: 'Preparing'
  };

  // Get orders from localStorage or initialize empty array
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Display the updated table
  displayOrders();
  showPage('orderTablePage');
}

// Display orders in the table
function displayOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const tableBody = document.getElementById('orderTableBody');
  tableBody.innerHTML = '';

  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.token}</td>
      <td>${order.items}</td>
      <td>${order.origin}</td>
      <td>${order.status}</td>
      <td><button onclick="markAsDone('${order.token}')">Done</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Mark order as done
function markAsDone(token) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const updatedOrders = orders.map(order => {
    if (order.token === token) {
      order.status = 'Prepared';
    }
    return order;
  });

  // Save updated orders to localStorage
  localStorage.setItem('orders', JSON.stringify(updatedOrders));

  // Refresh the table
  displayOrders();
}

// Refresh orders (clear all orders)
function refreshOrders() {
  localStorage.removeItem('orders');
  displayOrders();
}

// Go to home and reset input fields, not affecting the order status
function goHomeAndClearData() {
  // Clear the quantities and orders from sessionStorage
  sessionStorage.removeItem('selectedItems');
  sessionStorage.removeItem('origin');

  // Clear token input on the token page
  document.getElementById('tokenInput').value = '';

  // Clear quantity inputs from menu pages
  const quantityInputs = document.querySelectorAll('input[type="number"]');
  quantityInputs.forEach(input => {
    input.value = 0;
  });

  // Go back to the home page
  showPage('homePage');
}
