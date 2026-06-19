import { useRouter } from 'next/router'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '../../services/firebase-client';
 export default function Header()
  { const router = useRouter(); 
    const logout = async () => { 
        await signOut(auth); 
        router.push('/login');
    };
    return (
        <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center"> 
            <h1 className="text-xl font-bold text-blue-600">Prime Cut Admin</h1>
            <button onClick={logout} className="text-red-600 text-sm">
            Logout
            </button>
       </header> ); } 