import 'reflect-metadata';
import { DocumentNode } from "graphql";
import { getFieldsWithDirectives } from "graphql-tools";
import { forEach } from "lodash";
import { isAuthenticated } from "./is-authenticated";
import { withRole } from "./with-role";
import { Injectable } from '@graphql-modules/di';

/**
 * Authentication provider which can be consumed by dependent modules, 
 * this provides the 'composeResolvers' function which should be invoked
 * by the root module to apply all the directives at once.
 */
@Injectable()
export class AuthenticationProvider
{
	public composeResolvers(typeDefs: DocumentNode)
	{
		const map: Record<string, any> = {};
		const fields = getFieldsWithDirectives(typeDefs);
		
		forEach(fields, (element:any, index: string) => {
			forEach(element, (directive) => {
				let dirFn = null;
				switch (directive.name)
				{
				case 'authenticated':
					dirFn = isAuthenticated();
					break;

				case 'roles':
					if (directive.args.roles)
						dirFn = withRole(directive.args.roles);
					break;
				}
				if (dirFn && Array.isArray(map[index]))
					map[index].push(dirFn);
				else if (dirFn)
					map[index] = [dirFn];
			});
		});
	
		console.log('resolver-map:', map);
		return map;
	}
}