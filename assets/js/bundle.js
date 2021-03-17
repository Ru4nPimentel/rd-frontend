const selector = (selector) => document.querySelector(selector);
const create = (element) => document.createElement(element);

const app = selector('#app');

const Login = create('div');
Login.classList.add('login');

const Logo = create('img');
Logo.src = './assets/images/logo.svg';
Logo.classList.add('logo');

const Form = create('form');

Form.onsubmit = async (e) => {
  e.preventDefault();

  const [email, password] = e.srcElement;

  const { url } = await fakeAuthenticate(email.value, password.value);

  location.href = '#users';

  console.log(url);

  const users = await getDevelopersList(url);
  console.log(users);
  renderPageUsers(users);
};

Form.oninput = (e) => {
  const [email, password, button] = e.target.parentElement.children;
  !email.validity.valid || !email.value || password.value.length <= 5
    ? button.setAttribute('disabled', 'disabled')
    : button.removeAttribute('disabled');
};

Form.innerHTML = ` 
  <input type="email" class="login_input" id="email" name="email" placeholder="Entre com seu e-mail" required>
  <input type="password" class="login_input" id="password" name="password" placeholder="Digite sua senha supersecreta" required>
  <button type="submit" class="login_button" disabled="disabled"> Entrar </button>`;

app.appendChild(Logo);
Login.appendChild(Form);

async function fakeAuthenticate(email, password) {
  response = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6');
  data = await response.json();

  const fakeJwtToken = `${btoa(email + password)}.${btoa(data.url)}.${
    new Date().getTime() + 300000
  }`;

  localStorage.setItem('token', fakeJwtToken);
  return data;
}

async function getDevelopersList(url) {
  response = await fetch(url);
  data = await response.json();
  return data;
}

function renderPageUsers(users) {
  app.classList.add('logged');
  Login.style.display = 'none';

  const Ul = create('ul');
  Ul.classList.add('container');

  users.map((user, index) => {
    let li = create('li');
    li.classList.add('list_contributors');
    li.innerHTML = ` 
    <a href="${user.html_url}" target="_blank" style="animation-delay:${
      index * 0.15
    }s">
      <img src="${user.avatar_url}"/> 
      <span>  ${user.login}</span>
    </a> `;
    Ul.appendChild(li);
  });
  app.appendChild(Ul);
}

// init
(async function () {
  const rawToken = localStorage.getItem('token') || null;
  const token = rawToken ? rawToken.split('.') : null;
  if (!token || token[2] < new Date().getTime()) {
    localStorage.removeItem('token');
    location.href = '#login';
    app.appendChild(Login);
  } else {
    location.href = '#users';
    const users = await getDevelopersList(atob(token[1]));
    renderPageUsers(users);
  }
})();
