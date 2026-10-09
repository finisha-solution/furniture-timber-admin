import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-native'; 
import { useSelector } from 'react-redux'; 
import { LoginScreen } from '../screens/auth/LoginScreen'; 
import { DashboardScreen } from '../screens/dashboard/DashboardScreen'; 
import { SalesScreen } from '../screens/sales/SalesScreen'; 
import { CartScreen } from '../screens/sales/CartScreen'; 
//import { ScannerScreen } from '../screens/sales/ScannerScreen'; 
import { ReceiptScreen } from '../screens/sales/ReceiptScreen'; 
import { StockListScreen } from '../screens/inventory/StockListScreen'; 
import { StockTakeScreen } from '../screens/inventory/StockTakeScreen'; 
import { StockReceiveScreen } from '../screens/inventory/StockReceiveScreen'; 
import { TimberBatchScreen } from '../screens/inventory/TimberBatchScreen'; 
import { WorkshopScreen } from '../screens/production/WorkshopScreen'; 
import { ProductionJobScreen } from '../screens/production/ProductionJobScreen'; 
import { FinanceDashboardScreen } from '../screens/finance/FinanceDashboardScreen'; 
import { ExpenditureScreen } from '../screens/finance/ExpenditureScreen'; 
import { ReportsScreen } from '../screens/reports/ReportsScreen'; 
import { Layout } from '../components/layout/Layout'; 
import { PrivateRoute } from '../components/auth/PrivateRoute'; 
import { CustomerListScreen } from '../screens/sales/CustomerListScreen';
import { ProfitLossScreen } from '../screens/reports/ProfitLossScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
//import { BarcodeScanner } from '../components/scanner/BarcodeScanner';
import { Settings } from 'react-native';

export const AppRoutes = () => { 
    const { user } = useSelector(state => state.auth); 
    return ( 
    <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
                <Route index element={<DashboardScreen />} />
                <Route path="sales">
                    <Route index element={<SalesScreen />} />
                    <Route path="cart" element={<CartScreen />} />
                    <Route path="receipt/:saleId" element={<ReceiptScreen />} />
                   
                    <Route path="customer" element={<CustomerListScreen />} />
                    
                </Route>
                <Route path="inventory">
                    <Route index element={<StockListScreen />} />
                    <Route path="stock-take" element={<StockTakeScreen />} />
                    <Route path="receive" element={<StockReceiveScreen />} />
                    <Route path="timber" element={<TimberBatchScreen />} />
                </Route>
                <Route path="production">
                    <Route index element={<WorkshopScreen />} />
                    <Route path="job/:jobId" element={<ProductionJobScreen />} />
                </Route>
                <Route path="finance">
                    <Route index element={<FinanceDashboardScreen />} />
                    <Route path="expenditure" element={<ExpenditureScreen />} />
                </Route>
                <Route path="reports">
                    <Route index element={<ReportsScreen />} />
                    <Route path="profits" element={<ProfitLossScreen/>}/>
                </Route>
                <Route path="admin">
                    <Route index element></Route>
                    <Route path="users" element={<UserManagementScreen/>}/>
                </Route> 
            </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>); 
};