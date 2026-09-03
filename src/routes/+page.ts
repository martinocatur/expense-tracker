import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The static app's home screen lives at home.html → /home.
export const load: PageLoad = () => {
	redirect(307, '/home');
};
