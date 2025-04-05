export interface Stat {
  Type: string;
  Value: number;
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

export interface ArmoryEngraving {
  ArkPassiveEffects: {
    Grade: string;
    Level: number;
    Name: string;
    Description: string;
  }[];
}

export interface ArmorySkill {
  Name: string;
  Icon: string;
  Level: number;
  Type: string;
  SkillType: number;
  Tripods: {
    Tier: number;
    Slot: number;
    Name: string;
    Icon: string;
    Level: number;
    IsSelected: boolean;
    ToolTip: string;
  }[];
  Rune: {
    Name: string;
    Icon: string;
    Grade: string;
    ToolTip: string;
  };
  Tooltip: string;
}

export interface Skill extends ArmorySkill {
  coefficient: number;
  constant: number;
  cooltime: number;
  casttime: number;
}

export interface ArkPassiveEffect {
  Effects: {
    Name: string;
    Description: string;
    Icon: string;
    Tooltip: string;
  }[];
}

export interface ArmoryGem {
  Gems: {
    Name: string;
    Icon: string;
    Level: number;
    Grade: string;
    Tooltip: string;
  }[];
}

export interface CharacterData {
  ArmoryProfile: ArmoryProfile;
  ArmoryEquipment: ArmoryEquipment[];
  ArmoryEngraving: ArmoryEngraving;
  ArmorySkills: ArmorySkill[];
  ArkPassiveEffect: ArkPassiveEffect[];
  ArmoryGem: ArmoryGem;
}
