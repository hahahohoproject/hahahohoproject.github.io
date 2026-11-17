// 초대장 페이지 공통 동작. 예전 jQuery 플러그인(scrollex, scrolly, breakpoints, browser)을 대체한다.

const body = document.body;
const header = document.getElementById('header');
const banner = document.getElementById('banner');

// 진입 애니메이션: 기존 CSS가 body.is-preload 동안 전환을 멈춰 둔다.
window.setTimeout(() => body.classList.remove('is-preload'), 500);

// 기존 CSS는 body.is-mobile 여부로 배경 처리 방식을 바꾼다.
const touchDevice =
  /Android|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const narrowScreen = window.matchMedia('(max-width: 980px)');
const syncMobileClass = () => body.classList.toggle('is-mobile', touchDevice || narrowScreen.matches);
syncMobileClass();
narrowScreen.addEventListener('change', syncMobileClass);

// 배너가 화면에 있는 동안만 헤더를 투명(.alt)하게 둔다.
if (header && banner && header.classList.contains('alt')) {
  let queued = false;
  const syncHeader = () => {
    queued = false;
    header.classList.toggle('alt', banner.getBoundingClientRect().bottom > header.offsetHeight + 1);
  };
  const requestSync = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(syncHeader);
  };
  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync);
  syncHeader();
}

// .scrolly 링크: 고정 헤더 높이만큼 비우고 부드럽게 이동한다.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
for (const link of document.querySelectorAll<HTMLAnchorElement>('a.scrolly[href^="#"]')) {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0);
    window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
}
