import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	providers: [],
	// TODO: Add Auth0 and Google providers
};

export default authOptions;
