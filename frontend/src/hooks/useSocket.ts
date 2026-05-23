import { useEffect, useCallback } from 'react';
import { getSocket, subscribeToNumber, unsubscribeFromNumber } from '../lib/socket';

export const useSocket = (event: string, handler: (data: unknown) => void) => {
  useEffect(() => {
    const socket = getSocket();
    socket.on(event, handler);
    return () => { socket.off(event, handler); };
  }, [event, handler]);
};

export const useNumberSocket = (numberId: string, onSMS: (sms: unknown) => void, onExpired?: () => void) => {
  const smsHandler = useCallback(onSMS, []);
  const expiredHandler = useCallback(() => onExpired?.(), []);

  useEffect(() => {
    if (!numberId) return;
    subscribeToNumber(numberId);
    const socket = getSocket();
    socket.on('sms:new', smsHandler);
    socket.on('number:expired', expiredHandler);
    return () => {
      unsubscribeFromNumber(numberId);
      socket.off('sms:new', smsHandler);
      socket.off('number:expired', expiredHandler);
    };
  }, [numberId]);
};
