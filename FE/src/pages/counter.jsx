import { Helmet } from 'react-helmet-async';

import { CounterView } from 'src/sections/counter/view';

// ----------------------------------------------------------------------

export default function Counter() {
  return (
    <>
      <Helmet>
        <title> Counter</title>
      </Helmet>

      <CounterView />
    </>
  );
}