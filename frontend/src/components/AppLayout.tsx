import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
