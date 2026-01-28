import {
	NodeConnectionTypes,
	IExecuteFunctions,
	INodeExecutionData,
	type INodeType,
	type INodeTypeDescription
} from 'n8n-workflow';

/*
type StartActionResponse = {
	executionTrackingId: string;
};
*/

type StartActionRequest = {
	bindingId: string;
};


export class Olivetin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OliveTin ',
		name: 'olivetin',
		icon: { light: 'file:../../icons/OliveTinLogo.svg', dark: 'file:../../icons/OliveTinLogo.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use the OliveTin API',
		defaults: {
			name: 'OliveTin',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'olivetinApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '= {{$credentials.serverAddress}}/api/',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('olivetinApi');
		//console.info('Server Address:', credentials.serverAddress);

		const requestData: StartActionRequest = {
			bindingId: this.getNodeParameter('bindingId', 0) as string,
		};
		//console.info('Request Data:', requestData);

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		}


		const response = this.helpers.httpRequest({
			method: 'POST',
			body: requestData,
			url: `${credentials.serverAddress}/api/StartAction`,
			headers,
			json: true
		});

		//console.log('Response:', response);

		const item: INodeExecutionData = {
			json: {
				response,
			},
		};

		const ret: INodeExecutionData[][] = [
			[item]
		];

		return ret;
	}
}

