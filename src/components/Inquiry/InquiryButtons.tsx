'use client';
import { useState } from 'react';
import styles from './InquiryButtons.module.scss';
import InquiryModal from './InquiryModal';

export const KakaoInquiry = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <span className={styles.inquiry} onClick={() => setShowModal(true)}>
        1:1 문의
      </span>
      <span
        className={styles.inquiry}
        onClick={() => window.open('https://open.kakao.com/o/sEEke3qh', '_blank')}
      >
        오픈채팅
      </span>

      {showModal && <InquiryModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default KakaoInquiry;
