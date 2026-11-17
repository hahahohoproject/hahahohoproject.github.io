import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hahahohoproject.com',
  // 페이지를 wedding.html 같은 파일 하나로 내보낸다. GitHub Pages가 이 파일을 /wedding 주소로도 서빙하므로
  // 사이트는 확장자 없는 주소를 쓰고, 예전에 공유된 /wedding.html 링크도 그대로 열린다.
  build: { format: 'file' },
});
