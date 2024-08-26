import { Helmet } from 'react-helmet-async';

import { CustomerView } from 'src/sections/customer/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Customer  </title>
      </Helmet>

      <CustomerView />
    </>
  );
}
