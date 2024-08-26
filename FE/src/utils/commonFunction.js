class CommonFunction {
    // lấy tên role từ id
    static getRoleName = (id) => {
        switch (id) {
            case 1:
                return 'Admin';
            case 2:
                return 'Manager';
            case 3:
                return 'Staff';
            default:
                return 'Unknown';
        }
    };

    static IsAdmin() {
        const role = localStorage.getItem('ROLE');
        return role === '1';
    }

    static IsManager() {
        const role = localStorage.getItem('ROLE');
        return role === '2';
    }

    static IsStaff() {
        const role = localStorage.getItem('ROLE');
        return role === '3';
    }
}

export default CommonFunction;
