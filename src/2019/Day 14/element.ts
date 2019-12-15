export interface IElement {
  name: string;
  units: number;
  producedBy?: IElement[];
}

export class Element implements IElement {
  constructor(
    public name: string,
    public units: number,
    public producedBy?: IElement[]
  ) {}
}

export interface IElementProduction {
  element: IElement;
  remainingUnits: number;
}

export class ElementProduction implements IElementProduction {
  constructor(public element: IElement, public remainingUnits: number) {}
}
