// 예전 방명록(GitHub Issues)을 정적 JSON으로 내보낸다.
// 열린 이슈 = 방명록 글, 저장소 소유자의 이슈 댓글 = 답글, 닫힌 이슈 = 삭제된 글.
// 사용법: npm run export:guestbook
// 공개 저장소라 토큰 없이 동작한다. 요청 한도에 걸리면 GITHUB_TOKEN 환경변수를 주면 된다.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'hahahohoproject';
const SOURCES = [{ event: 'wedding', repo: 'hahahohoproject.github.io' }];

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/guestbook');

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'guestbook-export',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function getAll(path) {
  const items = [];
  for (let page = 1; ; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`https://api.github.com${path}${sep}per_page=100&page=${page}`, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
    const batch = await res.json();
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}

for (const { event, repo } of SOURCES) {
  const issues = (await getAll(`/repos/${OWNER}/${repo}/issues?state=open`)).filter(
    (issue) => !issue.pull_request,
  );

  const entries = [];
  for (const issue of issues) {
    const replies =
      issue.comments > 0
        ? (await getAll(`/repos/${OWNER}/${repo}/issues/${issue.number}/comments`))
            .filter((comment) => comment.user.login === OWNER)
            .map((comment) => ({ body: comment.body ?? '', createdAt: comment.created_at }))
        : [];

    entries.push({
      id: issue.number,
      name: issue.title,
      body: issue.body ?? '',
      createdAt: issue.created_at,
      // 사이트 폼이 아니라 GitHub에서 직접 남긴 글이면 작성자 계정을 표시한다.
      githubUser: issue.user.login === OWNER ? null : issue.user.login,
      replies,
    });
  }

  entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  await mkdir(outDir, { recursive: true });
  const file = resolve(outDir, `${event}.json`);
  await writeFile(file, JSON.stringify(entries, null, 2) + '\n');
  console.log(`${event}: ${entries.length}건 → ${file}`);
}
