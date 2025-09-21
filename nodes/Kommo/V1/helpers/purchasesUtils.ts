/**
 * Utilitários específicos para purchases/invoices
 * Baseado nos testes reais da API
 */

export interface PurchaseCustomField {
    field_id: number;
    field_type: string;
    field_code: string;
    value: any;
}

/**
 * Converte custom fields para o formato correto da API de purchases
 * Baseado nos testes: campos enum devem usar value como string
 */
export function makePurchaseCustomFieldReqObject(customFieldsValues: any[]): Array<{
    field_id: number;
    values: Array<{ value?: string | number | boolean; enum_id?: number }>;
}> {
    if (!Array.isArray(customFieldsValues) || customFieldsValues.length === 0) {
        return [];
    }
    
    return customFieldsValues.map(cf => {
        const fieldData = JSON.parse(cf.data);
        const fieldType = fieldData.type;
        const fieldId = fieldData.id;
        
        let processedValue: any;
        
        switch (fieldType) {
            case 'select':
            case 'radiobutton':
                // Para purchases/invoices, campos select devem usar value como string
                if (typeof cf.value === 'string') {
                    processedValue = { value: cf.value };
                } else if (typeof cf.value === 'number') {
                    // Se for número, pode ser enum_id - mas baseado nos testes, 
                    // é melhor converter para string do valor
                    processedValue = { value: String(cf.value) };
                } else {
                    processedValue = { value: String(cf.value) };
                }
                break;
                
            case 'multiselect':
                // Para multiselect, pode ter múltiplos valores
                if (typeof cf.value === 'string' && cf.value.includes(',')) {
                    const values = cf.value.split(',').map((v: string) => ({ value: v.trim() }));
                    return { field_id: fieldId, values };
                } else {
                    processedValue = { value: String(cf.value) };
                }
                break;
                
            case 'checkbox':
                processedValue = { value: Boolean(cf.value) };
                break;
                
            case 'date':
            case 'date_time':
            case 'birthday':
                processedValue = { value: Number(cf.value) };
                break;
                
            case 'numeric':
            case 'price':
            case 'monetary':
                processedValue = { value: Number(cf.value) };
                break;
                
            default:
                // Para outros tipos, usar como string
                processedValue = { value: String(cf.value) };
                break;
        }
        
        return {
            field_id: fieldId,
            values: [processedValue]
        };
    });
}

/**
 * Adiciona automaticamente o campo Status obrigatório se não estiver presente
 */
export function ensureRequiredStatusField(
    customFieldsValues: any[], 
    statusFieldId: number, 
    defaultStatus: string = 'Created'
): any[] {
    // Verificar se já tem o campo status
    const hasStatus = customFieldsValues.some(cf => {
        const fieldData = JSON.parse(cf.data);
        return fieldData.id === statusFieldId;
    });
    
    if (!hasStatus) {
        // Adicionar campo status com valor padrão
        customFieldsValues.push({
            data: JSON.stringify({ id: statusFieldId, type: 'select' }),
            value: defaultStatus
        });
    }
    
    return customFieldsValues;
}

/**
 * Identifica automaticamente o catálogo de invoices
 */
export async function findInvoicesCatalog(apiRequestFn: Function, context: any): Promise<{
    catalog: any;
    statusField: any;
    itemsField: any;
} | null> {
    try {
        // 1. Listar catálogos
        const catalogsResponse = await apiRequestFn.call(context, 'GET', 'catalogs');
        const catalogs = catalogsResponse._embedded?.catalogs || [];
        
        // 2. Encontrar catálogo de invoices
        const invoicesCatalog = catalogs.find((c: any) => c.type === 'invoices');
        if (!invoicesCatalog) {
            return null;
        }
        
        // 3. Obter custom fields do catálogo
        const fieldsResponse = await apiRequestFn.call(context, 'GET', `catalogs/${invoicesCatalog.id}/custom_fields`);
        const customFields = fieldsResponse._embedded?.custom_fields || [];
        
        // 4. Identificar campos importantes
        const statusField = customFields.find((f: any) => f.code === 'BILL_STATUS' && f.is_required);
        const itemsField = customFields.find((f: any) => f.code === 'ITEMS');
        
        return {
            catalog: invoicesCatalog,
            statusField,
            itemsField
        };
        
    } catch (error) {
        console.error('Erro ao identificar catálogo de invoices:', error);
        return null;
    }
}

/**
 * Valida se um catálogo é adequado para purchases
 */
export function validatePurchasesCatalog(catalog: any): { isValid: boolean; message: string } {
    if (!catalog) {
        return { isValid: false, message: 'Catálogo não encontrado' };
    }
    
    if (!catalog.can_add_elements) {
        return { isValid: false, message: 'Catálogo não permite adicionar elementos' };
    }
    
    if (catalog.type !== 'invoices' && catalog.type !== 'regular') {
        return { 
            isValid: false, 
            message: `Tipo de catálogo '${catalog.type}' pode não ser adequado para purchases. Use 'invoices' ou 'regular'.` 
        };
    }
    
    return { isValid: true, message: 'Catálogo válido para purchases' };
}
