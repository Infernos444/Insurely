import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setVisible(!visible);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setVisible(false);
    }
  };

  return (
    <>
      {/* Navbar Header */}
      <Layout style={{ background: "#0f172a" }}>
        <Header
          style={{
            backgroundColor: "#1F2937",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            padding: "0 40px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "#00FFD1",
              fontSize: "24px",
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer",
            }}
            onClick={() => scrollToSection("home")}
          >
            INSURELY
          </div>

          <div className="nav-links" style={{ display: "flex", gap: 24 }}>
            <div className="desktop-menu" style={{ display: "flex", gap: 24 }}>
              {["Home", "About", "Contact"].map((label) => (
                <Button
                  key={label}
                  type="text"
                  style={{
                    color: "#E0E0E0",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                  onClick={() => scrollToSection(label.toLowerCase())}
                  onMouseEnter={(e) => (e.target.style.color = "#00FFD1")}
                  onMouseLeave={(e) => (e.target.style.color = "#E0E0E0")}
                >
                  {label}
                </Button>
              ))}
              <Button
                type="primary"
                onClick={() => navigate("/login")}
                style={{
                  background: "linear-gradient(90deg, #00FFD1 0%, #3A7BD5 100%)",
                  color: "#1F2937",
                  fontWeight: 600,
                  fontSize: "16px",
                  border: "none",
                  height: 40,
                }}
              >
                Login
              </Button>
            </div>
          </div>

          <div className="mobile-menu-icon" style={{ display: "none" }}>
            <MenuOutlined
              onClick={toggleDrawer}
              style={{ color: "#00FFD1", fontSize: 24, cursor: "pointer" }}
            />
          </div>
        </Header>
      </Layout>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        onClose={toggleDrawer}
        open={visible}
        bodyStyle={{ backgroundColor: "#1F2937", padding: "24px 16px" }}
      >
        {["Home", "About", "Contact"].map((label) => (
          <div
            key={label}
            onClick={() => scrollToSection(label.toLowerCase())}
            style={{
              padding: "16px 0",
              fontSize: "18px",
              color: "#E0E0E0",
              cursor: "pointer",
              fontWeight: 500,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#00FFD1")}
            onMouseLeave={(e) => (e.target.style.color = "#E0E0E0")}
          >
            {label}
          </div>
        ))}

        <Button
          type="primary"
          block
          size="large"
          style={{
            marginTop: "24px",
            background: "linear-gradient(90deg, #00FFD1 0%, #3A7BD5 100%)",
            color: "#1F2937",
            fontWeight: 600,
            fontSize: "16px",
            height: 45,
            border: "none",
          }}
          onClick={() => {
            setVisible(false);
            navigate("/login");
          }}
        >
          Login
        </Button>
      </Drawer>

      {/* Responsive + Scroll Behavior */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
            .mobile-menu-icon {
              display: block !important;
            }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
