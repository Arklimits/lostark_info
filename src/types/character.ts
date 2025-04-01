export interface Stat {
  Type: string;
  Value: string;
}

export interface Tendency {
  Type: string;
  Point: number;
  MaxPoint: number;
}

export interface ArmoryProfile {
  CharacterImage: string;
  CharacterName: string;
  CharacterClassName: string;
  ServerName: string;
  CharacterLevel: number;
  ItemAvgLevel: string;
  ExpeditionLevel: number;
  PvpGradeName: string;
  Stats: Stat[];
  Tendencies: Tendency[];
}

export interface ArmoryEquipment {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string;
}

export interface CharacterData {
  ArmoryProfile: ArmoryProfile;
  ArmoryEquipment: ArmoryEquipment[];
  ArmoryEngraving: {
    Effects: {
      Icon: string;
      Name: string;
      Description: string;
    }[];
  };
};