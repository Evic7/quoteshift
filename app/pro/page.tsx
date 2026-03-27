"use client";

export default function ProPage() {
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      {/* Background Elements */}
      <div style={styles.gradientBg}></div>
      <div style={styles.orb}></div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.badge}>Premium Tier</div>
          <h1 style={styles.mainTitle}>
            Elevate Your <span style={styles.highlight}>Potential</span>
          </h1>
          <p style={styles.subtitle}>
            Unlock unlimited possibilities with professional-grade tools and dedicated support.
          </p>
        </div>   

        {/* Pricing Card */}
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            {/* Price Section */}
            <div style={styles.priceSection}>
              <div style={styles.currencySymbol}>$</div>
              <div style={styles.priceAmount}>10</div>
              <div style={styles.pricePeriod}>/month</div>
              <p style={styles.disclaimer}>Cancel anytime • No commitment</p>
            </div>

            {/* Divider */}
            <div style={styles.divider}></div>

            {/* Features List */}
            <ul style={styles.featuresList}>
              {[
                "Unlimited AI quote generations",
                "Professional PDF & HTML exports",
                "Custom design & branding control",
                "Advanced pricing rules",
                "Full quote history & management",
                "Priority support & features"
              ].map((feature, idx) => (
                <li key={idx} style={styles.featureItem}>
                  <span style={styles.checkmark}>✓</span>
                  <span style={styles.featureText}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a
              href="https://whop.com/quoteshift/quoteshift-pro/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.ctaButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #1e40af 0%, #0891b2 100%)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(30, 64, 175, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(30, 64, 175, 0.15)";
              }}
            >
              Upgrade to Pro
            </a>

            {/* Security Badge */}
            <div style={styles.securityBadge}>
              <span style={styles.lockIcon}>🔒</span>
              <span style={styles.securityText}>Secure payment via Whop</span>
            </div>
          </div>

          {/* Side Accent */}
          <div style={styles.cardAccent}></div>
        </div>

        {/* Trust Indicators */}
        <div style={styles.trustSection}>
          <p style={styles.trustText}>Trusted by creators and businesses worldwide</p>
        </div>
      </div>
    </div>
  );
}

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap');

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes glow {
    0%, 100% {
      opacity: 0.4;
      transform: translate(0, 0);
    }
    50% {
      opacity: 0.6;
      transform: translate(10px, -10px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "hidden",
    backgroundColor: "#fafbfc",
    fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  gradientBg: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #f5f7fa 100%)",
    pointerEvents: "none" as const,
  },

  orb: {
    position: "absolute" as const,
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "-100px",
    right: "-100px",
    animation: "glow 8s ease-in-out infinite",
    pointerEvents: "none" as const,
  },

  contentWrapper: {
    position: "relative" as const,
    zIndex: 1,
    width: "100%",
    maxWidth: "500px",
    padding: "40px 24px",
    margin: "0 auto",
    animation: "fadeInUp 0.8s ease-out",
  },

  headerSection: {
    textAlign: "center" as const,
    marginBottom: "48px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    color: "#1e40af",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    marginBottom: "16px",
    animation: "slideInRight 0.6s ease-out 0.1s both",
  },

  mainTitle: {
    fontSize: "56px",
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#0f172a",
    marginBottom: "16px",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "-1.5px",
    animation: "fadeInUp 0.8s ease-out 0.2s both",
  },

  highlight: {
    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "18px",
    color: "#475569",
    lineHeight: 1.6,
    maxWidth: "420px",
    margin: "0 auto",
    animation: "fadeInUp 0.8s ease-out 0.3s both",
  },

  cardContainer: {
    position: "relative" as const,
    marginBottom: "48px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "48px 40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    animation: "fadeInUp 0.8s ease-out 0.4s both",
    position: "relative" as const,
    overflow: "hidden",
  },

  cardAccent: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(180deg, #2563eb 0%, #06b6d4 100%)",
    borderRadius: "24px 0 0 24px",
  },

  priceSection: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },

  currencySymbol: {
    fontSize: "24px",
    color: "#64748b",
    fontWeight: 600,
    display: "inline-block",
    marginRight: "2px",
  },

  priceAmount: {
    fontSize: "72px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
    fontFamily: "'Poppins', sans-serif",
    display: "inline-block",
    marginRight: "8px",
  },

  pricePeriod: {
    fontSize: "20px",
    color: "#64748b",
    fontWeight: 500,
    display: "inline-block",
  },

  disclaimer: {
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "12px",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },

  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)",
    margin: "32px 0",
  },

  featuresList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 32px 0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "15px",
    color: "#334155",
    lineHeight: 1.5,
  },

  checkmark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    width: "20px",
    height: "20px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },

  featureText: {
    fontWeight: 500,
  },

  ctaButton: {
    display: "block",
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center" as const,
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 25px rgba(30, 64, 175, 0.15)",
    letterSpacing: "0.3px",
  },

  securityBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "16px",
    fontSize: "12px",
    color: "#64748b",
  },

  lockIcon: {
    fontSize: "14px",
  },

  securityText: {
    fontWeight: 500,
  },

  trustSection: {
    textAlign: "center" as const,
    animation: "fadeInUp 0.8s ease-out 0.5s both",
  },

  trustText: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
};