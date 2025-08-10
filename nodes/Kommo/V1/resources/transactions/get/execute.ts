import { IDataObject, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../transport';

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const body = {} as IDataObject;
  const qs = {} as IDataObject;
  const simplify = this.getNodeParameter('simplify', 0, true) as boolean;

  const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
  const customerId = this.getNodeParameter('customer_id', 0, 0) as number;
  if (!returnAll) {
    const page = this.getNodeParameter('page', 0) as number;
    qs.page = page;
  }
  const limit = this.getNodeParameter('limit', 0) as number;
  qs.limit = limit;

  const requestMethod = 'GET';
  const base = 'customers/transactions';

  // Apply filter BEFORE branching so it works for both returnAll and paged
  if (customerId) {
    (qs as any).filter = { customer_id: [Number(customerId)] } as any;
  }

  if (returnAll) {
    const pages = await apiRequestAllItems.call(this, requestMethod, base, body, qs);
    if (simplify) {
      const txs = pages.flatMap((page: any) => page?._embedded?.transactions ?? []);
      return this.helpers.returnJsonArray(txs);
    }
    return this.helpers.returnJsonArray(pages);
  }

  const responseData = await apiRequest.call(this, requestMethod, base, body, qs);
  if (simplify) {
    const txs = (responseData as any)?._embedded?.transactions ?? [];
    return this.helpers.returnJsonArray(txs);
  }
  return this.helpers.returnJsonArray(responseData);
}


