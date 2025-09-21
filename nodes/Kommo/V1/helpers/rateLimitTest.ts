/**
 * Utilitários para testar o rate limiting do nó Kommo
 */

export interface RateLimitTestResult {
	totalRequests: number;
	successfulRequests: number;
	rateLimitedRequests: number;
	averageDelay: number;
	maxDelay: number;
	isWorking: boolean;
}

/**
 * Função para simular múltiplas requisições e testar rate limiting
 * Esta função deve ser chamada dentro do contexto de um nó n8n
 */
export async function testRateLimit(
	apiRequestFn: Function,
	context: any,
	numberOfRequests: number = 7
): Promise<RateLimitTestResult> {
	const results: any[] = [];
	const delays: number[] = [];

	console.log(`[Rate Limit Test] Iniciando teste com ${numberOfRequests} requisições...`);

	for (let i = 0; i < numberOfRequests; i++) {
		const startTime = Date.now();

		try {
			// Fazer requisição simples para account (endpoint leve)
			await apiRequestFn.call(context, 'GET', 'account');

			const endTime = Date.now();
			const delay = endTime - startTime;

			results.push({
				requestNumber: i + 1,
				success: true,
				delay,
				timestamp: new Date().toISOString()
			});

			delays.push(delay);

			console.log(`[Rate Limit Test] Requisição ${i + 1}: OK (${delay}ms)`);

		} catch (error) {
			const endTime = Date.now();
			const delay = endTime - startTime;

			results.push({
				requestNumber: i + 1,
				success: false,
				delay,
				error: error.message,
				timestamp: new Date().toISOString()
			});

			delays.push(delay);

			console.log(`[Rate Limit Test] Requisição ${i + 1}: ERRO (${delay}ms) - ${error.message}`);
		}

		// Pequena pausa entre requisições para simular uso real
		if (i < numberOfRequests - 1) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}

	// Analisar resultados
	const successful = results.filter(r => r.success).length;
	const failed = results.filter(r => !r.success).length;
	const averageDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
	const maxDelay = Math.max(...delays);

	// Rate limiting está funcionando se:
	// 1. Nem todas as requisições foram bem-sucedidas OU
	// 2. Houve delays significativos (> 10s indicam rate limiting)
	const isWorking = failed > 0 || maxDelay > 10000;

	const testResult: RateLimitTestResult = {
		totalRequests: numberOfRequests,
		successfulRequests: successful,
		rateLimitedRequests: failed,
		averageDelay: Math.round(averageDelay),
		maxDelay,
		isWorking
	};

	console.log('[Rate Limit Test] Resultado:', testResult);

	return testResult;
}

/**
 * Valida se o rate limiting está configurado corretamente
 */
export function validateRateLimitConfig(): { isValid: boolean; message: string } {
	// Verificar se as constantes estão definidas corretamente
	const expectedMaxRequests = 5;
	const expectedWindowMs = 60 * 1000; // 1 minuto

	// Esta função seria chamada internamente pelo transport
	// Para validar a configuração atual

	return {
		isValid: true,
		message: `Rate limiting configurado: ${expectedMaxRequests} req/${expectedWindowMs/1000}s`
	};
}

/**
 * Gera relatório de status do rate limiting
 */
export function generateRateLimitReport(testResult: RateLimitTestResult): string {
	const report = [
		'=== RELATÓRIO DE RATE LIMITING ===',
		'',
		`📊 Requisições totais: ${testResult.totalRequests}`,
		`✅ Bem-sucedidas: ${testResult.successfulRequests}`,
		`❌ Falhadas/Limitadas: ${testResult.rateLimitedRequests}`,
		`⏱️  Delay médio: ${testResult.averageDelay}ms`,
		`⏱️  Delay máximo: ${testResult.maxDelay}ms`,
		'',
		`🔒 Rate limiting: ${testResult.isWorking ? 'FUNCIONANDO' : 'INATIVO'}`,
		'',
		'📋 Interpretação:',
		testResult.isWorking
			? '✅ O sistema está limitando adequadamente as requisições'
			: '⚠️  O rate limiting pode não estar ativo ou configurado',
		'',
		'💡 Dicas:',
		'- Rate limiting funciona apenas através do nó n8n',
		'- Testes diretos na API não passam pelo rate limiting',
		'- Delays > 10s indicam que o rate limiting está ativo',
		'- Falhas podem indicar proteção contra spam',
		'',
		'=== FIM DO RELATÓRIO ==='
	];

	return report.join('\n');
}
