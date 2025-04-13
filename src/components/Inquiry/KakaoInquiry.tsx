'use client';
import styles from './KakaoInquiry.module.scss';
export const KakaoInquiry = () => {
  return (
    <span
      className={styles.inquiry}
      onClick={() => window.open('https://open.kakao.com/o/sEEke3qh', '_blank')}
    >
      1:1 문의
    </span>
  );
};

export default KakaoInquiry;
