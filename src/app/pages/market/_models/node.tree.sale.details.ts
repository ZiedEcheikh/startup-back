import { Sale } from './sale.model';
import { SaleDetails } from './sale.details.model';

export class NodeTreeSaleDetails  {
    id?: number;
    label?: string;
    descritpion?: string;
    detailsProducts: boolean;
    detailsWithProducts: boolean;
    data?: any;
    icon?: any;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: NodeTreeSaleDetails[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: NodeTreeSaleDetails;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
}
