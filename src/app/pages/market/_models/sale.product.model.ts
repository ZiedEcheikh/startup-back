import { SaleDetails } from './sale.details.model';
import { Sale } from './sale.model';

export class SaleProduct  {
    id: number;
    label: string;
    description?: string;
    price?: number;
    percentage?: number;
    stock?: number;
    saleParentId?: number;
    userId?: string;
    saleDetailsParent?: SaleDetails;
    saleParent?: Sale;
    index?: number;
    editable ? = false;
    actionEdit ? = false;
    actionStore ? = false;
}
