import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../../transport';
import { makeMultipleInvoiceItemsReqObject, IInvoiceItemsForm } from '../model';
import { makePurchaseCustomFieldReqObject, ensureRequiredStatusField, findInvoicesCatalog } from '../../../helpers/purchasesUtils';

interface IPurchaseForm {
	name: string;
	invoice_items?: IInvoiceItemsForm;
	custom_fields_values?: any;
	request_id?: string;
    buyer?: {
        buyer?: {
            entity_type?: 'contacts';
            mode: 'id' | 'name';
            entity_id?: number;
            contact_name?: string;
            title?: string;
        }
    };
}

export async function execute(this: IExecuteFunctions, index: number): Promise<any> {
    const jsonParams = (await this.getNodeParameter('json', 0)) as boolean;

    if (jsonParams) {
        const jsonString = (await this.getNodeParameter('jsonString', 0)) as string;
        
        // Para JSON, ainda precisamos identificar o catálogo correto
        const catalogInfo = await findInvoicesCatalog(apiRequest, this);
        if (!catalogInfo) {
            throw new NodeOperationError(this.getNode(), 'Catálogo de invoices não encontrado', {
                description: 'Não foi possível encontrar um catálogo de tipo "invoices" na sua conta Kommo.'
            });
        }
        
        const endpoint = `catalogs/${catalogInfo.catalog.id}/elements`;
        return await apiRequest.call(this, 'POST', endpoint, JSON.parse(jsonString));
    }

    // Identificar automaticamente o catálogo de invoices e seus campos
    const catalogInfo = await findInvoicesCatalog(apiRequest, this);
    if (!catalogInfo) {
        throw new NodeOperationError(this.getNode(), 'Catálogo de invoices não encontrado', {
            description: 'Não foi possível encontrar um catálogo de tipo "invoices" na sua conta Kommo. Certifique-se de que existe um catálogo com tipo "invoices".'
        });
    }

    const { catalog, statusField, itemsField } = catalogInfo;
    const endpoint = `catalogs/${catalog.id}/elements`;
    
    console.log(`[Purchases] Usando catálogo: ${catalog.name} (ID: ${catalog.id})`);
    if (statusField) {
        console.log(`[Purchases] Campo Status obrigatório: ${statusField.name} (ID: ${statusField.id})`);
    }
    if (itemsField) {
        console.log(`[Purchases] Campo Items: ${itemsField.name} (ID: ${itemsField.id})`);
    }

    const elements = (this.getNodeParameter('collection.element', index, []) as IPurchaseForm[]) || [];

    const body: any = [];

    for (const element of elements) {
        const purchaseData: any = {
            name: element.name,
        };

        // Preparar custom fields com campo Status obrigatório
        let customFieldsToProcess = element.custom_fields_values ? [...element.custom_fields_values] : [];
        
        // Adicionar campo Status obrigatório se não estiver presente
        if (statusField) {
            customFieldsToProcess = ensureRequiredStatusField(customFieldsToProcess, statusField.id, 'Created');
        }

        // Processar custom fields com função específica para purchases
        if (customFieldsToProcess.length > 0) {
            const customFields = makePurchaseCustomFieldReqObject(customFieldsToProcess);
            if (customFields.length > 0) {
                purchaseData.custom_fields_values = customFields;
            }
        }

        // Processar invoice items se fornecidos
        if (element.invoice_items?.invoice_item?.length && itemsField) {
            const invoiceItemsValues = makeMultipleInvoiceItemsReqObject(element.invoice_items);

            if (invoiceItemsValues.length > 0) {
                purchaseData.custom_fields_values = purchaseData.custom_fields_values || [];

                // Adicionar campo items
                purchaseData.custom_fields_values.push({
                    field_id: itemsField.id,
                    values: invoiceItemsValues,
                });
            }
        }

        // Buyer handling: allow by contact ID or by contact Name
        const buyerBlock = element?.buyer?.buyer;
        if (buyerBlock) {
            if (buyerBlock.mode === 'id' && buyerBlock.entity_id) {
                purchaseData._embedded = purchaseData._embedded || {};
                const entityType = buyerBlock.entity_type || 'contacts';
                purchaseData._embedded[entityType] = [ { id: buyerBlock.entity_id } ];
            } else if (buyerBlock.mode === 'name' && buyerBlock.title) {
                // When not linking to a contact, use Title as purchase name
                purchaseData.name = buyerBlock.title;
            }
        }

        if (element.request_id) {
            purchaseData.request_id = element.request_id;
        }

        body.push(purchaseData);
    }

    return await apiRequest.call(this, 'POST', endpoint, body);
}
