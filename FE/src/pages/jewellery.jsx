import { Helmet } from 'react-helmet-async';

import { JewelleryView } from 'src/sections/jewellery/view';
// ----------------------------------------------------------------------
export default function JewelleryPage() {
  return (
    <>
      <Helmet>
        <title> Jewellery  </title>
      </Helmet>

      <JewelleryView />
    </>
  );
}