import { Note } from '../schema/app_schema';
import { Guid } from 'guid-typescript';
import { IInsecureUser } from '@fluidframework/test-runtime-utils';

export const UndefinedUserId = "[UNDEFINED]"

export function getRotation(note: Note) {
    const i = hashCode(note.id);

    const rotationArray = [
        'rotate-1',
        '-rotate-2',
        'rotate-2',
        '-rotate-1',
        '-rotate-3',
        'rotate-3',
    ];

    return rotationArray[i % rotationArray.length];
}

export type SetSelectionFunc = (value: Note[]) => void;

function hashCode(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = 31 * h + str.charCodeAt(i);
    }
    return h;
}

export const generateTestUser = (): IInsecureUser => {
    const user = {
        id: Guid.create().toString(),
        name: '[TEST USER]',
    };
    return user;
};

export enum dragType {
    NOTE = 'Note',
    GROUP = 'Group',
}

export enum selectAction {
    MULTI,
    REMOVE,
    SINGLE,
}

