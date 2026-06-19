import { useEffect, useState } from 'react'; 
import { syncManager } from '../services/sync/SyncManager'; 
export const useNetwork = () => { 
    const [isConnected, setIsConnected] = useState(syncManager.isOnline()); 
    const [queueLength, setQueueLength] = useState(0); useEffect(() => { 
        const unsub = syncManager.onNetworkChange(setIsConnected); 
        const interval = setInterval(() => setQueueLength(syncManager.getQueueLength()), 1000); 
        return () => { unsub(); clearInterval(interval); }; }, []); 
        return { isConnected, queueLength }; 
    };