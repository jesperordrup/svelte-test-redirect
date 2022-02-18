import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';

const getQuery = (searchParams) => {
	const query = {};
	for (const [key, value] of searchParams.entries()) {
	  query[key] = value;
	}
  
	return query;
  };

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies.userid;

	const query = getQuery(event.url.searchParams) || {};
	if (query.mode === 'login') {
	
		event.locals.userid = uuid();
	
		
		const response = await resolve(event);
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
		return response;
	} else if (query.mode === 'logout') {
	
		event.locals.userid = null;
		
		
		const response = await resolve(event);
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', '', {
				path: '/',
				httpOnly: true
			})
		);
		return response;
	} else {
		const response = await resolve(event);
		return response;
	}

	
};


/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	console.log(event.locals.userid)
	return event.locals.userid
	  ? {
		  userId: event.locals.userid
		}
	  : {
		  userId: null
	  };
  }