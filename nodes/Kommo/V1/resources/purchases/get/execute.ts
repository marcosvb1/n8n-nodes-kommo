import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../transport';

export async function execute(this: IExecuteFunctions, index: number): Promise<any> {
	const catalog_id = this.getNodeParameter('catalog_id', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;

	const endpoint = `catalogs/${catalog_id}/elements`;
	const qs: any = {};

	if (!returnAll) {
		qs.limit = limit;
	}

	if (returnAll) {
		const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
		return responseData.flatMap((data) => {
			if (!data?._embedded?.elements) return [];
			return data._embedded.elements;
		});
	} else {
		const responseData = await apiRequest.call(this, 'GET', endpoint, {}, qs);
		return responseData?._embedded?.elements || [];
	}
}