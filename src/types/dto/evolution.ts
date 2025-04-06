/**
 * 진화 정보를 위한 DTO 인터페이스
 * API 응답 데이터를 파싱하여 UI에 표시하기 쉬운 형태로 변환한 데이터 구조
 */
export interface EvolutionDto {
  name: string; // 진화 이름
  title: string; // 진화 타이틀
  icon: string; // 아이콘 URL
  level: number; // 현재 레벨
  isActive: boolean; // 활성화 여부
}
