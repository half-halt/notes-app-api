import { isNil } from 'lodash';

/**
 * Searches the specified object (of http headers) for the specified header
 * which are case insenstive, while Javascript properties are not.
 * 
 * @param headers The list of the headers (any case)
 * @param find The header to find (any case)
 */
export const findHeader = (headers: Record<string, string>, find: string) => {
	if (isNil(headers))
		return null;

	const lcFind = find.toLowerCase();
	for (let header in headers) 
	{
		if (header.toLowerCase() === lcFind)
			return headers[header];
	}

	return null;
}
