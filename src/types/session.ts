import type { IncomingMessage } from 'http';
import type { Session } from 'express-session';
import type { Socket } from 'socket.io';

export interface SessionIncomingMessage extends IncomingMessage {
    session: Session
};

export interface SessionSocket extends Socket {
    request: SessionIncomingMessage
};