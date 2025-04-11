import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  Card,
  Typography,
  Row,
  Col,
  Layout,
  Space,
  Button,
  Divider,
  Tag  // Added Tag import
} from "antd";
import {
  UploadOutlined,
  InsuranceOutlined,
  LineChartOutlined,
  FileTextOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Patient');
  const auth = getAuth();

  // Color palette
  const colors = {
    primary: "#00FFD1",
    secondary: "#3A7BD5",
    accent: "#FFD700",
    background: "#0f172a",
    cardBg: "rgba(255, 255, 255, 0.05)",
    textPrimary: "#FFFFFF",
    textSecondary: "#CBD5E1"
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  useEffect(() => {
    // Fetch user data when component mounts
    const user = auth.currentUser;
    if (user && user.email) {
      // Extract username from email (remove @gmail.com part)
      const emailUsername = user.email.split('@')[0];
      setUsername(emailUsername);
    }
  }, [auth]);

  const features = [
    {
      title: "Upload Prescriptions",
      description: "Your Vault - Securely store all your medical documents",
      icon: <UploadOutlined />,
      route: "/uploadpre",
      color: colors.primary,
    },
    {
      title: "Insurance Status",
      description: "Check your current insurance coverage and benefits",
      icon: <InsuranceOutlined />,
      route: "/insusta",
      color: colors.secondary,
    },
    {
      title: "Cost Predictor",
      description: "Find the affordable alternative around you",
      icon: <LineChartOutlined />,
      route: "/predictor",
      color: colors.accent,
    },
    {
      title: "Medical Records",
      description: "Access your complete medical history",
      icon: <FileTextOutlined />,
      route: "/records",
      color: "#FF6B6B",
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: colors.background }}>
      <Header
        style={{
          background: "#1F2937",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 1
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Title
                level={3}
                style={{
                  color: colors.primary,
                  margin: "16px 0",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  cursor: "pointer"
                }}
                onClick={() => navigate("/")}
              >
                INSURELY
              </Title>
            </motion.div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ 
                background: colors.secondary,
                borderColor: colors.secondary
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "48px", maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Welcome Section */}
          <Row justify="center" style={{ marginBottom: "48px", textAlign: "center" }}>
            <Col>
              <Title level={2} style={{ color: colors.textPrimary, marginBottom: "8px" }}>
                Welcome back, {username}!
              </Title>
              <Text style={{ color: colors.textSecondary, fontSize: "16px" }}>
                What would you like to do today?
              </Text>
            </Col>
          </Row>

          {/* Main Features Section */}
          <Row gutter={[48, 48]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    hoverable
                    onClick={() => navigate(feature.route)}
                    style={{
                      borderRadius: "20px",
                      background: colors.cardBg,
                      border: `1px solid ${feature.color}33`,
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                      height: "380px",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease"
                    }}
                    bodyStyle={{
                      padding: "40px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `${feature.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 32px",
                        border: `2px solid ${feature.color}`,
                        boxShadow: `0 0 24px ${feature.color}33`
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        style: {
                          fontSize: "36px",
                          color: feature.color
                        }
                      })}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={3} style={{ 
                        color: colors.textPrimary, 
                        textAlign: "center",
                        marginBottom: "16px"
                      }}>
                        {feature.title}
                      </Title>
                      <Paragraph
                        style={{
                          color: colors.textSecondary,
                          textAlign: "center",
                          fontSize: "16px",
                          marginBottom: "24px"
                        }}
                      >
                        {feature.description}
                      </Paragraph>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Tag 
                        color={feature.color}
                        style={{ 
                          fontSize: "14px",
                          padding: "4px 12px",
                          borderRadius: "20px"
                        }}
                      >
                        {feature.badge}
                      </Tag>
                      <Text
                        style={{
                          display: "block",
                          marginTop: "12px",
                          color: feature.color,
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                      >
                        {feature.stats}
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default PatientDashboard;