import {DEFAULT_GROUP} from './const';

export function parseGroups(groups: string | string[] | null | undefined): string[] {
    return (typeof groups === 'string' ? [groups] : groups) || [DEFAULT_GROUP];
}
