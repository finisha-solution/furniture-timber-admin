import { useEffect, useState } from 'react'; 
import { db } from '../../../services/firebase-client'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'; 
export default function Expenditures() { 
    const [expenses, setExpenses] = useState([]); useEffect(() => { getDocs(collection(db, 'expenditures')).then(snap => setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))); }, []); const approve = async (id) => { await updateDoc(doc(db, 'expenditures', id), { approvalStatus: 'approved' }); setExpenses(expenses.map(e => e.id === id ? { ...e, approvalStatus: 'approved' } : e)); 
}; 
return (
<div>
    <h1 className="text-2xl font-bold mb-6">
        Expenditures
    </h1>
    <table className="min-w-full bg-white border">
        <thead>
            <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Approve</th>
            </tr>
        </thead>
        <tbody>{expenses.map(e => (
            <tr key={e.id}>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>KES {e.totalAmount}</td>
                <td>{e.approvalStatus}</td>
                <td>{e.approvalStatus !== 'approved' && <button onClick={() => approve(e.id)}>Approve</button>}</td>
            </tr>))}
        </tbody>
    </table>
</div>); 
}