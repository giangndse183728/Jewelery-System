import { Helmet } from 'react-helmet-async';

import { SaleView } from 'src/sections/sale/view';

// ----------------------------------------------------------------------

export default function SalePage() {
    return (
        <>
            <Helmet>
                <title> Sale </title>
            </Helmet>

            <SaleView />
        </>
    );
}
