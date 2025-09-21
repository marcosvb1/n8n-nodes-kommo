import { IDisplayOptions } from 'n8n-workflow';
import { ITransactionsProperties } from '../../interfaces';
import { addLimitDescription } from '../../_components/LimitDescription';
import { addPageDescription } from '../../_components/PageDescription';
import { addReturnAll } from '../../_components/ReturnAllDescription';

const displayOptions: IDisplayOptions | undefined = {
  show: {
    resource: ['transactions'],
    operation: ['getTransactions'],
  },
};

export const description: ITransactionsProperties = [
  addReturnAll(displayOptions),
  {
    displayName: 'Customer ID',
    name: 'customer_id',
    type: 'number',
    default: 0,
    description: 'Filter by customer ID (optional)',
    displayOptions,
  },
  {
    displayName: 'Simplify Output',
    name: 'simplify',
    type: 'boolean',
    default: true,
    description: 'Whether to return only the transactions array instead of the full response',
    displayOptions,
  },
  addPageDescription({ show: { ...displayOptions.show, returnAll: [false] } }),
  addLimitDescription(displayOptions),
];


