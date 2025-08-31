// src/utils/avatarUtils.ts
// 미리 정의된 아바타 이미지 목록

export const AVATAR_OPTIONS = [
  { id: 1, name: 'Avatar 1', src: '/images/avatars/avatar1.png' },
  { id: 2, name: 'Avatar 2', src: '/images/avatars/avatar2.png' },
  { id: 3, name: 'Avatar 3', src: '/images/avatars/avatar3.png' },
  { id: 4, name: 'Avatar 4', src: '/images/avatars/avatar4.png' },
  { id: 5, name: 'Avatar 5', src: '/images/avatars/avatar5.png' },
  { id: 6, name: 'Avatar 6', src: '/images/avatars/avatar6.png' },
  { id: 7, name: 'Avatar 7', src: '/images/avatars/avatar7.png' },
  { id: 8, name: 'Avatar 8', src: '/images/avatars/avatar8.png' },
  { id: 9, name: 'Avatar 9', src: '/images/avatars/avatar9.png' },
] as const;

export type AvatarId = typeof AVATAR_OPTIONS[number]['id'];

/**
 * 아바타 ID로 이미지 경로를 가져오는 함수
 */
export function getAvatarSrc(avatarId: number | null | undefined): string {
  if (!avatarId) return AVATAR_OPTIONS[0].src; // 기본값
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
  return avatar ? avatar.src : AVATAR_OPTIONS[0].src;
}

/**
 * 기본 아바타 ID
 */
export const DEFAULT_AVATAR_ID = 1;
