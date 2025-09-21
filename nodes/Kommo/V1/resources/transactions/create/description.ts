import { IDisplayOptions } from 'n8n-workflow';
import { ITransactionsProperties } from '../../interfaces';
import { addJsonParametersDescription } from '../../_components/JsonParametersDescription';

const displayOptions: IDisplayOptions | undefined = {
  show: {
    resource: ['transactions'],
    operation: ['createTransactions'],
  },
};

export const description: ITransactionsProperties = [
  ...addJsonParametersDescription(displayOptions),
  {
    displayName: 'Transactions',
    name: 'collection',
    placeholder: 'Add transaction',
    type: 'fixedCollection',
    default: [],
    typeOptions: { multipleValues: true },
    displayOptions: { show: { ...displayOptions.show, json: [false] } },
    options: [
      {
        displayName: 'Transaction',
        name: 'transaction',
        values: [
          { displayName: 'Customer ID', name: 'customer_id', type: 'number', default: 0, required: true },
          { displayName: 'Price', name: 'price', type: 'number', default: 0 },
          { displayName: 'Comment', name: 'comment', type: 'string', default: '' },
          { displayName: 'Created At', name: 'created_at', type: 'dateTime', default: undefined },
        ],
      },
    ],
  },
];


