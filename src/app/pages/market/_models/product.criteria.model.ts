import { SaleProduct } from './sale.product.model';
import { ProductChoiceCriteria } from '.';

export class ProductCriteria  {
    id?: number;
    label?: string;
    description?: string;
    userId?: string;
    product?: SaleProduct;
    choiceCriterion?: ProductChoiceCriteria[];
    isChoice ? = false;
    index?: number;
    editable ? = false;
    actionEdit ? = false;
    actionStore ? = false;
    choicePriority ?: boolean;
    canBechoicePriority ? = true;
}
