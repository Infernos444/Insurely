import React from "react";
import { 
  Button, 
  Row, 
  Col, 
  Typography, 
  Card, 
  Space, 
  Divider,
  Statistic,
  Avatar,
  Carousel
} from "antd";
import { 
  motion,
  AnimatePresence
} from "framer-motion";
import { 
  FileSearchOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  CloudSyncOutlined,
  TeamOutlined,
  CheckCircleFilled,
  StarFilled,
  HeartFilled,
  ThunderboltFilled
} from "@ant-design/icons";
import GlitchText from "../assets/GlitchText";

const { Title, Text, Paragraph } = Typography;
const { CountUp } = Statistic;

const Home = () => {
  // Feature data
  const features = [
    {
      icon: <FileSearchOutlined />,
      title: "Smart Bill Parsing",
      description: "Advanced OCR and NLP algorithms analyze hospital bills with 98% accuracy",
      color: "#1890ff",
      stats: [
        { value: 98, suffix: "%", label: "Accuracy" },
        { value: 5, suffix: "sec", label: "Processing" }
      ]
    },
    {
      icon: <ExclamationCircleOutlined />,
      title: "Claim Denial Prediction",
      description: "ML models predict rejection risks with 89% accuracy",
      color: "#ff4d4f",
      stats: [
        { value: 89, suffix: "%", label: "Accuracy" },
        { value: 50, suffix: "K+", label: "Claims" }
      ]
    },
    {
      icon: <DollarOutlined />,
      title: "Cost Transparency",
      description: "Compare procedure costs across 2000+ Indian hospitals",
      color: "#52c41a",
      stats: [
        { value: 2000, suffix: "+", label: "Hospitals" },
        { value: 40, suffix: "%", label: "Savings" }
      ]
    },
    {
      icon: <GlobalOutlined />,
      title: "Geo Insights",
      description: "Interactive heatmaps showing regional approval rates",
      color: "#722ed1",
      stats: [
        { value: 22, suffix: "", label: "States" },
        { value: 95, suffix: "%", label: "Coverage" }
      ]
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "INSURELY helped me recover ₹1.2L in hidden charges I would have never noticed. The denial prediction saved me from 3 potential claim rejections!",
      author: "Ananya R, Bengaluru",
      role: "Breast Cancer Survivor",
      rating: 5,
      avatarColor: "#1890ff"
    },
    {
      id: 2,
      quote: "As a senior citizen, comparing hospital costs was overwhelming. INSURELY's geo-insights helped me choose an affordable cardiac center with 95% approval rates.",
      author: "Ravi Mehta, Pune",
      role: "Heart Patient",
      rating: 4,
      avatarColor: "#ff4d4f"
    },
    {
      id: 3,
      quote: "The community bill sharing helped me negotiate 40% lower package rates for my mother's knee replacement. This transparency is revolutionary!",
      author: "Priya Desai, Mumbai",
      role: "Caregiver",
      rating: 5,
      avatarColor: "#52c41a"
    }
  ];

  // Stats data
  const stats = [
    { 
      icon: <CloudSyncOutlined style={{ fontSize: 36 }} />,
      value: 10250,
      suffix: "+",
      label: "Bills Analyzed",
      color: "#1890ff"
    },
    { 
      icon: <BarChartOutlined style={{ fontSize: 36 }} />,
      value: 89,
      suffix: "%",
      label: "Prediction Accuracy",
      color: "#ff4d4f"
    },
    { 
      icon: <TeamOutlined style={{ fontSize: 36 }} />,
      value: 52300,
      suffix: "+",
      label: "Active Users",
      color: "#52c41a"
    },
    { 
      icon: <SafetyCertificateOutlined style={{ fontSize: 36 }} />,
      value: 4.9,
      precision: 1,
      label: "User Rating",
      color: "#722ed1"
    }
  ];

  const orbitIcons = [
    FileSearchOutlined,
    DollarOutlined,
    GlobalOutlined,
    ExclamationCircleOutlined
  ];
  

  return (
    <div id='home' style={{ overflowX: "hidden" }}>
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1F2937 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: 1200,
            width: "100%",
            zIndex: 2,
            padding: "0 24px"
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Text
              style={{
                color: "#00FFD1",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
                display: "block"
              }}
            >
              INSURANCE MADE INTELLIGENT
            </Text>
          </motion.div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              marginBottom: 24,
              position: "relative",
              flexWrap: "wrap"
            }}
          >
            {/* Text section */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <Title
                level={1}
                style={{
                  color: "#FFFFFF",
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  lineHeight: 1.2
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: "block" }}
                >
                  Predict.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ display: "block" }}
                >
                  Compare.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{ display: "block" }}
                >
                  Choose Wisely.
                </motion.span>
              </Title>
            </div>

            {/* 3D Orbit Container */}
            <motion.div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                height: "300px",
                width: "300px",
                perspective: "1000px"
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Three 3D Rings surrounding the text */}
              {[1, 2, 3].map((ring) => {
                const size = 180 + ring * 40; // Different sizes for each ring
                const thickness = 1 + ring * 0.5; // Different thickness for each ring
                const color = ["rgba(0, 255, 209, 0.6)", "rgba(58, 123, 213, 0.4)", "rgba(114, 46, 209, 0.3)"][ring - 1]; // Different colors with transparency
                
                return (
                  <motion.div
                    key={ring}
                    style={{
                      position: "absolute",
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      border: `${thickness}px solid ${color}`,
                      zIndex: 1,
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${60 + ring * 15}deg) rotateY(${45 + ring * 10}deg)`
                    }}
                    animate={{ 
                      rotateX: 360,
                      rotateY: 360,
                      rotateZ: ring % 2 === 0 ? 360 : -360
                    }}
                    transition={{
                      duration: 20 + ring * 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Add some orbiting elements to each ring */}
                    {[0, 1, 2, 3].map((i) => {
                      const angle = (i / 4) * 2 * Math.PI;
                      const x = (size / 2) * Math.cos(angle);
                      const y = (size / 2) * Math.sin(angle);
                      
                      return (
                        <motion.div
                          key={i}
                          style={{
                            position: "absolute",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: color,
                            zIndex: 2,
                            transform: `translate(${x}px, ${y}px)`
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      );
                    })}
                  </motion.div>
                );
              })}

              {/* GlitchText Centerpiece - now positioned within the rings */}
              <div style={{ 
                position: "relative", 
                zIndex: 2,
                transformStyle: "preserve-3d",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <GlitchText
                  speed={0.8}
                  enableShadows={true}
                  enableOnHover={false}
                  style={{
                    fontSize: "4rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "#FFFFFF",
                    transform: "translateZ(50px)"
                  }}
                >
                  INSURELY
                </GlitchText>
              </div>

              {/* Orbiting Icons */}
              <motion.div
                style={{
                  position: "absolute",
                  width: "240px",
                  height: "240px",
                  transformStyle: "preserve-3d"
                }}
                animate={{ 
                  rotateX: 360,
                  rotateY: 360,
                  rotateZ: 0
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {orbitIcons.map((IconComponent, index) => {
                  const angle = (index / orbitIcons.length) * 2 * Math.PI;
                  const radius = 120;
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={index}
                      style={{
                        position: "absolute",
                        fontSize: "24px",
                        color: "#00FFD1",
                        zIndex: 3,
                        transform: `translate3d(${x}px, ${y}px, 0) rotateY(${angle * (180/Math.PI)}deg)`
                      }}
                      animate={{
                        rotateY: 360,
                        rotateX: 360
                      }}
                      transition={{
                        duration: 15 + index * 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <IconComponent />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Paragraph
              style={{
                color: "#E0E0E0",
                fontSize: "1.25rem",
                marginBottom: 40,
                maxWidth: 500
              }}
            >
              Leveraging AI and community wisdom to demystify healthcare costs and insurance processes.
              Get real-time insights, predictive analytics, and actionable recommendations.
            </Paragraph>
          </motion.div>

          {/* CTA Buttons */}
          <Space size={24} style={{ marginTop: 16 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  background: "linear-gradient(90deg, #00FFD1 0%, #3A7BD5 100%)",
                  color: "#1F2937",
                  fontWeight: 600,
                  height: 50,
                  padding: "0 32px",
                  border: "none",
                  borderRadius: 8
                }}
                icon={<ArrowRightOutlined />}
              >
                Analyze Your Bill
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="large"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  fontWeight: 600,
                  height: 50,
                  padding: "0 32px",
                  borderRadius: 8
                }}
              >
                Explore Community Data
              </Button>
            </motion.div>
          </Space>
        </motion.div>

        {/* Floating background elements */}
        {[1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              y: [0, -20, 0],
              x: Math.random() * 200 - 100
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
            style={{
              position: "absolute",
              fontSize: 24,
              color: "rgba(0, 255, 209, 0.3)",
              zIndex: 1,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`
            }}
          >
            {[<CheckCircleFilled />, <StarFilled />, <HeartFilled />, <ThunderboltFilled />][item % 4]}
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: "80px 24px",
        background: "#FFFFFF"
      }}>
        <Row gutter={[32, 32]} justify="center">
          {stats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  hoverable
                  style={{ 
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    textAlign: "center",
                    height: "100%"
                  }}
                  bodyStyle={{ padding: "32px 24px" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{
                      color: stat.color,
                      fontSize: 36,
                      marginBottom: 16
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <Statistic
                    value={stat.value}
                    suffix={stat.suffix}
                    precision={stat.precision}
                    valueStyle={{ 
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "#1F2937"
                    }}
                  />
                  <Text style={{ 
                    fontSize: "1rem",
                    color: "#718096",
                    marginTop: 8,
                    display: "block"
                  }}>
                    {stat.label}
                  </Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: "80px 24px",
        background: "#F8FAFC"
      }}>
        <div id='about' style={{ 
          maxWidth: 800,
          margin: "0 auto 60px",
          textAlign: "center"
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text style={{
              color: "#00FFD1",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              display: "block"
            }}>
              Innovative Protection
            </Text>
            <Title level={2} style={{ 
              color: "#1F2937",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: 16
            }}>
              Transforming Insurance Through Technology
            </Title>
            <Paragraph style={{ 
              color: "#718096",
              fontSize: "1.1rem"
            }}>
              Combining advanced AI with community-powered insights to create a new standard 
              in healthcare financial planning and insurance optimization.
            </Paragraph>
          </motion.div>
        </div>

        <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: "0 auto" }}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  style={{ 
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    height: "100%",
                    overflow: "hidden"
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      background: feature.color,
                      height: 120,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{ 
                        background: "rgba(255, 255, 255, 0.2)",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <div style={{ 
                        color: "white",
                        fontSize: 24
                      }}>
                        {feature.icon}
                      </div>
                    </motion.div>
                  </motion.div>

                  <div style={{ padding: "24px" }}>
                    <Title level={4} style={{ 
                      color: "#1F2937",
                      marginBottom: 16
                    }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ 
                      color: "#718096",
                      marginBottom: 24
                    }}>
                      {feature.description}
                    </Paragraph>

                    <Row gutter={16} style={{ marginTop: 24 }}>
                      {feature.stats.map((stat, i) => (
                        <Col key={i} span={12}>
                          <Statistic
                            value={stat.value}
                            suffix={stat.suffix}
                            valueStyle={{ 
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: feature.color
                            }}
                          />
                          <Text style={{ 
                            fontSize: "0.8rem",
                            color: "#718096"
                          }}>
                            {stat.label}
                          </Text>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Testimonials Section */}
      <section style={{ 
        padding: "80px 24px",
        background: "linear-gradient(135deg, #1F2937 0%, #0f172a 100%)"
      }}>
        <div style={{ 
          maxWidth: 800,
          margin: "0 auto 60px",
          textAlign: "center"
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Text style={{
              color: "#00FFD1",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              display: "block"
            }}>
              User Experiences
            </Text>
            <Title level={2} style={{ 
              color: "#FFFFFF",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: 16
            }}>
              Voices from Our Community
            </Title>
            <Paragraph style={{ 
              color: "#E0E0E0",
              fontSize: "1.1rem"
            }}>
              Join thousands of Indians who've taken control of their healthcare finances
            </Paragraph>
          </motion.div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Carousel
            autoplay
            autoplaySpeed={5000}
            effect="fade"
            dotPosition="bottom"
            dots={{ className: "testimonial-dots" }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} style={{ padding: "0 24px" }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card
                    style={{ 
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 12,
                      border: "none",
                      padding: "40px"
                    }}
                  >
                    <div style={{ 
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center"
                    }}>
                      <Avatar 
                        size={80}
                        style={{ 
                          backgroundColor: testimonial.avatarColor,
                          marginBottom: 24
                        }}
                        icon={<TeamOutlined />}
                      />
                      
                      <div style={{ marginBottom: 24 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarFilled 
                            key={i} 
                            style={{ 
                              color: i < testimonial.rating ? "#FFD700" : "#E0E0E0",
                              fontSize: 20,
                              margin: "0 2px"
                            }} 
                          />
                        ))}
                      </div>
                      
                      <Paragraph style={{ 
                        color: "#FFFFFF",
                        fontSize: "1.25rem",
                        fontStyle: "italic",
                        marginBottom: 32,
                        maxWidth: 800
                      }}>
                        "{testimonial.quote}"
                      </Paragraph>
                      
                      <Title level={4} style={{ 
                        color: "#FFFFFF",
                        marginBottom: 4
                      }}>
                        {testimonial.author}
                      </Title>
                      
                      <Text style={{ 
                        color: "#00FFD1",
                        fontSize: "0.9rem"
                      }}>
                        {testimonial.role}
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default Home;