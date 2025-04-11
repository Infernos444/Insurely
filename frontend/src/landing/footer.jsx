import React from "react";
import { Layout, Row, Col, Typography, Space, Button } from "antd";
import {
  LinkedinOutlined,
  TwitterOutlined,
  GithubOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Footer } = Layout;
const { Title, Text } = Typography;

const FooterSection = () => {
  const socialLinks = [
    {
      icon: <LinkedinOutlined />,
      url: "https://linkedin.com/company/insurely",
      color: "#0A66C2",
    },
    {
      icon: <TwitterOutlined />,
      url: "https://twitter.com/insurely",
      color: "#1DA1F2",
    },
    {
      icon: <GithubOutlined />,
      url: "https://github.com/insurely",
      color: "#000000",
    },
    {
      icon: <MailOutlined />,
      url: "mailto:support@insurely.com",
      color: "#FFB703",
    },
  ];

  return (
    <Footer
      style={{
        background: "#1F2937",
        color: "#E0E0E0",
        padding: "60px 20px 20px",
      }}
    >
      <Row justify="space-between" gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Title
            level={3}
            style={{
              color: "#00FFD1",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            INSURELY
          </Title>
          <Text style={{ color: "#E0E0E0" }}>
            Empowering patients with smarter, more transparent insurance tools.
            Your bill. Your rights. Your clarity.
          </Text>
        </Col>

        <Col xs={24} md={6}>
          <Title level={4} style={{ color: "#00FFD1", fontWeight: 600 }}>
            Quick Links
          </Title>
          <Space direction="vertical">
            <Button type="link" href="/" style={{ color: "#E0E0E0" }}>
              Home
            </Button>
            <Button type="link" href="/about" style={{ color: "#E0E0E0" }}>
              About
            </Button>
            <Button type="link" href="/contact" style={{ color: "#E0E0E0" }}>
              Contact
            </Button>
            <Button type="link" href="/login" style={{ color: "#E0E0E0" }}>
              Login
            </Button>
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <Title level={4} style={{ color: "#00FFD1", fontWeight: 600 }}>
            Follow Us
          </Title>
          <Space size="middle">
            {socialLinks.map((social, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="text"
                  href={social.url}
                  target="_blank"
                  icon={social.icon}
                  style={{
                    background: social.color,
                    color: "#fff",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                />
              </motion.div>
            ))}
          </Space>
        </Col>
      </Row>

      <div
        style={{
          marginTop: 60,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 24,
          textAlign: "center",
          color: "#999",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} Insurely. All rights reserved.
      </div>
    </Footer>
  );
};

export default FooterSection;
