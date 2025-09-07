import { IDisplayOptions } from 'n8n-workflow';
import { IUnsortedProperties } from '../../../interfaces';
import { addJsonParametersDescription } from '../../../_components/JsonParametersDescription';
import { addCustomFieldDescription } from '../../../_components/CustomFieldsDescription';

const displayOptions: IDisplayOptions | undefined = {
  show: {
    resource: ['unsorted'],
    operation: ['create'],
  },
};

export const description: IUnsortedProperties = [
  ...addJsonParametersDescription(displayOptions),
  {
    displayName: 'Itens',
    name: 'items',
    placeholder: 'Adicionar Item',
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
            displayName: 'Nome da Fonte',
            name: 'source_name',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'UID da Fonte',
            name: 'source_uid',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'ID do Pipeline',
            name: 'pipeline_id',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Criado em',
            name: 'created_at',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Metadados',
            name: 'metadata',
            placeholder: 'Adicionar campo',
            type: 'fixedCollection',
            default: {},
            options: [
              {
                displayName: 'Campos',
                name: 'fields',
                values: [
                  { displayName: 'ID do Formulário', name: 'form_id', type: 'string', default: '' },
                  { displayName: 'Nome do Formulário', name: 'form_name', type: 'string', default: '' },
                  { displayName: 'Página do Formulário', name: 'form_page', type: 'string', default: '' },
                  { displayName: 'IP', name: 'ip', type: 'string', default: '' },
                  { displayName: 'Enviado em', name: 'form_sent_at', type: 'dateTime', default: '' },
                  { displayName: 'Referenciador (Referer)', name: 'referer', type: 'string', default: '' },
                ],
              },
            ],
            description: 'Metadados do formulário conforme a documentação',
          },
          {
            displayName: 'ID da Requisição',
            name: 'request_id',
            type: 'string',
            default: '',
            description: 'Retornado no response; não é armazenado',
          },
          {
            displayName: 'Embutidos',
            name: '_embedded',
            type: 'collection',
            default: {},
            options: [
              {
                displayName: 'Lead',
                name: 'lead',
                type: 'collection',
                default: {},
                placeholder: 'Adicionar campo',
                options: [
                  { displayName: 'Nome', name: 'name', type: 'string', default: '' },
                  { displayName: 'Preço', name: 'price', type: 'number', default: 0 },
                  { displayName: 'Visitor UID', name: 'visitor_uid', type: 'string', default: '' },
                  { displayName: 'Tags (separadas por vírgula)', name: 'tags', type: 'string', default: '' },
                  addCustomFieldDescription('getLeadCustomFields'),
                ],
              },
              {
                displayName: 'Contato',
                name: 'contact',
                type: 'collection',
                default: {},
                placeholder: 'Adicionar campo',
                options: [
                  { displayName: 'Nome', name: 'name', type: 'string', default: '' },
                  { displayName: 'Primeiro Nome', name: 'first_name', type: 'string', default: '', description: 'Ex.: Maria' },
                  { displayName: 'Sobrenome', name: 'last_name', type: 'string', default: '', description: 'Ex.: Silva' },
                  // Email e Telefone removidos: usar apenas Campos Personalizados
                  addCustomFieldDescription('getContactCustomFields'),
                ],
              },
              {
                displayName: 'Empresa',
                name: 'company',
                type: 'collection',
                default: {},
                placeholder: 'Adicionar campo',
                options: [
                  { displayName: 'Nome', name: 'name', type: 'string', default: '' },
                  addCustomFieldDescription('getCompanyCustomFields'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];


