export interface ISection {

  id: number,
  section: string,
  weightage: number,
  isActive: boolean,
  createdOn: Date,
  updatedOn: Date,
  updatedBy: string,
  isConsildatedResult: boolean;
  isColumnRequired: any;

}
export interface isColumnRequired {
  id: number,
  name: string,
  isSelected: string
}
