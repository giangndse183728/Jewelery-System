import { differenceBy } from 'lodash';
import SvgColor from 'src/components/svg-color';

const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const getNavConfig = () => {
    const role = localStorage.getItem('ROLE');

    switch (role) {
        case '1':
            return [
                {
                    title: 'dashboard',
                    path: '/dashboard',
                    icon: icon('ic_analytics'),
                },

                {
                    title: 'customer',
                    path: '/customer',
                    icon: icon('ic_user'),
                },
                {
                    title: 'logout',
                    path: '/login',
                    icon: icon('ic_jew'),
                    action: () => {
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('TOKEN');
                        window.location.reload();
                    },
                },
            ];
        case '3':
            return [
                {
                    title: 'customer',
                    path: '/customer',

                    icon: icon('ic_user'),
                },
                {
                    title: 'Sale',
                    path: '/sale',
                    icon: icon('ic_bill'),
                },
                {
                    title: 'Purchase',
                    path: '/purchase',
                    icon: icon('ic_bill'),
                },
                {
                    title: 'GoldPrice',
                    path: '/goldprice',
                    icon: icon('ic_disabled'),
                },
                {
                    title: 'Jewellery',
                    path: '/jewellery',
                    icon: icon('ic_jew'),
                },
                {
                    title: 'Exchange',
                    path: '/exchange',
                    icon: icon('ic_jew'),
                },
                {
                    title: 'logout',
                    path: '/login',
                    icon: icon('ic_jew'),
                    action: () => {
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('TOKEN');
                        window.location.reload();
                    },
                },
            ];

        case '2':
            return [
                {
                    title: 'dashboard',
                    path: '/dashboard',
                    icon: icon('ic_analytics'),
                },
                {
                    title: 'customer',
                    path: '/customer',

                    icon: icon('ic_user'),
                },
                {
                    title: 'Jewellery',
                    path: '/jewellery',
                    icon: icon('ic_jew'),
                },
                {
                    title: 'Staff',
                    path: '/staff',
                    icon: icon('ic_staff'),
                },
                {
                    title: 'GoldPrice',
                    path: '/goldprice',
                    icon: icon('ic_disabled'),
                },
                {
                    title: 'Counter',
                    path: '/counter',
                    icon: icon('ic_customer'),
                },
                {
                    title: 'promotion',
                    path: '/promotion',
                    icon: icon('ic_promotion'),
                },
                {
                    title: 'logout',
                    path: '/login',
                    icon: icon('ic_jew'),
                    action: () => {
                        localStorage.removeItem('ROLE');
                        localStorage.removeItem('TOKEN');
                        window.location.reload();
                    },
                },
            ];

        default:
            return []; // Xử lý trường hợp mặc định nếu cần
    }
};

const navConfig = getNavConfig(); // Gọi hàm để lấy giá trị của navConfig

export default navConfig; // Xuất biến navConfig để sử dụng ở các file khác trong dự án của bạn
