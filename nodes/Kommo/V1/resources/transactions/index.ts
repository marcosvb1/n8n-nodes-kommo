import { INodeProperties } from 'n8n-workflow';

import * as getTransactions from './get';
import * as createTransactions from './create';
import * as updateTransactions from './update';
export { getTransactions, createTransactions, updateTransactions };

export const descriptions: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['transactions'],
      },
    },
    options: [
      {
        name: 'Get Transactions',
        value: 'getTransactions',
        description: 'Get list of transactions',
        action: 'Get list of transactions',
      },
      {
        name: 'Create Transactions',
        value: 'createTransactions',
        description: 'Create new transactions',
        action: 'Create new transactions',
      },
      {
        name: 'Update Transactions',
        value: 'updateTransactions',
        description: 'Update transactions',
        action: 'Update transactions',
      },
    ],
    default: 'getTransactions',
  },
  ...getTransactions.description,
  ...createTransactions.description,
  ...updateTransactions.description,
];


