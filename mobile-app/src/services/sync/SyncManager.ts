import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';
import { collection, addDoc, writeBatch, doc, getDoc } from 'firebase/firestore';
interface QueuedOp { id: string; collection: string; docId?: string; operation: 'create'|'update'; data: any; timestamp: number; }
class SyncManagerClass {
  private queue: QueuedOp[] = [];
  private online = true;
  private listeners: Array<(online: boolean) => void> = [];
  private isSyncingFlag = false;
  async init() { const net = await NetInfo.fetch(); this.online = net.isConnected === true; await this.load(); this.setupNetworkListener(); }
  private async load() { const raw = await AsyncStorage.getItem('syncQueue'); if (raw) this.queue = JSON.parse(raw); }
  private async save() { await AsyncStorage.setItem('syncQueue', JSON.stringify(this.queue)); }
  async add(collectionName: string, data: any, docId?: string) { this.queue.push({ id: Date.now().toString(), collection: collectionName, docId, operation: docId ? 'update' : 'create', data, timestamp: Date.now() }); await this.save(); if (this.online) this.sync(); }
  async sync() { if (!this.online || this.queue.length === 0 || this.isSyncingFlag) return; this.isSyncingFlag = true; const batch = writeBatch(db); const successful: string[] = []; for (const op of this.queue) { try { if (op.operation === 'create') { const ref = doc(collection(db, op.collection)); batch.set(ref, { ...op.data, syncedAt: new Date() }); } else { const serverRef = doc(db, op.collection, op.docId!); const serverSnap = await getDoc(serverRef); if (serverSnap.exists()) { const resolved = { ...serverSnap.data(), ...op.data, syncedAt: new Date() }; batch.set(serverRef, resolved, { merge: true }); } else batch.set(serverRef, op.data, { merge: true }); } successful.push(op.id); } catch(e) { console.warn(e); } } await batch.commit(); this.queue = this.queue.filter(op => !successful.includes(op.id)); await this.save(); this.isSyncingFlag = false; }
  private setupNetworkListener() { NetInfo.addEventListener(state => { const wasOnline = this.online; this.online = state.isConnected === true; if (wasOnline !== this.online) { this.listeners.forEach(l => l(this.online)); if (this.online) this.sync(); } }); }
  onNetworkChange(listener: (online: boolean) => void) { this.listeners.push(listener); return () => { this.listeners = this.listeners.filter(l => l !== listener); }; }
  getQueueLength() { return this.queue.length; }
  isSyncing() { return this.isSyncingFlag; }
  isOnline() { return this.online; }
}
export const syncManager = new SyncManagerClass();