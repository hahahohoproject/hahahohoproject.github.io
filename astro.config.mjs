import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.hahahohoproject.com',
  // 이미 공유된 /wedding.html, /dowon.html 주소를 그대로 유지한다.
  build: { format: 'file' },
});
