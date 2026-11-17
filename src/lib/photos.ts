import type { ImageMetadata } from 'astro';

/**
 * import.meta.glob(..., { eager: true })로 모은 사진을 파일 이름 순서로 정렬한다.
 * 숫자를 숫자로 비교하므로 2p.jpg가 10p.jpg보다 앞에 온다.
 */
export function sortPhotos(modules: Record<string, { default: ImageMetadata }>): ImageMetadata[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, module]) => module.default);
}
