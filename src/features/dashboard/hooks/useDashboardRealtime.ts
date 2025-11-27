import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { QueryKey, useQueryClient } from '@tanstack/react-query';

export interface DashboardRealtimeOptions<TCache, TIncoming> {
  queryKey: QueryKey;
  applyIncoming: (incoming: TIncoming, previous?: TCache) => TCache;
  endpoint?: string;
  enabled?: boolean;
}

const defaultEndpoint = '/socket';

export const useDashboardRealtime = <TCache = unknown, TIncoming = TCache>({
  queryKey,
  applyIncoming,
  endpoint = defaultEndpoint,
  enabled = true,
}: DashboardRealtimeOptions<TCache, TIncoming>) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const handlerRef = useRef(applyIncoming);

  useEffect(() => {
    handlerRef.current = applyIncoming;
  }, [applyIncoming]);

  useEffect(() => {
    if (!enabled) return undefined;

    const socket = io(endpoint, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    const handleUpdate = (payload: TIncoming) => {
      queryClient.setQueryData<TCache>(queryKey, (previous) => handlerRef.current(payload, previous));
    };

    socket.on('data:update', handleUpdate);

    return () => {
      socket.off('data:update', handleUpdate);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [endpoint, enabled, queryClient, queryKey]);

  return socketRef;
};
