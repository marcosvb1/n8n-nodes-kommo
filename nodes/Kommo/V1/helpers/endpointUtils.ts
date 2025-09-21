/**
 * Utilitários para determinar endpoints corretos da API do Kommo
 */

export interface EndpointContext {
	customerId?: string | number;
	catalogId?: string | number;
	operation?: 'transactions' | 'purchases' | 'elements';
}

/**
 * Determina o endpoint correto para operações de purchases/transactions
 * baseado no contexto fornecido
 */
export function getPurchasesEndpoint(context: EndpointContext): string {
	// Se temos um customerId e a operação é transactions, usar endpoint de customer
	if (context.customerId && context.operation === 'transactions') {
		return `customers/${context.customerId}/transactions`;
	}

	// Se temos um catalogId, usar endpoint de catalog elements
	if (context.catalogId) {
		return `catalogs/${context.catalogId}/elements`;
	}

	// Fallback: se não temos contexto suficiente, lançar erro
	throw new Error(
		'Context insuficiente para determinar endpoint. ' +
		'É necessário fornecer customerId (para transactions) ou catalogId (para purchases/elements).'
	);
}

/**
 * Valida se o contexto fornecido é válido para a operação desejada
 */
export function validatePurchasesContext(context: EndpointContext): void {
	if (!context.customerId && !context.catalogId) {
		throw new Error(
			'É necessário fornecer customerId ou catalogId para operações de purchases.'
		);
	}

	if (context.customerId && context.catalogId) {
		throw new Error(
			'Não é possível usar customerId e catalogId simultaneamente. ' +
			'Use customerId para transactions ou catalogId para purchases.'
		);
	}

	if (context.customerId && context.operation !== 'transactions') {
		throw new Error(
			'Quando customerId é fornecido, a operação deve ser "transactions".'
		);
	}
}

/**
 * Determina o tipo de operação baseado nos parâmetros fornecidos
 */
export function inferOperationType(params: any): 'transactions' | 'purchases' {
	if (params.customerId || params.customer_id) {
		return 'transactions';
	}

	if (params.catalogId || params.catalog_id) {
		return 'purchases';
	}

	// Default para purchases se não conseguir determinar
	return 'purchases';
}

/**
 * Normaliza IDs para garantir formato correto
 */
export function normalizeId(id: string | number | undefined): string | undefined {
	if (id === undefined || id === null || id === '') {
		return undefined;
	}

	return String(id).trim();
}
