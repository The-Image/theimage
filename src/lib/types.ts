export interface PricingOption {
  name: string;
  heading: string,
  note: string,
  link?: string,
  selectable: boolean,
  selected: boolean,
  value: number,
  valueText?: string,
}