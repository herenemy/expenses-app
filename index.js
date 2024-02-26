'use strict';

let total = 10000;
const STATUS_IN_LIMIT = 'все хорошо';
const STAUTS_OUT_OF_LIMIT = 'все плохо';
const STATUS_OUT_OF_LIMIT_CLASS = 'expenses-status_bad';

const inputNode = document.querySelector('.js-expenses-input');
const expenseCategoryNode = document.getElementById('js-expense-category');
const btnInputNode = document.querySelector('.js-expenses-btn');
const totalExpensesNode = document.getElementById('expenses-sum-value');
const expensesContainerNode = document.querySelector('.expenses-container');
const expensesLimitNode = document.getElementById('expenses-limit');
const expensesStatusNode = document.querySelector('.js-expenses-status');

const popupInputNode = document.querySelector('.popup-input');
const popupBtnNode = document.querySelector('.popup-btn');
const btnOpenPopupNode = document.querySelector('.btn-popup__open');
const btnClosePopupNode = document.querySelector('.popup-close__btn');
const popup = document.querySelector('.js-popup');
const popupContentNode = document.querySelector('.popup__content');
const btnResetHistoryNode = document.querySelector('.js-btn__reset');

let expenses = [];
let totalExpenses = 0;
let expensesData = [];
let expensesValue = 0;

init();
validation();

// Event Listeners
inputNode.addEventListener('input', validation);

popupInputNode.addEventListener('input', limitValidation);

btnInputNode.addEventListener('click', function () {
  getValueFromUser();
  calcExpenses(expenses);
  saveExpensesData(expensesData);
  outOfLimit();
  renderExpenses();
  inputNode.value = '';
  validation();
});

popupBtnNode.addEventListener('click', function () {
  validation();
  getLimitFromUser();
  saveExpensesData(expensesData);
  outOfLimit();
  updateLimit();
  closePopup();
});

btnOpenPopupNode.addEventListener('click', function () {
  openPopup();
  limitValidation();
});

btnClosePopupNode.addEventListener('click', closePopup);
document.addEventListener('keydown', function (e) {
  if (e.key == 'Escape') {
    closePopup();
  }
});

popup.addEventListener('click', function (e) {
  const isClickedOutsideContent = !e.composedPath().includes(popupContentNode);
  if (isClickedOutsideContent) closePopup();
});

btnResetHistoryNode.addEventListener('click', resetHistory);

function init() {
  expensesLimitNode.innerHTML = `${total} Руб.`;
  totalExpensesNode.innerText = '0 Руб.';
  expensesStatusNode.innerText = `${STATUS_IN_LIMIT} (${
    total - totalExpenses
  } до лимита)`;
}

function validation() {
  if (!inputNode.value || inputNode.value == 0) {
    btnInputNode.disabled = true;
    btnInputNode.style.opacity = '0.5';
  } else {
    btnInputNode.disabled = false;
    btnInputNode.style.opacity = '1';
  }
}

function limitValidation() {
  if (!popupInputNode.value || popupInputNode.value == 0) {
    popupBtnNode.disabled = true;
    popupBtnNode.style.opacity = '0.5';
  } else {
    popupBtnNode.disabled = false;
    popupBtnNode.style.opacity = '1';
  }
}

function getValueFromUser() {
  const expense = +inputNode.value;
  const category = expenseCategoryNode.value;
  expensesData.push(expense);

  const expensesObj = {
    expenseSum: expense,
    expenseCategory: category,
  };

  expenses.push(expensesObj);
}

function calcExpenses(expenses) {
  expenses.forEach(item => {
    totalExpenses += item.expenseSum;
  });

  totalExpensesNode.innerHTML = `${totalExpenses} Руб.`;
}

function saveExpensesData(expenses) {
  expensesValue = expenses.reduce((acc, item) => acc + item, 0);
}

function outOfLimit() {
  if (expensesValue > total) {
    expensesStatusNode.classList.add('expenses-status_bad');
    expensesStatusNode.innerText = `${STAUTS_OUT_OF_LIMIT} (-${
      expensesValue - total
    } руб)`;
  } else {
    expensesStatusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASS);
    expensesStatusNode.innerText = `${STATUS_IN_LIMIT} (${
      total - expensesValue
    } до лимита)`;
  }
}

function renderExpenses() {
  let valuesHTML = '';

  expenses.forEach((value, index) => {
    valuesHTML = `
      <div class="expenses-value">${index + 1}. ${value.expenseSum} Руб.${
      expenseCategoryNode.value ? ` - ${value.expenseCategory}` : ''
    }</div>
    `;
  });

  expensesContainerNode.innerHTML += valuesHTML;
  totalExpenses = 0;
}

function openPopup() {
  popup.classList.add('popup_open');
}

function closePopup() {
  popup.classList.remove('popup_open');
  popupInputNode.value = '';
}

function getLimitFromUser() {
  const limit = popupInputNode.value;
  total = limit;
}

function updateLimit() {
  expensesLimitNode.innerHTML = `${total} Руб.`;
}

function resetHistory() {
  totalExpenses = 0;
  expensesValue = 0;
  expensesContainerNode.innerHTML = '';
  expensesStatusNode.innerText = STATUS_IN_LIMIT;
  totalExpensesNode.innerText = '0 Руб.';
  inputNode.value = '';
  expenses = [];
  expensesData = [];
  outOfLimit();
}
