import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Card,
  message,
} from "antd";
import {
  GoogleOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase"; // ✅ Adjust if path changes

const { Title, Text, Link } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      message.success("Google login successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #8E7DBE 0%, #1F2937 100%)",
        padding: "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
          bodyStyle={{ padding: "40px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Title
                level={2}
                style={{
                  color: "#F4F8D3",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                INSURELY
              </Title>
            </motion.div>
            <Text
              style={{
                color: "rgba(244, 248, 211, 0.7)",
                fontSize: "16px",
              }}
            >
              Welcome back! Please login to your account
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined style={{ color: "rgba(244, 248, 211, 0.7)" }} />
                }
                placeholder="Email"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(244, 248, 211, 0.3)",
                  color: "#F4F8D3",
                  height: "48px",
                  borderRadius: "8px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    style={{ color: "rgba(244, 248, 211, 0.7)" }}
                  />
                }
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone style={{ color: "#A6D6D6" }} />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: "rgba(244, 248, 211, 0.5)" }}
                    />
                  )
                }
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(244, 248, 211, 0.3)",
                  color: "#F4F8D3",
                  height: "48px",
                  borderRadius: "8px",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: "48px",
                  background:
                    "linear-gradient(90deg, #A6D6D6 0%, #8E7DBE 100%)",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1F2937",
                  marginTop: "8px",
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <Link
              onClick={() => navigate("/forgot-password")}
              style={{ color: "#A6D6D6" }}
            >
              Forgot password?
            </Link>
          </div>

          <Divider
            style={{
              borderColor: "rgba(244, 248, 211, 0.2)",
              color: "rgba(244, 248, 211, 0.5)",
            }}
          >
            OR
          </Divider>

          <Button
            icon={<GoogleOutlined />}
            block
            onClick={handleGoogleLogin}
            loading={loading}
            style={{
              height: "48px",
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(244, 248, 211, 0.3)",
              color: "#F4F8D3",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Continue with Google
          </Button>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Text style={{ color: "rgba(244, 248, 211, 0.7)" }}>
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/signup")}
                style={{ color: "#A6D6D6", fontWeight: 500 }}
              >
                Sign up
              </Link>
            </Text>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
