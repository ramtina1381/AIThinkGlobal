import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';

function RootLayout() {
  // const navigation = useNavigation();

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>

  );
}

export default RootLayout;
