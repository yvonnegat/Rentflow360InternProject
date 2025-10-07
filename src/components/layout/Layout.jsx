import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, className = "" }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header />
      </header>

      <main className={`flex-grow ${className}`}>
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
