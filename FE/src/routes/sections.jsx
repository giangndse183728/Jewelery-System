import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import request from 'src/request';

import DashboardLayout from 'src/layouts/dashboard';

export const Dashboard = lazy(() => import('src/pages/app'));
const IndexPage = lazy(() => import('src/pages/customer'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Promotion = lazy(() => import('src/pages/promotion'));
export const Customer = lazy(() => import('src/pages/customer'));
export const Jewellery = lazy(() => import('src/pages/jewellery'));
export const Staff = lazy(() => import('src/pages/staff'));
export const Counter = lazy(() => import('src/pages/counter'));
export const Sale = lazy(() => import('src/pages/sale'));
export const Purchase = lazy(() => import('src/pages/purchase'));
export const GoldPrice = lazy(() => import('src/pages/goldprice'));
export const Exchange = lazy(() => import('src/pages/exchange'));
// ----------------------------------------------------------------------
export default function Router() {
    const role = localStorage.getItem('ROLE');

    // Fetch gold price every hour
    const getGoldprice = async () => {
        try {
            const lastFetch = localStorage.getItem('lastFetchGoldPrice');
            if (lastFetch && new Date().getTime() - lastFetch < 3600000) return;
            await request.get('/Price/GetGoldPrices');
            localStorage.setItem('lastFetchGoldPrice', new Date().getTime());
        } catch (error) {
            console.error('Error fetching gold price:', error);
        }
    };

    useEffect(() => {
        getGoldprice();
    }, []);

    let childrenRoutes = [];

    switch (role) {
        case '1':
            childrenRoutes = [
                { element: <IndexPage /> },
                { path: 'dashboard', element: <Dashboard /> },
                { path: 'customer', element: <Customer /> },
            ];
            break;
        case '2':
            childrenRoutes = [
                { element: <IndexPage /> },
                { path: 'dashboard', element: <Dashboard /> },
                { path: 'customer', element: <Customer /> },
                { path: 'jewellery', element: <Jewellery /> },
                { path: 'staff', element: <Staff /> },
                { path: 'goldprice', element: <GoldPrice /> },
                { path: 'counter', element: <Counter /> },
                { path: 'staff/counter/:counterId', element: <Staff /> },
                { path: 'promotion', element: <Promotion /> },
            ];
            break;
        case '3':
            childrenRoutes = [
                { element: <IndexPage /> },
                { path: 'customer', element: <Customer /> },
                { path: 'sale', element: <Sale /> },
                { path: 'purchase', element: <Purchase /> },
                { path: 'goldprice', element: <GoldPrice /> },
                { path: 'jewellery', element: <Jewellery /> },
                { path: 'exchange', element: <Exchange /> },
            ];
            break;
        default:
            childrenRoutes = [{ element: <IndexPage /> }];
            break;
    }

    const routes = useRoutes([
        {
            path: '/',
            element: <LoginPage />,
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            element: (
                <DashboardLayout>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: childrenRoutes,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);

    const token = localStorage.getItem('TOKEN');

    // if (token && token !== 'undefined') {
    //     const decoded = jwtDecode(token);
    //     if (decoded.exp * 1000 < Date.now()) {
    //         localStorage.removeItem('TOKEN');
    //         return <Navigate to="/login" replace />;
    //     }
    // } else {
    //     return <Navigate to="/login" replace />;
    // }

    return routes;
}

// export default function Router() {
//     const role = localStorage.getItem('ROLE');

//     const routes = useRoutes([
//         {
//             path: '/',
//             element: <LoginPage />,
//         },
//         {
//             path: '/login',
//             element: <LoginPage />,
//         },
//         {
//             element: (
//                 <DashboardLayout>
//                     <Suspense>
//                         <Outlet />
//                     </Suspense>
//                 </DashboardLayout>
//             ),
//             children: [
//                 { element: <IndexPage /> },
//                 { path: 'promotion', element: <Promotion /> },
//                 { path: 'customer', element: <Customer /> },
//                 { path: 'jewellery', element: <Jewellery /> },
//                 { path: 'staff', element: <Staff /> },
//                 { path: 'staff/counter/:counterId', element: <Staff /> },
//                 { path: 'counter', element: <Counter /> },
//                 { path: 'sale', element: <Sale /> },
//                 { path: 'purchase', element: <Purchase /> },
//                 { path: 'goldprice', element: <GoldPrice /> },
//                 { path: 'dashboard', element: <IndexPage /> }, // Add this line
//                 { path: 'exchange', element: <Exchange /> },
//             ],
//         },
//         {
//             path: '*',
//             element: <Navigate to="/404" replace />,
//         },
//     ]);

//     return routes;
// }
