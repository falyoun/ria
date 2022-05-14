export enum LeaveCategoryEnum {
  PERSONAL = 'personal',
  UNIVERSITY = 'university',
  SICK = 'sick',
}

export const LeavesDeductionsMap: Map<LeaveCategoryEnum, number> = new Map([
  [LeaveCategoryEnum.PERSONAL, 100],
  [LeaveCategoryEnum.UNIVERSITY, 50],
  [LeaveCategoryEnum.SICK, 0],
]);
