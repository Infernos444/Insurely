import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Card,
  message,
  Checkbox,
} from "antd";
import {
  GoogleOutlined,
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";

const { Title, Text, Link } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      await updateProfile(userCredential.user, {
        displayName: values.name,
      });

      message.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      message.success("Google signup successful!");
      navigate("/patientdashboard");
    } catch (error) {
      message.error(error.message || "Google signup failed");
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
        padding: "60px",
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
            maxWidth: "500px",
            borderRadius: "16px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
          }}
          bodyStyle={{ padding: "60px" }}
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
              Create your account to get started
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined style={{ color: "rgba(244, 248, 211, 0.7)" }} />
                }
                placeholder="Full Name"
                style={inputStyle}
              />
            </Form.Item>

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
                style={inputStyle}
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
                  <LockOutlined style={{ color: "rgba(244, 248, 211, 0.7)" }} />
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
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: "rgba(244, 248, 211, 0.7)" }} />
                }
                placeholder="Confirm Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone style={{ color: "#A6D6D6" }} />
                  ) : (
                    <EyeInvisibleOutlined
                      style={{ color: "rgba(244, 248, 211, 0.5)" }}
                    />
                  )
                }
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must accept the terms and conditions")
                        ),
                },
              ]}
            >
              <Checkbox style={{ color: "rgba(244, 248, 211, 0.7)" }}>
                I agree to the{" "}
                <Link style={{ color: "#A6D6D6" }}>Terms and Conditions</Link>
              </Checkbox>
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
                Create Account
              </Button>
            </Form.Item>
          </Form>

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
            onClick={handleGoogleSignup}
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
              Already have an account?{" "}
              <Link
                onClick={() => navigate("/login")}
                style={{ color: "#A6D6D6", fontWeight: 500 }}
              >
                Login
              </Link>
            </Text>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const inputStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  borderColor: "rgba(244, 248, 211, 0.3)",
  color: "#F4F8D3",
  height: "48px",
  borderRadius: "8px",
};

export default Signup;
