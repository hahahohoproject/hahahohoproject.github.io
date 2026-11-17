// 장소 정보(src/data/places/*.json)를 표시 설정에 맞게 가공한다.
// 연락처와 마찬가지로 빌드할 때 적용되므로, 끈 주소는 배포되는 HTML에 들어가지 않는다.
// 단, JSON 파일 자체는 저장소에 있으므로 저장소가 공개라면 원본 값도 공개 상태다.

import { parseDisplayMode } from './display';

const ADDRESS_MODES = ['show', 'hide'] as const;

export interface PlaceAddress {
  complex: string;
  unit: string;
  directions: string[];
  /** 지도에 찍을 좌표. 위치를 그대로 드러내므로 주소와 함께 켜고 끈다. */
  map: { lat: number; lng: number };
}

/** JSON 파일의 모양. */
export interface PlaceData {
  display: { address: string };
  name: string;
  address: PlaceAddress;
}

/** 화면에 그릴 수 있게 가공된 장소. address가 null이면 이름만 보여 준다. */
export interface Place {
  name: string;
  address: PlaceAddress | null;
}

export function resolvePlace(data: PlaceData): Place {
  const mode = parseDisplayMode('장소', 'address', data.display.address, ADDRESS_MODES);
  return { name: data.name, address: mode === 'show' ? data.address : null };
}
