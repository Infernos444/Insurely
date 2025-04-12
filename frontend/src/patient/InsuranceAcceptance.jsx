import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  Card,
  Typography,
  Row,
  Col,
  Layout,
  Button,
  Upload,
  message,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  Alert,
  Modal
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const InsuranceAcceptance = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadingEstimate, setUploadingEstimate] = useState(false);
  const [estimateUrl, setEstimateUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);

  const colors = {
    primary: "#00FFD1",
    secondary: "#3A7BD5",
    background: "#0f172a",
    cardBg: "rgba(255, 255, 255, 0.05)",
    textPrimary: "#FFFFFF",
    textSecondary: "#CBD5E1"
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
    }).catch((error) => {
      console.error("Logout error:", error);
      message.error('Failed to logout');
    });
  };

  const handleEstimateUpload = async (file) => {
    setUploadingEstimate(true);
    try {
      const storage = getStorage();
      const filename = `estimate-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `estimates/${filename}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);
      setEstimateUrl(fileURL);
      message.success('Estimate uploaded successfully!');
    } catch (error) {
      console.error("Upload error:", error);
      message.error('Failed to upload estimate');
    } finally {
      setUploadingEstimate(false);
    }
  };

  const handlePredict = () => {
    if (!estimateUrl) {
      message.warning('Please upload an estimate first');
      return;
    }

    setShowPredictionModal(true);
    setUploadingEstimate(true);
    
    // Simulate prediction (in a real app, this would call an API)
    setTimeout(() => {
      const randomAcceptance = Math.random() > 0.3 ? "Accepted" : "Rejected";
      setPrediction({
        status: randomAcceptance,
        confidence: (Math.random() * 80 + 20).toFixed(2),
        message: randomAcceptance === "Accepted" 
          ? "Your estimate has a high chance of being accepted by insurance providers." 
          : "Your estimate might face rejection due to coverage limitations.",
        details: {
          coverageMatch: `${Math.floor(Math.random() * 60 + 40)}%`,
          costVariance: `${Math.floor(Math.random() * 30)}%`,
          commonIssues: randomAcceptance === "Accepted" 
            ? ["None detected"] 
            : ["Procedure not covered", "Out-of-network provider", "Prior authorization needed"]
        }
      });
      setUploadingEstimate(false);
    }, 2000);
  };

  const onPolicySubmit = (values) => {
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      console.log('Policy attached:', values);
      message.success('Policy attached successfully!');
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

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
          <Row style={{ marginBottom: "32px" }}>
            <Col>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ color: colors.primary }}
              >
                Back
              </Button>
              <Title level={2} style={{ color: colors.textPrimary, marginTop: "16px" }}>
                Insurance Acceptance
              </Title>
              <Text style={{ color: colors.textSecondary }}>
                Manage your insurance policies and estimate acceptance
              </Text>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
            <Col span={24} md={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  background: colors.cardBg,
                  border: `1px solid ${colors.primary}33`,
                  backdropFilter: "blur(10px)",
                  height: "100%"
                }}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FilePdfOutlined style={{ color: colors.primary, fontSize: "20px", marginRight: "12px" }} />
                    <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>Billing Estimate Analysis</Text>
                  </div>
                }
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  accept=".pdf,.doc,.docx"
                  beforeUpload={(file) => {
                    handleEstimateUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                  disabled={uploadingEstimate}
                >
                  <div style={{ padding: "20px" }}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: "36px", color: colors.primary }} />
                    </p>
                    <p className="ant-upload-text" style={{ color: colors.textPrimary }}>
                      Upload Billing Estimate
                    </p>
                    <p className="ant-upload-hint" style={{ color: colors.textSecondary }}>
                      Supports PDF and Word documents
                    </p>
                    {uploadingEstimate && (
                      <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <Spin size="large" />
                        <Text style={{ display: "block", marginTop: "8px", color: colors.textSecondary }}>
                          Uploading your file...
                        </Text>
                      </div>
                    )}
                  </div>
                </Upload.Dragger>

                {estimateUrl && (
                  <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <Button
                      type="primary"
                      icon={<BarChartOutlined />}
                      onClick={handlePredict}
                      loading={uploadingEstimate}
                      style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        color: colors.background,
                        width: "100%"
                      }}
                    >
                      PREDICT ACCEPTANCE
                    </Button>
                  </div>
                )}
              </Card>
            </Col>

            <Col span={24} md={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  background: colors.cardBg,
                  border: `1px solid ${colors.secondary}33`,
                  backdropFilter: "blur(10px)",
                  height: "100%"
                }}
                title={
                  <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>
                    Attach Insurance Policy
                  </Text>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onPolicySubmit}
                >
                  <Form.Item
                    name="provider"
                    label={<Text style={{ color: colors.textPrimary }}>Insurance Provider</Text>}
                    rules={[{ required: true, message: 'Please select your provider' }]}
                  >
                    <Select
                      placeholder="Select your insurance provider"
                      style={{ width: "100%" }}
                    >
                      <Option value="aetna">Aetna</Option>
                      <Option value="bluecross">Blue Cross Blue Shield</Option>
                      <Option value="united">United Healthcare</Option>
                      <Option value="cigna">Cigna</Option>
                      <Option value="humana">Humana</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="policyNumber"
                    label={<Text style={{ color: colors.textPrimary }}>Policy Number</Text>}
                    rules={[{ required: true, message: 'Please input your policy number' }]}
                  >
                    <Input placeholder="Enter your policy number" />
                  </Form.Item>

                  <Form.Item
                    name="coverageType"
                    label={<Text style={{ color: colors.textPrimary }}>Coverage Type</Text>}
                    rules={[{ required: true, message: 'Please select coverage type' }]}
                  >
                    <Select
                      placeholder="Select coverage type"
                      style={{ width: "100%" }}
                    >
                      <Option value="individual">Individual</Option>
                      <Option value="family">Family</Option>
                      <Option value="employer">Employer-Sponsored</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="effectiveDate"
                    label={<Text style={{ color: colors.textPrimary }}>Effective Date</Text>}
                    rules={[{ required: true, message: 'Please select effective date' }]}
                  >
                    <Input type="date" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{
                        background: colors.secondary,
                        borderColor: colors.secondary,
                        width: "100%"
                      }}
                    >
                      Attach Policy
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* Prediction Modal */}
          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartOutlined style={{ color: colors.primary, fontSize: "20px", marginRight: "12px" }} />
                <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>Estimate Prediction</Text>
              </div>
            }
            visible={showPredictionModal}
            onCancel={() => setShowPredictionModal(false)}
            footer={[
              <Button
                key="close"
                onClick={() => setShowPredictionModal(false)}
                style={{
                  background: colors.secondary,
                  borderColor: colors.secondary
                }}
              >
                Close
              </Button>
            ]}
            width={800}
            bodyStyle={{
              background: colors.cardBg,
              borderRadius: "12px",
              padding: "24px"
            }}
          >
            {uploadingEstimate ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Spin size="large" />
                <Text style={{ display: "block", marginTop: "16px", color: colors.textSecondary }}>
                  Analyzing your estimate and predicting acceptance...
                </Text>
              </div>
            ) : prediction ? (
              <div>
                <Alert
                  message={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleOutlined style={{ 
                        color: prediction.status === "Accepted" ? "#52c41a" : "#f5222d",
                        fontSize: "20px",
                        marginRight: "8px"
                      }} />
                      <Text strong style={{ color: colors.textPrimary, fontSize: "16px" }}>
                        Prediction: {prediction.status} ({prediction.confidence}% confidence)
                      </Text>
                    </div>
                  }
                  description={
                    <Text style={{ color: colors.textSecondary }}>
                      {prediction.message}
                    </Text>
                  }
                  type={prediction.status === "Accepted" ? "success" : "error"}
                  showIcon={false}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "none",
                    borderRadius: "8px",
                    marginBottom: "24px"
                  }}
                />

                <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

                <Title level={4} style={{ color: colors.textPrimary, marginBottom: "16px" }}>
                  Prediction Details
                </Title>

                <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "rgba(0,0,0,0.1)",
                        border: `1px solid ${colors.primary}33`
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Text strong style={{ color: colors.textPrimary, display: "block" }}>
                        Coverage Match
                      </Text>
                      <Text style={{ color: colors.primary, fontSize: "24px", fontWeight: "bold" }}>
                        {prediction.details.coverageMatch}
                      </Text>
                      <Text style={{ color: colors.textSecondary }}>
                        of procedures covered
                      </Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: "rgba(0,0,0,0.1)",
                        border: `1px solid ${colors.primary}33`
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Text strong style={{ color: colors.textPrimary, display: "block" }}>
                        Cost Variance
                      </Text>
                      <Text style={{ color: colors.primary, fontSize: "24px", fontWeight: "bold" }}>
                        {prediction.details.costVariance}
                      </Text>
                      <Text style={{ color: colors.textSecondary }}>
                        from expected costs
                      </Text>
                    </Card>
                  </Col>
                </Row>

                <Title level={4} style={{ color: colors.textPrimary, marginBottom: "16px" }}>
                  Potential Issues
                </Title>
                <ul style={{ color: colors.textSecondary, paddingLeft: "24px" }}>
                  {prediction.details.commonIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Modal>

          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card
                style={{
                  borderRadius: "12px",
                  background: colors.cardBg,
                  border: `1px solid ${colors.primary}33`,
                  backdropFilter: "blur(10px)"
                }}
                title={
                  <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>
                    Next Steps
                  </Text>
                }
              >
                <div style={{ padding: "16px" }}>
                  <Text style={{ color: colors.textSecondary }}>
                    After attaching your policy and analyzing estimates, you can:
                  </Text>
                  <ul style={{ color: colors.textSecondary, marginTop: "12px", paddingLeft: "24px" }}>
                    <li>View detailed coverage information</li>
                    <li>Compare estimated costs with your coverage</li>
                    <li>Submit pre-authorization requests</li>
                    <li>Track claim status</li>
                  </ul>
                  <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  <Button 
                    type="primary" 
                    style={{ 
                      background: colors.primary,
                      borderColor: colors.primary,
                      color: colors.background
                    }}
                    onClick={() => message.info('Feature coming soon!')}
                  >
                    View Coverage Details
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default InsuranceAcceptance;