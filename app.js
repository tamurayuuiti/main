function switchApp(appName) {
  const appPath = `Apps/${appName}/index.html`;
  const virtualPath = `/app/${appName}`; // 仮想パスとして記録

  // 仮想ページビューを送信
  gtag('config', 'G-QZR5YW62PM', {
    page_path: virtualPath
  });

  // 任意：切り替えイベントも送信
  gtag('event', 'app_switch', {
    event_category: 'Navigation',
    event_label: appName
  });

  // アプリ切り替え
  document.getElementById('appFrame').src = appPath;
}

const apps = [
  { name: '累乗計算機', path: 'Apps/Exponentiation/index.html' },
  { name: '素因数分解計算機', path: 'Apps/Prime_factorization/index.html' },
];

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const appList = document.getElementById('appList');
const appFrame = document.getElementById('appFrame');
const header = document.querySelector('header');
const iframe = document.querySelector('iframe');

// アプリリスト生成
apps.forEach(app => {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.textContent = app.name;
  button.onclick = () => {
    appFrame.src = app.path;
    closeMenu();
  };
  li.appendChild(button);
  appList.appendChild(li);
});

// メニュー制御
menuToggle.onclick = () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
};

overlay.onclick = () => {
  closeMenu();
};

function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

function adjustIframe() {
  const headerHeight = header.offsetHeight;
  iframe.style.marginTop = `${headerHeight}px`;
  iframe.style.height = `calc(100vh - ${headerHeight}px)`;
}

window.addEventListener('resize', adjustIframe);
window.addEventListener('load', adjustIframe);
