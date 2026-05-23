import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, { transports: ['websocket', 'polling'] });
  }
  return socket;
};

export const subscribeToNumber = (numberId: string) => {
  getSocket().emit('subscribe:number', numberId);
};

export const unsubscribeFromNumber = (numberId: string) => {
  getSocket().emit('unsubscribe:number', numberId);
};
