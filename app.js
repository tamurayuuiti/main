// DOM要素取得
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');
const appList = document.getElementById('appList');
const appFrame = document.getElementById('appFrame');
const header = document.querySelector('header');
const iframe = document.querySelector('iframe');

// アプリ切り替え処理（GAトラッキング付き）
function switchApp(appId) {
  const appPath = `Apps/${appId}/index.html`;
  const virtualPath = `/app/${appId}`;

  gtag('config', 'G-QZR5YW62PM', {
    page_path: virtualPath,
  });

  gtag('event', 'app_switch', {
    event_category: 'Navigation',
    event_label: appId,
  });

  appFrame.src = appPath;
  appFrame.dataset.appName = appId;
}

// iframeからの計算イベント受信（postMessage）
window.addEventListener('message', (event) => {
  if (event.data?.type === 'calculation') {
    const currentApp = appFrame.dataset.appName || 'Unknown';

    gtag('event', 'calculate', {
      event_category: 'Usage',
      event_label: currentApp,
    });

    console.log(`✅ 計算実行 tracked: ${currentApp}`);
  }
});

// アプリ一覧（ID＝ディレクトリ名）
const apps = [
  { id: 'Exponentiation', name: '累乗計算機' },
  { id: 'Prime_factorization', name: '素因数分解計算機' },
];

// サイドメニューにアプリリストを追加
apps.forEach(app => {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.textContent = app.name;
  button.onclick = () => {
    switchApp(app.id);
    setTimeout(() => {
      closeMenu();
    }, 10);
    button.blur();
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

function updateHeaderHeight() {
  const actualHeight = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', `${actualHeight - 2}px`);
}

// iframeの高さ調整
function adjustIframe() {
  const headerHeight = header.offsetHeight;
  iframe.style.marginTop = `${headerHeight}px`;
  iframe.style.height = `calc(100vh - ${headerHeight}px)`;
}

window.addEventListener('load', adjustIframe);
window.addEventListener('load', updateHeaderHeight);
window.addEventListener('resize', adjustIframe);
window.addEventListener('resize', updateHeaderHeight);
