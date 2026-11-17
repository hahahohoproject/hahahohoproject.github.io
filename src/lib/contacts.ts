// 연락처·계좌 정보(src/data/contacts/*.json)를 표시 설정에 맞게 가공한다.
// 가공은 빌드할 때 일어나므로, 가리거나 끈 값은 배포되는 HTML에 들어가지 않는다.
// 단, JSON 파일 자체는 저장소에 있으므로 저장소가 공개라면 원본 값도 공개 상태다.

const PHONE_MODES = ['show', 'hide'] as const;
const ACCOUNT_MODES = ['show', 'mask', 'hide'] as const;

export type PhoneMode = (typeof PHONE_MODES)[number];
export type AccountMode = (typeof ACCOUNT_MODES)[number];

export interface Account {
  holder: string;
  number: string;
  bank: string;
}

/** JSON 파일의 모양. display 값은 JSON에서 문자열로 읽히므로 아래에서 검사한다. */
export interface ContactData {
  display: { phone: string; account: string };
  groups: { id: string; role: string; phone: string; accounts: Account[] }[];
}

/** 화면에 그릴 수 있게 가공된 묶음. phone이 null이면 문자·전화 버튼을 그리지 않는다. */
export interface ContactGroup {
  id: string;
  role: string;
  phone: string | null;
  accounts: Account[];
}

const VISIBLE_DIGITS = 4;

function parseMode<T extends string>(field: string, value: string, allowed: readonly T[]): T {
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(`연락처 설정 display.${field} 값이 "${value}"입니다. ${allowed.join(', ')} 중 하나여야 합니다.`);
}

/** 끝 4자리만 남기고 숫자를 *로 바꾼다. 하이픈 같은 구분자는 그대로 둔다. */
export function maskNumber(number: string): string {
  const digitCount = number.replace(/\D/g, '').length;
  let seen = 0;
  return number.replace(/\d/g, (digit) => (++seen > digitCount - VISIBLE_DIGITS ? digit : '*'));
}

/** 표시 설정을 적용한다. 보여 줄 것이 하나도 없는 묶음은 결과에서 빠진다. */
export function resolveContacts(data: ContactData): ContactGroup[] {
  const phoneMode = parseMode('phone', data.display.phone, PHONE_MODES);
  const accountMode = parseMode('account', data.display.account, ACCOUNT_MODES);

  return data.groups
    .map((group) => ({
      id: group.id,
      role: group.role,
      phone: phoneMode === 'show' ? group.phone : null,
      accounts:
        accountMode === 'hide'
          ? []
          : group.accounts.map((account) => ({
              ...account,
              number: accountMode === 'mask' ? maskNumber(account.number) : account.number,
            })),
    }))
    .filter((group) => group.phone !== null || group.accounts.length > 0);
}
