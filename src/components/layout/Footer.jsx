function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        marginTop: "50px",
      }}
    >
      <p>© {new Date().getFullYear()} Rentflow360. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
