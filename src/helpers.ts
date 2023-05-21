import { EditableField, FieldKinds, SchemaAware, UntypedField, parentField } from "@fluid-experimental/tree2";
import { App, Note, Pile, User } from "./schema";
import assert from "assert";

function isSequence(
    field: UntypedField | EditableField,
): field is SchemaAware.InternalTypes.UntypedSequenceField {
    return field.fieldSchema.kind.identifier === FieldKinds.sequence.identifier;
}

const getRandomRotation = () => {
    const rotationArray = ['rotate-1', 'rotate-2', 'rotate-3', '-rotate-1', '-rotate-2', '-rotate-3'];
    return rotationArray[Math.floor(Math.random() * rotationArray.length)];
}

export function getRotation(note: Note, pile: Pile) {
    const noteIndex = note[parentField].index;
    const pileIndex = pile[parentField].index;
    const i = noteIndex + pileIndex;

    const rotationArray = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', '-rotate-3', 'rotate-3'];

    return rotationArray[i % rotationArray.length];    
}

export function addNote(pile: Pile, text: string, author: {name: string, id: string}) {

    const view = {
        color: "",
        rotation: getRandomRotation(),
        selectedBy: []
    }

    const note = {
        text,
        author,
        users: [],
        view
    };

    pile.notes.insertNodes(pile.notes.length, [note]);
}

export function addPile(app: App, name: string) {
    const pile = {
        name,
        notes: []
    };

    app.piles.insertNodes(app.piles.length, [pile]);
}

export function deletePile(pile: Pile):boolean {
    if (pile.notes.length == 0) {
        deleteItem(pile);
        return true;
    }
    return false;
}

export function deleteNote(note: Note) {    
    deleteItem(note);
}

function deleteItem(item: Note | Pile | User) {
    const parent = item[parentField].parent;
    assert(isSequence(parent));
    parent.deleteNodes(item[parentField].index, 1);
}

export function moveNote(note: Note, destinationIndex: number, destinationPile: Pile) {
    const parent = note[parentField].parent;
    assert(isSequence(parent));
    if (parent.length > destinationIndex) {
        parent.moveNodes(note[parentField].index, 1, destinationIndex, destinationPile.notes);
    }
}

export function movePile(pile: Pile, destinationIndex: number) {
    const parent = pile[parentField].parent;
    assert(isSequence(parent));
    if (parent.length > destinationIndex) {
        parent.moveNodes(pile[parentField].index, 1, destinationIndex);
    }
}

export function isVoter(note: Note, user: {name: string, id: string}) {
    for (const u of note.users) {
        if (u.id == user.id) {           
            return u;
        }
    }
    return undefined;   
}

export function toggleVote(note: Note, user: {name: string, id: string}) {
    const voter = isVoter(note, user);    
    if (voter) {
        deleteItem(voter);
    } else {
        note.users.insertNodes(note.users.length, [user]);
    }     
}