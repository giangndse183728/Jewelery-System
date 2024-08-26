import { Helmet } from 'react-helmet-async';

import { GoldPriceView } from 'src/sections/goldprice/view';
// ----------------------------------------------------------------------
export default function GoldPricePage() {
  return (
    <>
      <Helmet>
        <title> GoldPrice  </title>
      </Helmet>

      <GoldPriceView />
    </>
  );
}