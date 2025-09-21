import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeExecutionData,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';

import {
	validateWebhookSignature,
	validateWebhookTimestamp,
	parseWebhookEvent,
	normalizeWebhookData,
	isDuplicateEvent,
	KommoWebhookEvent,
} from '../../../helpers/webhookUtils';

// Cache global para detecção de eventos duplicados
const eventCache = new Map<string, number>();

export async function execute(this: IWebhookFunctions): Promise<IWebhookResponseData> {
	const headers = this.getHeaderData() as IDataObject;
	const body = this.getBodyData() as any;
	const query = this.getQueryData() as IDataObject;

	try {
		// 1. Validar se temos um payload
		if (!body) {
			throw new NodeOperationError(this.getNode(), 'Webhook payload is empty', {
				description: 'The webhook request must contain a valid JSON payload.',
			});
		}

		// 2. Obter configurações do webhook
		const secretKey = this.getNodeParameter('secretKey', '') as string;
		const validateSignature = this.getNodeParameter('validateSignature', true) as boolean;
		const validateTimestamp = this.getNodeParameter('validateTimestamp', true) as boolean;
		const preventDuplicates = this.getNodeParameter('preventDuplicates', true) as boolean;

		// 3. Validar assinatura se habilitado
		if (validateSignature && secretKey) {
			const signature = headers['x-kommo-signature'] as string || headers['x-signature'] as string;
			const rawBody = JSON.stringify(this.getBodyData());

			if (!signature) {
				throw new NodeOperationError(this.getNode(), 'Missing webhook signature', {
					description: 'The webhook request is missing the required signature header.',
				});
			}

			const isValidSignature = validateWebhookSignature(rawBody, signature, secretKey);
			if (!isValidSignature) {
				throw new NodeOperationError(this.getNode(), 'Invalid webhook signature', {
					description: 'The webhook signature does not match the expected value. Check your secret key.',
				});
			}
		}

		// 4. Parse e validar evento
		let event: KommoWebhookEvent;
		try {
			event = parseWebhookEvent(body);
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid webhook event: ${error.message}`, {
				description: 'The webhook payload does not match the expected Kommo format.',
			});
		}

		// 5. Validar timestamp se habilitado
		if (validateTimestamp) {
			const isValidTimestamp = validateWebhookTimestamp(event.created_at);
			if (!isValidTimestamp) {
				throw new NodeOperationError(this.getNode(), 'Webhook timestamp is too old', {
					description: 'The webhook event is older than 5 minutes and may be a replay attack.',
				});
			}
		}

		// 6. Verificar duplicatas se habilitado
		if (preventDuplicates) {
			const isDuplicate = isDuplicateEvent(event, eventCache);
			if (isDuplicate) {
				// Retornar sucesso mas não processar o evento
				return {
					webhookResponse: {
						status: 200,
						body: { status: 'duplicate_ignored' },
					},
				};
			}
		}

		// 7. Filtrar por tipos de evento se configurado
		const allowedEvents = this.getNodeParameter('events') as string[];
		if (allowedEvents && allowedEvents.length > 0) {
			if (!allowedEvents.includes(event.event_type)) {
				return {
					webhookResponse: {
						status: 200,
						body: { status: 'event_filtered' },
					},
				};
			}
		}

		// 8. Normalizar dados do evento
		const normalizedData = normalizeWebhookData(event);

		// 9. Preparar dados para o workflow
		const workflowData: INodeExecutionData[] = [
			{
				json: {
					...normalizedData,
					headers: headers,
					query: query,
					receivedAt: new Date().toISOString(),
				},
			},
		];

		// 10. Log do evento (opcional)
		const enableLogging = this.getNodeParameter('enableLogging', false) as boolean;
		if (enableLogging) {
			console.log(`[Kommo Webhook] Received ${event.event_type} for ${event.entity_type} ID ${event.entity_id}`);
		}

		// 11. Retornar sucesso
		return {
			workflowData: [workflowData],
			webhookResponse: {
				status: 200,
				body: {
					status: 'success',
					event_id: event.entity_id,
					event_type: event.event_type,
					processed_at: new Date().toISOString()
				},
			},
		};

	} catch (error) {
		// Log do erro
		console.error('[Kommo Webhook Error]', error.message);

		// Se for erro de validação, retornar 400
		if (error.message.includes('Invalid') || error.message.includes('Missing')) {
			return {
				webhookResponse: {
					status: 400,
					body: {
						error: 'Bad Request',
						message: error.message,
						timestamp: new Date().toISOString()
					},
				},
			};
		}

		// Para outros erros, retornar 500
		return {
			webhookResponse: {
				status: 500,
				body: {
					error: 'Internal Server Error',
					message: 'Failed to process webhook',
					timestamp: new Date().toISOString()
				},
			},
		};
	}
}
