import { IDisplayOptions } from 'n8n-workflow';
import { IUnsortedProperties } from '../../../interfaces';
import { addJsonParametersDescription } from '../../../_components/JsonParametersDescription';

const displayOptions: IDisplayOptions | undefined = {
  show: {
    resource: ['unsorted'],
    operation: ['create'],
  },
};

export const description: IUnsortedProperties = [
  ...addJsonParametersDescription(displayOptions),
  {
    displayName: 'Items',
    name: 'items',
    placeholder: 'Add item',
    type: 'fixedCollection',
    default: [],
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        ...displayOptions.show,
        json: [false],
      },
    },
    options: [
      {
        displayName: 'Item',
        name: 'item',
        values: [
          {
            displayName: 'Source Name',
            name: 'source_name',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Source UID',
            name: 'source_uid',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Pipeline ID',
            name: 'pipeline_id',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Created At',
            name: 'created_at',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Metadata',
            name: 'metadata',
            placeholder: 'Add field',
            type: 'fixedCollection',
            default: {},
            options: [
              {
                displayName: 'Fields',
                name: 'fields',
                values: [
                  { displayName: 'Form ID', name: 'form_id', type: 'string', default: '' },
                  { displayName: 'Form Name', name: 'form_name', type: 'string', default: '' },
                  { displayName: 'Form Page', name: 'form_page', type: 'string', default: '' },
                  { displayName: 'IP', name: 'ip', type: 'string', default: '' },
                  { displayName: 'Form Sent At', name: 'form_sent_at', type: 'dateTime', default: '' },
                  { displayName: 'Referer', name: 'referer', type: 'string', default: '' },
                ],
              },
            ],
            description: 'Form metadata per docs',
          },
          {
            displayName: 'Request ID',
            name: 'request_id',
            type: 'string',
            default: '',
            description: 'Echoed back in response, not stored',
          },
          {
            displayName: 'Embedded',
            name: '_embedded',
            type: 'collection',
            default: {},
            options: [
              {
                displayName: 'Lead',
                name: 'lead',
                values: [
                  { displayName: 'Name', name: 'name', type: 'string', default: '' },
                  { displayName: 'Price', name: 'price', type: 'number', default: 0 },
                ],
              },
              {
                displayName: 'Contact',
                name: 'contact',
                values: [
                  { displayName: 'Name', name: 'name', type: 'string', default: '' },
                  { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
                  { displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'name@email.com' },
                ],
              },
              {
                displayName: 'Company',
                name: 'company',
                values: [
                  { displayName: 'Name', name: 'name', type: 'string', default: '' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];


