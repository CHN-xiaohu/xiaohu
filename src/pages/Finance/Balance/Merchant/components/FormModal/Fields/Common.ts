export enum formTypes {
  chargeMoney = 'chargeMoney',
  deductMoney = 'deductMoney',
  prohibitWithdrawal = 'prohibitWithdrawal',
  restoretWithdrawal = 'restoretWithdrawal',
}

export const typeOptions = [
  { value: 2, label: '钱包' },
  { value: 1, label: '储值卡' },
];

export const cashTypeValueSchema = {
  type: 'radioGroup',
  enum: typeOptions,
  required: true,
};
