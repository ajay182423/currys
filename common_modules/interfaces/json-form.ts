import { IDropDown } from "./drop-down";

interface IJsonFormValidators {
  min?: number,
  max?: number,
  required?: boolean,
  requiredTrue?: boolean,
  email?: boolean,
  minLength?: boolean,
  maxLength?: boolean,
  pattern?: string,
  nullValidator?: boolean,
}
interface IJsonFormControlOptions {
  hidden?: boolean,
  fullWidth?: boolean,
  disabled?: boolean,
  singleSelectOptions?: IDropDown[],
  min?: string,
  max?: string,
  step?: string,
  icon?: string,
}

export interface IJsonFormControls {
  name: string,
  label: string,
  value: any,
  type: string,
  disabled: boolean,
  options?: IJsonFormControlOptions,
  validators: IJsonFormValidators
}

export interface IJsonFormOptions {
  formColumns?: number,
  formHeading?: string,
  primaryAction?: string,
  secondaryAction?: {
    makeItDelete?: boolean,
    show?: boolean,
    name?: string
  },
  formControls?: IJsonFormControls[],
  recordId?: any,
  service?: any
}