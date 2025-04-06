import breakerData from './anihc/breakerData';
import soulEaterData from './delain/soulEaterData';
import warlordData from './shushire/warlordData';
import berserkerData from './shushire/berserkerData';
import destroyerData from './shushire/destroyerData';
import holyknightData from './shushire/holyknightData';
import slayerData from './shushire/slayerData';
import soulMasterData from './anihc/soulMasterData';
import battleMasterData from './anihc/battleMasterData';
import strikerData from './anihc/strikerData';
import infighterData from './anihc/infighterData';
import lanceMasterData from './anihc/lanceMasterData';
import gunslingerData from './ardetain/gunslingerData';
import devilHunterData from './ardetain/devilHunterData';
import blasterData from './ardetain/blasterData';
import scouterData from './ardetain/scouterData';
import hawkEyeData from './ardetain/hawkEyeData';
import bardData from './silin/bardData';
import summonerData from './silin/summonerData';
import sorcererData from './silin/sorcererData';
import arcanaData from './silin/arcanaData';
import demonicData from './delain/demonicData';
import reaperData from './delain/reaperData';
import bladeData from './delain/bladeData';
import weatherArtistData from './yoz/weatherArtistData';
import painterData from './yoz/painterData';
import druidData from './yoz/druidData';

export const arkPassiveData = {
  워로드: warlordData,
  버서커: berserkerData,
  디스트로이어: destroyerData,
  홀리나이트: holyknightData,
  슬레이어: slayerData,
  기공사: soulMasterData,
  배틀마스터: battleMasterData,
  스트라이커: strikerData,
  브레이커: breakerData,
  인파이터: infighterData,
  창술사: lanceMasterData,
  건슬링어: gunslingerData,
  데빌헌터: devilHunterData,
  블래스터: blasterData,
  스카우터: scouterData,
  호크아이: hawkEyeData,
  바드: bardData,
  서머너: summonerData,
  소서리스: sorcererData,
  아르카나: arcanaData,
  데모닉: demonicData,
  리퍼: reaperData,
  블레이드: bladeData,
  소울이터: soulEaterData,
  기상술사: weatherArtistData,
  도화가: painterData,
  환수사: druidData,
};

export function getArkPassiveDataByClass(className: string) {
  return arkPassiveData[className as keyof typeof arkPassiveData];
}
