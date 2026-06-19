import { useEffect, useState } from 'react'; 
import { syncManager } from '../services/sync/SyncManager'; 
export const useSync = () => { 
    const [queueLength, setQueueLength] = useState(0); 
    const [isSyncing, setIsSyncing] = useState(false); useEffect(() => { 
        const interval = setInterval(() => { setQueueLength(syncManager.getQueueLength()); setIsSyncing(syncManager.isSyncing()); }, 500); 
        return () => clearInterval(interval); }, []); 
        const forceSync = () => syncManager.sync(); 
        return { queueLength, isSyncing, forceSync }; };