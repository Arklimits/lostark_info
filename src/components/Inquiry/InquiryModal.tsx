'use client';

import styles from './InquiryModal.module.scss';
import { useState } from 'react';
import axios from 'axios';

type Props = {
  onClose: () => void;
};

const InquiryModal = ({ onClose }: Props) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/webhook/discord', { content, author });
      alert('문의가 접수되었습니다. 감사합니다.');
      onClose();
    } catch (err) {
      alert('문의 전송에 실패했습니다.');
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="문의하실 내용을 입력해주세요."
        />
        <div className={styles.actions}>
          <input
            className={styles.input}
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="작성자"
          />
          <button className={styles.button} onClick={onClose}>
            취소
          </button>
          <button className={styles.button} onClick={handleSubmit}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
