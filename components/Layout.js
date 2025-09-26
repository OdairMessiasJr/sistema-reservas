// Em components/Layout.js

import Navbar from './Navbar'; // Corrija para ter o "N" maiúsculo

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container">{children}</main>
    </>
  );
}