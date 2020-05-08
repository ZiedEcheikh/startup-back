import { SaleProduct } from '.';
import { Sale } from './sale.model';

export class SaleDetails {
    id: number;
    label: string;
    description: string;
    products?: SaleProduct[];
    children?: SaleDetails[];
    sale?: Sale;
    parent?: SaleDetails;
    detailsProducts: boolean;
    detailsWithProducts: boolean;
}
