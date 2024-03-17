/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { App } from '../schema/app_schema';
import { Session } from '../schema/session_schema';
import '../output.css';
import {
    IFluidContainer,
    IMember,
    IServiceAudience,
    TreeView,
} from 'fluid-framework';
import { undefinedUserId } from '../utils/utils';
import { Canvas } from './canvasux';

export function ReactApp(props: {
    appTree: TreeView<App>;
    sessionTree: TreeView<Session>;
    audience: IServiceAudience<IMember>;
    container: IFluidContainer;
    insertTemplate: (prompt: string) => Promise<void>;
}): JSX.Element {
    const [currentUser, setCurrentUser] = useState(undefinedUserId);
    const [connectionState, setConnectionState] = useState('');
    const [saved, setSaved] = useState(false);
    const [fluidMembers, setFluidMembers] = useState<string[]>([]);

    return (
        <div
            id="main"
            className="flex flex-col bg-transparent h-screen w-full overflow-hidden overscroll-none"
        >
            <Header
                saved={saved}
                connectionState={connectionState}
                fluidMembers={fluidMembers}
                clientId={currentUser}
            />
            <div className="flex h-[calc(100vh-48px)] flex-row">
                <div className="grow">
                    <Canvas
                        appTree={props.appTree}
                        sessionTree={props.sessionTree}
                        audience={props.audience}
                        container={props.container}
                        fluidMembers={fluidMembers}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        setConnectionState={setConnectionState}
                        setSaved={setSaved}
                        setFluidMembers={setFluidMembers}
                    />
                </div>
                <div className="shrink-0 w-400 bg-gray-200">
                    <Copilot insertTemplate={props.insertTemplate} />
                </div>
            </div>
        </div>
    );
}

export function Header(props: {
    saved: boolean;
    connectionState: string;
    fluidMembers: string[];
    clientId: string;
}): JSX.Element {
    return (
        <div className="h-[48px] flex shrink-0 flex-row items-center justify-between bg-green-600 text-base text-white z-40 w-full">
            <div className="flex m-2">Brainstorm</div>
            {props.saved ? 'saved' : 'not saved'} | {props.connectionState} | users:{' '}
            {props.fluidMembers.length}
        </div>
    );
}

export function Copilot(props: {
    insertTemplate: (prompt: string) => Promise<void>;
}): JSX.Element {
    const [templatePrompt, setTemplatePrompt] = useState(
        'Help me brainstorm new features to add to my digital Whiteboard application'
    );
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const black =
        'flex flex-row items-center justify-between underline text-black z-40 w-full m-2';
    const red =
        'flex flex-row items-center justify-between underline bg-green-600 text-white z-40 w-full m-2';
    return (
        <div className="flex flex-col w-400 h-full">
            <div className={isLoadingTemplate ? red : black}>
                {isLoadingTemplate
                    ? 'Generating content. May takes a while...'
                    : 'Describe the content to be inserted'}
            </div>
            <textarea
                className="flex h-full self-stretch m-2 text-black"
                value={templatePrompt}
                id="insertTemplateInput"
                aria-label="Describe the template to be inserted"
                onChange={(e) => {
                    setTemplatePrompt(e.target.value);
                }}
            />
            <div className="flex flex-row">
                <button
                    className="bg-black text-white hover:bg-gray-600 font-bold px-2 py-1 rounded inline-flex items-center h-6 m-2 align-self-end"
                    id="insertTemplateButton"
                    onClick={() => {
                        setIsLoadingTemplate(true);
                        props
                            .insertTemplate(templatePrompt)
                            .then(() => setIsLoadingTemplate(false));
                    }}
                >
                    Generate content
                </button>
            </div>
        </div>
    );
}
