'use strict';

/////////////////////////////////////////////////
// BANK DATA
/////////////////////////////////////////////////
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Load custom accounts created from landing page
const savedCustomAccounts = JSON.parse(
  localStorage.getItem('bankist_custom_accounts') || '[]'
);
savedCustomAccounts.forEach(acc => {
  if (!accounts.some(existing => existing.username === acc.username)) {
    accounts.push(acc);
  }
});

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    if (!acc.username) {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    }
  });
};
createUsernames(accounts);

/////////////////////////////////////////////////
// ELEMENTS SELECTION
/////////////////////////////////////////////////
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const noticeBanner = document.querySelector('#noticeBanner');
const noticeText = document.querySelector('#noticeText');
const btnDismissNotice = document.querySelector('#btnDismissNotice');
const chipButtons = document.querySelectorAll('.btn--chip');

let currentAccount, timer;

/////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">Recent</div>
        <div class="movements__value">${mov.toLocaleString()}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = `${acc.balance.toLocaleString()}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${incomes.toLocaleString()}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toLocaleString()}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * (acc.interestRate || 1.2)) / 100)
    .filter(int => int >= 1)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// Set date
const now = new Date();
if (labelDate) {
  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const year = now.getFullYear();
  labelDate.textContent = `${day}/${month}/${year}`;
}

// Timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    if (labelTimer) labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.classList.remove('app--active');
    }

    time--;
  };

  let time = 300;
  tick();
  const timerId = setInterval(tick, 1000);
  return timerId;
};

const loginAccount = function (acc) {
  currentAccount = acc;

  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }!`;
  containerApp.classList.add('app--active');

  // Clear inputs
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();

  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  updateUI(currentAccount);
};

/////////////////////////////////////////////////
// EVENT HANDLERS
/////////////////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const user = inputLoginUsername.value.trim().toLowerCase();
  const pin = Number(inputLoginPin.value);

  const acc = accounts.find(a => a.username.toLowerCase() === user);

  if (acc && acc.pin === pin) {
    loginAccount(acc);
  } else {
    alert('Incorrect credentials! Try user "js" (PIN: 1111) or "jd" (PIN: 2222).');
  }
});

chipButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    const user = this.dataset.user;
    const pin = Number(this.dataset.pin);
    const acc = accounts.find(a => a.username === user && a.pin === pin);
    if (acc) loginAccount(acc);
  });
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentAccount) return;

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username.toLowerCase() === inputTransferTo.value.trim().toLowerCase()
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert('Invalid transfer amount or recipient user ID!');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentAccount) return;

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  } else {
    alert('Loan denied: Requires at least one deposit worth 10% of requested loan amount.');
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentAccount) return;

  if (
    inputCloseUsername.value.trim().toLowerCase() === currentAccount.username.toLowerCase() &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.classList.remove('app--active');
    labelWelcome.textContent = 'Log in to get started';
    if (timer) clearInterval(timer);
  } else {
    alert('Invalid username or PIN to close account!');
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (!currentAccount) return;
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnDismissNotice?.addEventListener('click', function () {
  if (noticeBanner) noticeBanner.style.display = 'none';
});

/////////////////////////////////////////////////
// AUTO-LOGIN FROM NEW REGISTRATION
/////////////////////////////////////////////////
const activeUser = localStorage.getItem('bankist_active_user');
if (activeUser) {
  const acc = accounts.find(
    a => a.username.toLowerCase() === activeUser.toLowerCase()
  );
  if (acc) {
    loginAccount(acc);
    if (noticeBanner && noticeText) {
      noticeText.innerHTML = `
        🎉 <strong>Account Created!</strong> Welcome, <strong>${acc.owner}</strong>!
        Your User ID: <strong style="color: #2b8a3e; font-size: 1.6rem; padding: 0.1rem 0.6rem; background: #fff; border-radius: 4px;">${acc.username}</strong>
        | PIN: <strong style="font-size: 1.6rem; padding: 0.1rem 0.6rem; background: #fff; border-radius: 4px;">${acc.pin}</strong>.
        Starting Balance: <strong>${acc.balance.toLocaleString()}€</strong>.
      `;
      noticeBanner.style.display = 'flex';
    }
  }
  localStorage.removeItem('bankist_active_user');
}
