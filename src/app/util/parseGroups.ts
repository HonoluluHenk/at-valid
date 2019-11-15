import {DEFAULT_GROUP} from '../decorators';

export function parseGroups(groups: string | string[] | null | undefined): string[] {
    return (typeof groups === 'string' ? [groups] : groups) || [DEFAULT_GROUP];
}
