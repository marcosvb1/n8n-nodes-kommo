import { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

type IKommoMap = {
	account: 'getInfo';
	leads: 'getLeads' | 'createLeads' | 'updateLeads';
	contacts: 'getContacts' | 'createContacts' | 'updateContacts';
	companies: 'getCompany' | 'createCompany' | 'updateCompany';
	notes: 'getNotes' | 'createNotes' | 'updateNotes';
	customers: 'getCustomers' | 'createCustomers' | 'updateCustomers' | 'setCustomersMode';
	transactions: 'getTransactions' | 'createTransactions' | 'updateTransactions';
	unsorted: 'get' | 'create' | 'accept' | 'link' | 'reject' | 'summary';
	pipelines: 'get' | 'create' | 'update' | 'remove';
	statuses: 'get' | 'create' | 'update' | 'remove';
	catalogs: 'get' | 'create' | 'update' | 'getElements' | 'createElements' | 'updateElements';
	tasks: 'getTasks' | 'createTasks' | 'updateTasks';
	lists:
		| 'getLists'
		| 'addLists'
		| 'updateLists'
		| 'getListElements'
		| 'addListElements'
		| 'updateListElements';
	purchases: 'getPurchases' | 'createPurchases' | 'updatePurchases';
};

export type IKommo = AllEntities<IKommoMap>;

export type IAccountKommo = Entity<IKommoMap, 'account'>;
export type ILeadsKommo = Entity<IKommoMap, 'leads'>;
export type IContactsKommo = Entity<IKommoMap, 'contacts'>;
export type ICompaniesKommo = Entity<IKommoMap, 'companies'>;
export type ICustomersKommo = Entity<IKommoMap, 'customers'>;
export type ITransactionsKommo = Entity<IKommoMap, 'transactions'>;
export type IUnsortedKommo = Entity<IKommoMap, 'unsorted'>;
export type IPipelinesKommo = Entity<IKommoMap, 'pipelines'>;
export type IStatusesKommo = Entity<IKommoMap, 'statuses'>;
export type ICatalogsKommo = Entity<IKommoMap, 'catalogs'>;
export type ITasksKommo = Entity<IKommoMap, 'tasks'>;
export type INotesKommo = Entity<IKommoMap, 'notes'>;
export type IListsKommo = Entity<IKommoMap, 'lists'>;
export type IPurchasesKommo = Entity<IKommoMap, 'purchases'>;

export type IAccountProperties = PropertiesOf<IAccountKommo>;
export type ILeadsProperties = PropertiesOf<ILeadsKommo>;
export type IContactsProperties = PropertiesOf<IContactsKommo>;
export type ICompaniesProperties = PropertiesOf<ICompaniesKommo>;
export type IUnsortedProperties = PropertiesOf<IUnsortedKommo>;
export type IPipelinesProperties = PropertiesOf<IPipelinesKommo>;
export type IStatusesProperties = PropertiesOf<IStatusesKommo>;
export type ICatalogsProperties = PropertiesOf<ICatalogsKommo>;
export type ITasksProperties = PropertiesOf<ITasksKommo>;
export type INotesProperties = PropertiesOf<INotesKommo>;
export type IListsProperties = PropertiesOf<IListsKommo>;
export type ICustomersProperties = PropertiesOf<ICustomersKommo>;
export type ITransactionsProperties = PropertiesOf<ITransactionsKommo>;
export type IPurchasesProperties = PropertiesOf<IPurchasesKommo>;

export interface IAttachment {
	fields: {
		item?: object[];
	};
	actions: {
		item?: object[];
	};
}
