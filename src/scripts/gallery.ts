// 사진 갤러리(썸네일 + 뷰어). 예전 jQuery 기반 Lens 템플릿 스크립트를 대체한다.
// 마크업과 클래스 이름은 기존 CSS(#gallery, #thumbnails, #viewer, body.fullscreen)에 맞춘다.

const SLIDE_DURATION = 100;
const SWIPE_BOUNDARY = 20;
const SWIPE_DELTA = 50;
// 썸네일 아래에 두는 여백. 기존 페이지와 같은 값이다.
const WRAPPER_PADDING = 150;

interface Slide {
  el: HTMLElement;
  image: HTMLElement;
  url: string;
  loaded: boolean;
}

export function initGallery(wrapper: HTMLElement): void {
  const main = wrapper.querySelector<HTMLElement>('#gallery');
  const thumbnails = wrapper.querySelector<HTMLElement>('#thumbnails');
  const viewer = wrapper.querySelector<HTMLElement>('#viewer');
  if (!main || !thumbnails || !viewer) return;

  const body = document.body;
  const xsmall = window.matchMedia('(max-width: 480px)');
  const medium = window.matchMedia('(max-width: 980px)');

  const slides: Slide[] = [];
  let current: number | null = null;
  let locked = false;

  // --- 크기 맞춤 ---

  const syncViewerHeight = () => {
    viewer.style.height = `${document.documentElement.clientHeight}px`;
  };
  const syncWrapperHeight = () => {
    const height = Math.max(document.documentElement.clientHeight, thumbnails.offsetHeight + WRAPPER_PADDING);
    wrapper.style.height = `${height}px`;
  };

  syncViewerHeight();
  syncWrapperHeight();
  new ResizeObserver(syncWrapperHeight).observe(thumbnails);

  // 모바일에서 주소창이 접히며 생기는 세로 변화에는 뷰어 높이를 건드리지 않는다.
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    syncWrapperHeight();
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    syncViewerHeight();
  });

  // --- 썸네일 패널 열고 닫기 ---

  const show = () => body.classList.remove('fullscreen');
  const hide = () => {
    body.classList.add('fullscreen');
    main.blur();
  };
  const toggle = () => (body.classList.contains('fullscreen') ? show() : hide());

  // --- 슬라이드 ---

  const unlockSoon = () => window.setTimeout(() => (locked = false), 100);

  const switchTo = (index: number, keepPanel = false) => {
    if (current === index && !xsmall.matches) return;
    if (locked) return;
    const next = slides[index];
    if (!next) return;

    locked = true;
    if (!keepPanel && medium.matches) hide();

    const previous = current !== null ? slides[current] : undefined;
    current = index;
    previous?.el.classList.remove('active');

    const attach = () => {
      previous?.el.remove();
      viewer.append(next.el);

      if (next.loaded) {
        window.setTimeout(() => {
          next.el.classList.add('active');
          unlockSoon();
        }, 100);
        return;
      }

      window.setTimeout(() => {
        next.el.classList.add('loading');
        const loader = new Image();
        loader.onload = () => {
          next.image.style.backgroundImage = `url("${next.url}")`;
          next.image.style.backgroundSize = 'contain';
          next.loaded = true;
          next.el.classList.remove('loading');
          next.el.classList.add('active');
          unlockSoon();
        };
        loader.onerror = () => {
          next.el.classList.remove('loading');
          unlockSoon();
        };
        loader.src = next.url;
      }, 100);
    };

    if (previous) window.setTimeout(attach, SLIDE_DURATION);
    else attach();
  };

  const step = (offset: number) => {
    if (current === null) return;
    switchTo((current + offset + slides.length) % slides.length);
  };

  thumbnails.querySelectorAll<HTMLAnchorElement>('a.thumbnail').forEach((thumbnail, index) => {
    const el = document.createElement('div');
    el.className = 'slide';
    const image = document.createElement('div');
    image.className = 'image';
    image.style.backgroundPosition = 'center';
    el.append(image);
    slides.push({ el, image, url: thumbnail.href, loaded: false });

    thumbnail.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (locked) thumbnail.blur();
      wrapper.scrollIntoView();
      switchTo(index);
    });
  });

  // --- 조작 ---

  for (const button of wrapper.querySelectorAll<HTMLElement>('.toggle')) {
    button.addEventListener('click', toggle);
    // 뷰어의 "탭하면 패널 숨김" 처리로 이벤트가 올라가지 않게 한다.
    button.addEventListener('touchend', (event) => event.stopPropagation());
  }
  viewer.querySelector('.nav-next')?.addEventListener('click', () => step(1));
  viewer.querySelector('.nav-previous')?.addEventListener('click', () => step(-1));

  viewer.addEventListener('touchend', () => {
    if (medium.matches) hide();
  });

  // 가로 스와이프. onSwipe는 손가락이 움직인 방향(-1 왼쪽, 1 오른쪽)을 받는다.
  const watchSwipe = (el: HTMLElement, enabled: () => boolean, onSwipe: (direction: -1 | 1) => void) => {
    let start: { x: number; y: number } | null = null;

    el.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.touches[0];
        start = enabled() && touch ? { x: touch.pageX, y: touch.pageY } : null;
      },
      { passive: true },
    );

    el.addEventListener(
      'touchmove',
      (event) => {
        const touch = event.touches[0];
        if (!start || !touch) return;
        const diffX = start.x - touch.pageX;
        const diffY = start.y - touch.pageY;

        if (Math.abs(diffY) < SWIPE_BOUNDARY && Math.abs(diffX) > SWIPE_DELTA) {
          onSwipe(diffX > 0 ? -1 : 1);
          start = null;
          return;
        }

        // 스크롤 끝에서 바깥 페이지가 끌려가는 것을 막는다.
        const remaining = el.scrollHeight - el.scrollTop;
        const atTop = el.scrollTop <= 0 && diffY < 0;
        const atBottom = Math.abs(remaining - el.offsetHeight) < 2 && diffY > 0;
        if ((atTop || atBottom) && event.cancelable) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { passive: false },
    );
  };

  watchSwipe(
    viewer,
    () => true,
    (direction) => step(direction === -1 ? 1 : -1),
  );
  // 썸네일 패널은 오른쪽에 붙어 있으므로 오른쪽으로 밀면 닫힌다.
  watchSwipe(
    main,
    () => !xsmall.matches,
    (direction) => {
      if (direction === 1) hide();
    },
  );

  // 키보드는 갤러리가 화면에 보일 때만 받는다. 위/아래/스페이스는 페이지 스크롤에 양보한다.
  let inView = false;
  new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
  }).observe(wrapper);

  window.addEventListener('keydown', (event) => {
    // 다른 곳(예: 사이드 메뉴 닫기)에서 이미 처리한 키는 건너뛴다.
    if (!inView || xsmall.matches || event.defaultPrevented) return;
    if (event.target instanceof Element && event.target.closest('input, select, textarea, video')) return;
    if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'Escape') toggle();
    else return;
    event.preventDefault();
  });

  // 가장 좁은 화면에서는 썸네일을 누르기 전까지 뷰어를 비워 둔다.
  const showFirst = () => {
    if (!xsmall.matches && current === null) switchTo(0, true);
  };
  showFirst();
  xsmall.addEventListener('change', showFirst);
}
