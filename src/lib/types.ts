export interface PricingOption {
  option: string,
  note: string,
  link?: string,
  selectable: boolean,
  selected: boolean,
  value: number,
  valueText?: string,
}