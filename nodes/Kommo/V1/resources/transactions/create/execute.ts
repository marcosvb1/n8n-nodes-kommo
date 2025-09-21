import { INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../transport';
import { getTimestampFromDateString } from '../../../helpers/getTimestampFromDateString';

interface IForm {
  transaction: Array<{
    customer_id: number;
    price?: number;
    comment?: string;
    created_at?: string;
  }>;
}

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const requestMethod = 'POST';
  const endpoint = `customers/transactions`;

  const jsonParams = (await this.getNodeParameter('json', 0)) as boolean;

  if (jsonParams) {
    const jsonString = (await this.getNodeParameter('jsonString', 0)) as string;
    const responseData = await apiRequest.call(
      this,
      requestMethod,
      endpoint,
      JSON.parse(jsonString),
    );
    return this.helpers.returnJsonArray(responseData);
  }

  const collection = (await this.getNodeParameter('collection', 0)) as IForm;

  const body = collection.transaction.map((t) => ({
    ...t,
    created_at: getTimestampFromDateString(t.created_at),
  }));

  const responseData = await apiRequest.call(this, requestMethod, endpoint, body);
  return this.helpers.returnJsonArray(responseData);
}


