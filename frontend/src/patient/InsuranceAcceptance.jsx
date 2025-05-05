import React, { useState, useEffect } from "react";
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
  Modal,
  Progress,
  Tag,
  Descriptions,
  Empty
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  WarningOutlined,
  DollarOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  StarOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const fieldLabels = {
  age: 'Patient Age',
  treatment_cost: 'Treatment Cost',
  diagnosis_group: 'Diagnosis Group',
  policy_age: 'Policy Age (years)',
  sum_insured: 'Sum Insured',
  claim_history: 'Claim History',
  hospital_rating: 'Hospital Rating',
  pre_existing: 'Pre-existing Condition',
  in_network: 'In Network'
};

const InsuranceAcceptance = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadingEstimate, setUploadingEstimate] = useState(false);
  const [estimateUrl, setEstimateUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [userPolicies, setUserPolicies] = useState([]);
  const [activePolicy, setActivePolicy] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const colors = {
    primary: "#00BFA5",
    secondary: "#2962FF",
    background: "#121212",
    cardBg: "rgba(30, 30, 30, 0.9)",
    textPrimary: "#FFFFFF",
    textSecondary: "#B0BEC5",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FF9800"
  };

  useEffect(() => {
    const fetchUserPolicies = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "userPolicies"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const policies = [];
        querySnapshot.forEach((doc) => {
          policies.push({ id: doc.id, ...doc.data() });
        });
        setUserPolicies(policies);
        if (policies.length > 0) {
          setActivePolicy(policies[0].id);
        }
      }
    };
    
    fetchUserPolicies();
  }, [auth.currentUser]);

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
    setProcessingError(null);
    setProgressPercent(0);
    
    try {
      const storage = getStorage();
      // Create file ID matching your Firestore structure: userId_timestamp_filename
      const fileId = `${auth.currentUser.uid}_${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`;
      const filename = `estimates/${auth.currentUser.uid}/${fileId}`;
      const storageRef = ref(storage, filename);
      
      // Use uploadBytesResumable for progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressPercent(Math.round(progress));
        },
        (error) => {
          throw error;
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          setEstimateUrl(fileURL);
          setUploadedFileId(fileId);
          message.success('Estimate uploaded successfully! Processing will begin shortly.');
          
          // Clear previous data
          setExtractedData(null);
          setPrediction(null);
        }
      );
      
    } catch (error) {
      console.error("Upload error:", error);
      setProcessingError('Failed to upload estimate. Please try again.');
      message.error('Failed to upload estimate');
      setUploadingEstimate(false);
    }
  };

  const fetchPredictionData = async () => {
    if (!auth.currentUser || !uploadedFileId) {
      message.error('No user or file reference found');
      return;
    }

    setProcessing(true);
    setProcessingError(null);
    setProgressPercent(30); // Initial processing started
    
    try {
      // Construct the correct Firestore path
      const docPath = `users/${auth.currentUser.uid}/estimates/${uploadedFileId}`;
      const docRef = doc(db, docPath);
      
      // First check if data exists immediately
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        formatPredictionData(docSnap.data());
        return;
      }

      // Set up real-time listener if data doesn't exist yet
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Extracted data received:", data);
          
          // Validate required fields
          if (!data.age || !data.treatment_cost) {
            throw new Error("Incomplete data received from OCR processing");
          }
          
          formatPredictionData(data);
          unsubscribe(); // Stop listening after we get the data
        }
      });

      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProgressPercent(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 2000);

      // Timeout after 2 minutes if no response
      const timeout = setTimeout(() => {
        if (!extractedData) {
          setProcessingError('Processing timed out. Please try again.');
          setProcessing(false);
          unsubscribe();
        }
      }, 120000);

      return () => {
        clearTimeout(timeout);
        clearInterval(progressInterval);
        unsubscribe();
      };

    } catch (error) {
      console.error("Error fetching prediction:", error);
      setProcessingError(error.message || 'Failed to fetch prediction data');
      setProcessing(false);
    }
  };

  const formatPredictionData = (data) => {
    if (!data) {
      message.error('No prediction data available');
      return;
    }

    // Normalize data with fallbacks
    const normalizedData = {
      age: data.age || 'N/A',
      treatment_cost: data.treatment_cost || 0,
      diagnosis_group: data.diagnosis_group || 'Not specified',
      policy_age: data.policy_age || 0,
      sum_insured: data.sum_insured || 0,
      claim_history: data.claim_history || 0,
      hospital_rating: data.hospital_rating || 0,
      pre_existing: data.pre_existing !== undefined ? data.pre_existing : 0,
      in_network: data.in_network !== undefined ? data.in_network : 0
    };

    setExtractedData(normalizedData);
    setProgressPercent(100);
    
    // Calculate coverage metrics
    const coveragePercentage = normalizedData.sum_insured > 0 
      ? Math.min(100, Math.floor((normalizedData.sum_insured / normalizedData.treatment_cost) * 100))
      : 0;

    // Enhanced prediction logic
    const isAccepted = (
      normalizedData.treatment_cost <= normalizedData.sum_insured * 1.1 &&
      normalizedData.in_network === 1 &&
      (normalizedData.pre_existing === 0 || normalizedData.policy_age > 2)
    );

    const predictionResult = {
      status: isAccepted ? "Accepted" : "Rejected",
      confidence: isAccepted ? 
        Math.min(95, 80 + (normalizedData.sum_insured / normalizedData.treatment_cost * 15)) : 
        Math.min(95, 80 - (normalizedData.sum_insured / normalizedData.treatment_cost * 15)),
      message: isAccepted
        ? "Your estimate is likely to be accepted based on your coverage."
        : "Your estimate may be rejected due to coverage limitations.",
      details: {
        coverageMatch: `${coveragePercentage}%`,
        costVariance: normalizedData.sum_insured > 0
          ? `${Math.abs(((normalizedData.treatment_cost - normalizedData.sum_insured) / normalizedData.sum_insured * 100)).toFixed(2)}%`
          : "N/A",
        commonIssues: getCommonIssues(normalizedData),
        rawData: normalizedData
      }
    };

    setPrediction(predictionResult);
    setProcessing(false);
  };

  const getCommonIssues = (data) => {
    const issues = [];
    if (data.pre_existing === 1) issues.push("Pre-existing condition");
    if (data.in_network === 0) issues.push("Out-of-network provider");
    if (data.hospital_rating && data.hospital_rating < 3) issues.push("Low hospital rating");
    if (data.claim_history > 3) issues.push("High claim history");
    if (data.policy_age < 1) issues.push("New policy (<1 year)");
    
    return issues.length > 0 ? issues : ["No major issues detected"];
  };

  const handlePredict = async () => {
    if (!estimateUrl) {
      message.warning('Please upload an estimate first');
      return;
    }
    
    setShowPredictionModal(true);
    
    // Construct the correct Firestore path
    const docPath = `users/${auth.currentUser.uid}/estimates/${uploadedFileId}`;
    const docRef = doc(db, docPath);
    
    // First check if data already exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Data already exists, format it
      formatPredictionData(docSnap.data());
    } else {
      // Data doesn't exist yet, start processing
      message.info('Processing your estimate. This may take a minute...');
      fetchPredictionData();
    }
  };

  const handleRetryProcessing = () => {
    setProcessingError(null);
    fetchPredictionData();
  };

  const renderDataItem = (key, value) => {
    let displayValue = value;
    let tagColor = 'default';
    
    if (typeof value === 'number') {
      if (key.includes('cost') || key.includes('insured')) {
        displayValue = `₹${value.toLocaleString()}`;
        tagColor = 'green';
      } else if (key.includes('rating')) {
        tagColor = 'gold';
      }
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
      tagColor = value ? 'green' : 'red';
    }
    
    return (
      <Descriptions.Item label={fieldLabels[key]} key={key}>
        <Tag color={tagColor} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {displayValue}
        </Tag>
      </Descriptions.Item>
    );
  };

  const onPolicySubmit = (values) => {
    setLoading(true);
    console.log('Policy attached:', values);
    message.success('Policy attached successfully!');
    form.resetFields();
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: colors.background }}>
      <Header style={{
        background: "#1E1E1E",
        padding: "0 24px",
        borderBottom: `1px solid ${colors.primary}33`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1
      }}>
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
                background: colors.error,
                borderColor: colors.error,
                fontWeight: 500
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
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
                Insurance Acceptance Predictor
              </Title>
              <Text style={{ color: colors.textSecondary }}>
                Upload medical estimates to predict insurance acceptance likelihood
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
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  height: "100%"
                }}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FilePdfOutlined style={{ color: colors.primary, fontSize: "20px", marginRight: "12px" }} />
                    <Text style={{ color: colors.textPrimary, fontSize: "18px", fontWeight: 500 }}>
                      Medical Estimate Analysis
                    </Text>
                  </div>
                }
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  beforeUpload={(file) => {
                    handleEstimateUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                  disabled={uploadingEstimate || processing}
                >
                  <div style={{ padding: "20px" }}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: "36px", color: colors.primary }} />
                    </p>
                    <p className="ant-upload-text" style={{ color: colors.textPrimary }}>
                      {uploadingEstimate ? 'Uploading Estimate' : 
                       processing ? 'Processing Estimate' : 
                       'Upload Medical Estimate'}
                    </p>
                    <p className="ant-upload-hint" style={{ color: colors.textSecondary }}>
                      Supports PDF, Word, and image files
                    </p>
                    {(uploadingEstimate || processing) && (
                      <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <Progress 
                          percent={progressPercent} 
                          status={processingError ? 'exception' : 'active'}
                          strokeColor={processingError ? colors.error : colors.primary}
                        />
                        <Text style={{ display: "block", marginTop: "8px", color: colors.textSecondary }}>
                          {uploadingEstimate ? 'Uploading...' : 'Analyzing...'}
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
                      loading={processing}
                      style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        color: colors.background,
                        width: "100%",
                        fontWeight: 500,
                        height: "40px"
                      }}
                    >
                      {processing ? 'PROCESSING...' : 'VIEW PREDICTION'}
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
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  height: "100%"
                }}
                title={
                  <Text style={{ color: colors.textPrimary, fontSize: "18px", fontWeight: 500 }}>
                    Insurance Policy Details
                  </Text>
                }
              >
                {userPolicies.length > 0 ? (
                  <>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong style={{ color: colors.textPrimary, display: "block", marginBottom: "8px" }}>
                        Active Policy
                      </Text>
                      <Select
                        value={activePolicy}
                        onChange={setActivePolicy}
                        style={{ width: "100%" }}
                      >
                        {userPolicies.map(policy => (
                          <Option key={policy.id} value={policy.id}>
                            {policy.provider} - {policy.policyNumber}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    
                    {activePolicy && (
                      <div style={{ marginTop: "16px" }}>
                        <Text strong style={{ color: colors.textPrimary, display: "block" }}>
                          Coverage Summary
                        </Text>
                        <div style={{ 
                          background: "rgba(0,0,0,0.2)", 
                          borderRadius: "8px", 
                          padding: "12px", 
                          marginTop: "8px"
                        }}>
                          <Text style={{ color: colors.textSecondary, display: "block" }}>
                            <strong>Type:</strong> {userPolicies.find(p => p.id === activePolicy)?.coverageType}
                          </Text>
                          <Text style={{ color: colors.textSecondary, display: "block" }}>
                            <strong>Effective:</strong> {userPolicies.find(p => p.id === activePolicy)?.effectiveDate}
                          </Text>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
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
                          width: "100%",
                          height: "40px",
                          fontWeight: 500
                        }}
                      >
                        Attach Policy
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>

          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartOutlined style={{ color: colors.primary, fontSize: "20px", marginRight: "12px" }} />
                <Text style={{ color: colors.textPrimary, fontSize: "18px", fontWeight: 500 }}>
                  Insurance Estimate Analysis
                </Text>
              </div>
            }
            visible={showPredictionModal}
            onCancel={() => setShowPredictionModal(false)}
            footer={null}
            width={1000}
          >
            {processingError ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CloseCircleOutlined style={{ fontSize: "48px", color: colors.error, marginBottom: "16px" }} />
                <Title level={4} style={{ color: colors.textPrimary }}>
                  Processing Failed
                </Title>
                <Text style={{ color: colors.textSecondary, display: "block", marginBottom: "24px" }}>
                  {processingError}
                </Text>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleRetryProcessing}
                  style={{ background: colors.primary, borderColor: colors.primary }}
                >
                  Retry Processing
                </Button>
              </div>
            ) : processing ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Spin size="large" tip="Processing your document..." />
                <Progress 
                  percent={progressPercent} 
                  status="active" 
                  strokeColor={colors.primary}
                  style={{ maxWidth: 400, margin: '20px auto' }} 
                />
                <Text style={{ display: "block", marginTop: "16px", color: colors.textSecondary }}>
                  Analyzing your estimate... This may take up to 2 minutes.
                </Text>
              </div>
            ) : extractedData ? (
              <div>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card 
                      title="Extracted Insurance Data" 
                      style={{ marginBottom: 24 }}
                      extra={
                        <Tag color="blue">
                          {new Date().toLocaleString()}
                        </Tag>
                      }
                    >
                      <Descriptions bordered column={2} size="middle">
                        {Object.entries(extractedData).map(([key, value]) => renderDataItem(key, value))}
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>

                {prediction && (
                  <>
                    <Divider orientation="left">Prediction Results</Divider>
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Alert
                          message={
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {prediction.status === "Accepted" ? (
                                <CheckCircleOutlined style={{ 
                                  color: colors.success,
                                  fontSize: "24px",
                                  marginRight: "12px"
                                }} />
                              ) : (
                                <CloseCircleOutlined style={{ 
                                  color: colors.error,
                                  fontSize: "24px",
                                  marginRight: "12px"
                                }} />
                              )}
                              <Text strong style={{ fontSize: "18px" }}>
                                {prediction.status} ({prediction.confidence}% confidence)
                              </Text>
                            </div>
                          }
                          description={prediction.message}
                          type={prediction.status === "Accepted" ? "success" : "error"}
                          showIcon={false}
                          style={{ marginBottom: 24 }}
                        />
                      </Col>
                      
                      <Col span={12}>
                        <Card title="Coverage Analysis">
                          <Progress
                            type="dashboard"
                            percent={parseFloat(prediction.details.coverageMatch)}
                            strokeColor={colors.primary}
                            format={percent => (
                              <Text strong style={{ fontSize: "24px" }}>{percent}%</Text>
                            )}
                          />
                          <Text style={{ marginTop: 16, display: "block", textAlign: "center" }}>
                            Procedures Covered
                          </Text>
                        </Card>
                      </Col>
                      
                      <Col span={12}>
                        <Card title="Cost Variance">
                          <Progress
                            type="dashboard"
                            percent={parseFloat(prediction.details.costVariance)}
                            strokeColor={
                              parseFloat(prediction.details.costVariance) > 30 
                                ? colors.error 
                                : parseFloat(prediction.details.costVariance) > 15 
                                  ? colors.warning 
                                  : colors.success
                            }
                            format={percent => (
                              <Text strong style={{ fontSize: "24px" }}>{percent}%</Text>
                            )}
                          />
                          <Text style={{ marginTop: 16, display: "block", textAlign: "center" }}>
                            From Expected Costs
                          </Text>
                        </Card>
                      </Col>
                      
                      <Col span={24}>
                        <Card title="Potential Issues">
                          {prediction.details.commonIssues.map((issue, index) => (
                            <Alert
                              key={index}
                              message={issue}
                              type="warning"
                              showIcon
                              icon={<WarningOutlined />}
                              style={{ marginBottom: 8 }}
                            />
                          ))}
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            ) : (
              <Empty description="No processed data available" />
            )}
          </Modal>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default InsuranceAcceptance;