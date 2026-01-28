import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OliveTinApi implements ICredentialType {
	name = 'olivetinApi';

	displayName = 'OliveTin API';

	icon: Icon = { light: 'file:../icons/OliveTinLogo.svg', dark: 'file:../icons/OliveTinLogo.svg' };

	documentationUrl =
		'https://docs.olivetin.app/integrations/n8n.html';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Sever address',
			name: 'serverAddress',
			type: 'string',
			default: 'http://olivetin.example.com'
		}
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=token {{$credentials?.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '= {{$credentials.serverAddress}}/api/',
			url: '/Init',
			method: 'POST',
		},
	};
}
