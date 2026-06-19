import Link from 'next/link'; 
import { useRouter } from 'next/router'; 
const menu = [ { path: '/', label: 'Dashboard', icon: '🏠' }, 
    { path: '/inventory', label: 'Products', icon: '📦' }, 
    { path: '/inventory/timber', label: 'Timber', icon: '🌲' }, 
    { path: '/production', label: 'Production', icon: '🔨' }, 
    { path: '/finance/expenditures', label: 'Expenses', icon: '💰' }, 
    { path: '/customers', label: 'Customers', icon: '👥' }, 
    { path: '/users', label: 'Users', icon: '👤' }, 
    { path: '/reports/sales', label: 'Sales Report', icon: '📊' }, 
    { path: '/reports/inventory', label: 'Inventory Report', icon: '📈' }, 
    { path: '/backup', label: 'Backup', icon: '💾' }, 
    { path: '/settings', label: 'Settings', icon: '⚙️' } ]; 
    
    export default function Sidebar() { 
        const router = useRouter(); 
        return (

            <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0 overflow-y-auto">
                <div className="p-4 text-xl font-bold border-b border-gray-700">Prime Cut</div>
                    <nav className="mt-4">{menu.map(item => (<Link key={item.path} href={item.path}>
                                <div className={`flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer ${router.pathname === item.path ? 'bg-gray-700' : ''}`}>
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.label}</span> </div>
                            </Link> ))} 
                    </nav> 
            </aside> ); }