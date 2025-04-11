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
  List,
  Spin
} from "antd";
import {
  UploadOutlined,
  FileImageOutlined,
  LogoutOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll
} from "firebase/storage"; // ✅ ADDED listAll

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const UploadPrescriptions = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const storage = getStorage();
      const filename = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `prescriptions/${filename}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const uploaded = {
        id: Date.now(),
        file_name: file.name,
        file_url: fileURL,
        uploaded_at: new Date().toISOString()
      };

      setPrescriptions(prev => [uploaded, ...prev]);
      message.success('Prescription uploaded successfully!');
    } catch (error) {
      console.error("Upload error:", error);
      message.error('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIXED fetchPrescriptions to list files from Firebase Storage
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const storage = getStorage();
      const listRef = ref(storage, 'prescriptions/');
      const result = await listAll(listRef);

      const items = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const timestamp = parseInt(itemRef.name.split("-")[0]); // extract from filename
          return {
            id: itemRef.name,
            file_name: itemRef.name.split("-").slice(1).join("-"),
            file_url: url,
            uploaded_at: new Date(timestamp).toISOString()
          };
        })
      );

      // Sort by newest
      const sorted = items.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
      setPrescriptions(sorted);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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
                Prescription Management
              </Title>
              <Text style={{ color: colors.textSecondary }}>
                Upload and view your medical prescriptions
              </Text>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: "48px" }}>
            <Col span={24}>
              <Card
                style={{
                  borderRadius: "12px",
                  background: colors.cardBg,
                  border: `1px solid ${colors.primary}33`,
                  backdropFilter: "blur(10px)"
                }}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FileImageOutlined style={{ color: colors.primary, fontSize: "20px", marginRight: "12px" }} />
                    <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>Upload Prescription</Text>
                  </div>
                }
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  accept="image/*,.pdf"
                  beforeUpload={(file) => {
                    handleUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                  disabled={uploading}
                >
                  <div style={{ padding: "40px 20px" }}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: "48px", color: colors.primary }} />
                    </p>
                    <p className="ant-upload-text" style={{ color: colors.textPrimary }}>
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint" style={{ color: colors.textSecondary }}>
                      Supports JPG, PNG, PDF files
                    </p>
                    {uploading && (
                      <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <Spin size="large" />
                        <Text style={{ display: "block", marginTop: "8px", color: colors.textSecondary }}>
                          Uploading your file...
                        </Text>
                      </div>
                    )}
                  </div>
                </Upload.Dragger>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card
                style={{
                  borderRadius: "12px",
                  background: colors.cardBg,
                  border: `1px solid ${colors.secondary}33`,
                  backdropFilter: "blur(10px)"
                }}
                title={
                  <Text style={{ color: colors.textPrimary, fontSize: "18px" }}>
                    Your Prescriptions ({prescriptions.length})
                  </Text>
                }
                loading={loading}
              >
                {prescriptions.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={prescriptions}
                    renderItem={(item) => (
                      <List.Item
                        style={{ padding: "16px", borderBottom: `1px solid ${colors.secondary}20` }}
                        actions={[
                          <Button 
                            type="link" 
                            onClick={() => window.open(item.file_url, '_blank')}
                            style={{ color: colors.primary }}
                          >
                            View
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileImageOutlined style={{ fontSize: "24px", color: colors.primary }} />}
                          title={<Text style={{ color: colors.textPrimary }}>{item.file_name}</Text>}
                          description={
                            <Text style={{ color: colors.textSecondary }}>
                              Uploaded: {new Date(item.uploaded_at).toLocaleString()}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Text style={{ color: colors.textSecondary }}>
                      No prescriptions found. Upload your first prescription above.
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default UploadPrescriptions;
