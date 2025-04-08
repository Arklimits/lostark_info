'use client';

import { ArmoryEngraving } from '@/types/character';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import axios from 'axios';
import styles from './EngravingTable.module.scss';

export default function EngravingTable({ engraving }: { engraving: ArmoryEngraving }) {
  const engravings = useMemo(
    () => engraving.ArkPassiveEffects.map(effect => effect.Name),
    [engraving.ArkPassiveEffects]
  );
  const [engravingImages, setEngravingImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchEngravingImages = async () => {
      try {
        const response = await axios.get(`/api/info/engraving?names=${engravings.join(',')}`);
        setEngravingImages(response.data.image);
      } catch (error) {
        console.error('Failed to fetch engraving images:', error);
      }
    };

    if (engravings.length > 0) {
      fetchEngravingImages();
    }
  }, [engravings]);

  return (
    <div className={styles.engravingTable}>
      {engraving.ArkPassiveEffects.map((effect, index) => (
        <div key={index} className={styles.item}>
          <Image
            key={index}
            src={engravingImages[index] || '/ico/ico-noImage.png'}
            alt={effect.Name}
            width={40}
            height={40}
            className={styles.engravingImg}
          />
          <div className={styles.engravingName}>{effect.Name}</div>
          <div className={styles.engravingLevelContainer}>
            {(() => {
              if (effect.Grade === '유물' && effect.Level === 0) {
                return [...Array(4)].map((_, i) => (
                  <div key={i} className={styles.engravingLevel} data-grade="전설" />
                ));
              } else if (effect.Grade === '전설' && effect.Level === 0) {
                return [...Array(4)].map((_, i) => (
                  <div key={i} className={styles.engravingLevel} data-grade="영웅" />
                ));
              } else {
                return [...Array(effect.Level)].map((_, i) => (
                  <div key={i} className={styles.engravingLevel} data-grade={effect.Grade} />
                ));
              }
            })()}
          </div>
          <div className={styles.engravingStoneContainer}>
            {effect.AbilityStoneLevel > 0 && (
              <>
                <Image
                  key={index}
                  src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_ability_stone_symbol.png"
                  alt="engravingStone"
                  width={16}
                  height={26}
                />
                <span>Lv. {effect.AbilityStoneLevel}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
