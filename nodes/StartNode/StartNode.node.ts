import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class StartNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Start Action',
		name: 'startNode',
		group: ['transform'],
		version: 1,
		icon: { light: 'file:OliveTinLogo.svg', dark: 'file:OliveTinLogo.svg' },
		description: 'Starts and OliveTin action',
		defaults: {
			name: 'Action1',
		},
		inputs: ["main"],
		outputs: ["main"],
		usableAsTool: true,
		credentials: [
			{
				name: 'oliveTinApi',
				required: true,
			}
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Action ID',
				name: 'actionId',
				type: 'string',
				default: '',
				placeholder: 'date',
				description: 'This is the value of the "ID:" field for your action. It is *not* the Action tittle.',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let actionId: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				actionId = this.getNodeParameter('actionId', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.actionId = actionId;
				item.json.success = false;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
