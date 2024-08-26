import { Helmet } from 'react-helmet-async';

import { PurchaseView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

export default function PurchasePage() {
    return (
        <>
            <Helmet>
                <title> Purchase </title>
            </Helmet>

            <PurchaseView />
        </>
    );
}
