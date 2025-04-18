/**
 * 진화 정보를 위한 DTO 인터페이스
 * API 응답 데이터를 파싱하여 UI에 표시하기 쉬운 형태로 변환한 데이터 구조
 */
export interface ArkPassiveDto {
  name: string; // 아크패시브 이름
  title: string; // 아크패시브 타이틀
  icon: string; // 아이콘 URL
  level: number; // 현재 레벨
  isActive: boolean; // 활성화 여부
}
