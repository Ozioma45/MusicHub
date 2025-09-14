import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
} from "@react-email/components";

interface NotificationEmailProps {
  title: string;
  message: string;
  type: "BOOKING" | "MESSAGE" | "REVIEW" | "SYSTEM";
}

export default function NotificationEmail({
  title,
  message,
  type,
}: NotificationEmailProps) {
  // 🎨 Pick styles/icons per type
  const config = {
    BOOKING: {
      color: "#2563eb", // blue
      icon: "https://cdn-icons-png.flaticon.com/512/126/126083.png", // calendar icon
    },
    MESSAGE: {
      color: "#16a34a", // green
      icon: "https://cdn-icons-png.flaticon.com/512/2462/2462719.png", // chat bubble
    },
    REVIEW: {
      color: "#f59e0b", // amber
      icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", // star
    },
    SYSTEM: {
      color: "#6b7280", // gray
      icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png", // cog/settings
    },
  }[type];

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}
      >
        <Container
          style={{
            margin: "40px auto",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
        >
          {/* ✅ Header */}
          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Img
                src="https://cdn-icons-png.flaticon.com/512/727/727245.png" // music logo (replace with your brand asset)
                width="28"
                height="28"
                alt="MusiConnect"
                style={{ marginRight: "8px" }}
              />
              <span
                style={{ fontWeight: "bold", fontSize: "18px", color: "#111" }}
              >
                MusiConnect
              </span>
            </div>
          </Section>

          {/* ✅ Notification Icon */}
          <Section style={{ textAlign: "center", marginBottom: "16px" }}>
            <Img
              src={config.icon}
              width="40"
              height="40"
              alt={type}
              style={{
                display: "inline-block",
                backgroundColor: config.color,
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </Section>

          {/* ✅ Title & Message */}
          <Heading
            style={{
              fontSize: "20px",
              marginBottom: "12px",
              color: config.color,
              textAlign: "center",
            }}
          >
            {title}
          </Heading>
          <Section>
            <Text
              style={{ fontSize: "16px", color: "#555", textAlign: "center" }}
            >
              {message}
            </Text>
          </Section>

          {/* ✅ Footer */}
          <Section style={{ marginTop: "24px" }}>
            <Text
              style={{ fontSize: "14px", color: "#999", textAlign: "center" }}
            >
              This is an automated notification from MusiConnect. Please do not
              reply.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
