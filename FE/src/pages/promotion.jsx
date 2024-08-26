import { Helmet } from 'react-helmet-async';

import { PromotionView } from 'src/sections/promotions/view';

// ----------------------------------------------------------------------

export default function Promotion() {
  return (
    <>
      <Helmet>
        <title> Promotion</title>
      </Helmet>

      <PromotionView />
    </>
  );
}