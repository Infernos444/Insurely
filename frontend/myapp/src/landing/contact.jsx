import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Space,
  message,
} from "antd";
import { motion } from "framer-motion";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Contact = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    console.log("Received values:", values);
    messageApi.success("Message sent successfully!");
    form.resetFields();
  };

  const contactMethods = [
    {
      icon: <MailOutlined style={{ fontSize: 24, color: "#00FFD1" }} />,
      title: "Email Us",
      content: "support@insurely.com",
      action: "mailto:support@insurely.com",
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 24, color: "#00FFD1" }} />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: (
        <EnvironmentOutlined style={{ fontSize: 24, color: "#00FFD1" }} />
      ),
      title: "Visit Us",
      content: "123 Tech Park, Bangalore, India",
      action: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    {
      icon: <LinkedinOutlined style={{ fontSize: 20 }} />,
      url: "https://linkedin.com/company/insurely",
      color: "#0A66C2",
    },
    {
      icon: <TwitterOutlined style={{ fontSize: 20 }} />,
      url: "https://twitter.com/insurely",
      color: "#1DA1F2",
    },
    {
      icon: <GithubOutlined style={{ fontSize: 20 }} />,
      url: "https://github.com/insurely",
      color: "#333",
    },
  ];

  return (
    <>
      {contextHolder}
      <motion.div
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px",
          background: "#FFFFFF", // ✅ Background now white
        }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <Title
            level={2}
            style={{
              color: "#1F2937",
              fontWeight: 800,
              marginBottom: 8,
              textAlign: "center",
              fontSize: "2.5rem",
            }}
          >
            Get In Touch
          </Title>
          <Text
            style={{
              display: "block",
              textAlign: "center",
              color: "#4A5568",
              fontSize: "1.1rem",
              marginBottom: 64,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Have questions or want to learn more about our services? Reach out to our team.
          </Text>

          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} md={12}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%" }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                  bodyStyle={{ padding: 40 }}
                >
                  <Title
                    level={3}
                    style={{
                      color: "#1F2937",
                      fontWeight: 700,
                      marginBottom: 32,
                    }}
                  >
                    Send Us a Message
                  </Title>

                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: "#00FFD1" }} />}
                        placeholder="Your Name"
                        style={{
                          padding: "12px 16px",
                          borderRadius: 8,
                          borderColor: "#00FFD1",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: "#00FFD1" }} />}
                        type="email"
                        placeholder="Your Email"
                        style={{
                          padding: "12px 16px",
                          borderRadius: 8,
                          borderColor: "#00FFD1",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="message"
                      rules={[{ required: true, message: "Please enter your message" }]}
                    >
                      <Input.TextArea
                        rows={6}
                        placeholder="Your Message"
                        style={{
                          padding: "12px 16px",
                          borderRadius: 8,
                          borderColor: "#00FFD1",
                          resize: "none",
                        }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SendOutlined />}
                          style={{
                            background: "linear-gradient(90deg, #00FFD1 0%, #3A7BD5 100%)",
                            color: "#1F2937",
                            fontWeight: 600,
                            fontSize: "1rem",
                            padding: "14px 32px",
                            borderRadius: 8,
                            width: "100%",
                            height: "auto",
                            border: "none",
                          }}
                        >
                          Send Message
                        </Button>
                      </motion.div>
                    </Form.Item>
                  </Form>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                style={{ height: "100%" }}
              >
                <Card
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                  bodyStyle={{ padding: 40 }}
                >
                  <Title
                    level={3}
                    style={{
                      color: "#1F2937",
                      fontWeight: 700,
                      marginBottom: 32,
                    }}
                  >
                    Contact Information
                  </Title>

                  <Text
                    style={{
                      color: "#4A5568",
                      fontSize: "1.1rem",
                      marginBottom: 32,
                      display: "block",
                    }}
                  >
                    We'd love to hear from you! Here are multiple ways to reach our team.
                  </Text>

                  <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    {contactMethods.map((method, index) => (
                      <motion.div key={index} whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                        <Button
                          type="text"
                          href={method.action}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "12px 16px",
                            width: "100%",
                            textAlign: "left",
                            height: "auto",
                            background: "rgba(0, 255, 209, 0.05)",
                            borderRadius: 8,
                            border: "1px solid rgba(0, 255, 209, 0.2)",
                          }}
                        >
                          {method.icon}
                          <div>
                            <Text
                              style={{
                                display: "block",
                                color: "#00FFD1",
                                fontWeight: 600,
                                fontSize: "1rem",
                              }}
                            >
                              {method.title}
                            </Text>
                            <Text
                              style={{
                                display: "block",
                                color: "#4A5568",
                                fontSize: "0.9rem",
                              }}
                            >
                              {method.content}
                            </Text>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </Space>

                  <Divider
                    style={{
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      margin: "40px 0",
                    }}
                  />

                  <Title
                    level={4}
                    style={{
                      color: "#1F2937",
                      fontWeight: 600,
                      marginBottom: 16,
                    }}
                  >
                    Follow Us
                  </Title>

                  <Space size={16}>
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          type="text"
                          href={social.url}
                          target="_blank"
                          icon={social.icon}
                          style={{
                            color: "#FFFFFF",
                            background: social.color,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                      </motion.div>
                    ))}
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Contact;
