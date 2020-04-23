export class SaleDetails  {
    id?: number;
    label?: string;
    descritpion?: string;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: SaleDetails[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: SaleDetails;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
}
