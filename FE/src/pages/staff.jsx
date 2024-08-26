import { Helmet } from 'react-helmet-async';

import { StaffView } from 'src/sections/staff/view';

// ----------------------------------------------------------------------

export default function Staff() {
  return (
    <>
      <Helmet>
        <title> Staff</title>
      </Helmet>

      <StaffView />
    </>
  );
}