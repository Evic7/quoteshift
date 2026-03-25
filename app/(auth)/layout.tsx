export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        #container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        #leftplace {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f4ff;
        }

        #leftplace img {
          width: 60%;
          max-width: 320px;
          object-fit: contain;
        }

        #rightplace {
          width: 50%;
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        @media (max-width: 800px) {
          #leftplace {
            display: none;
          }
          #rightplace {
            width: 100%;
          }
        }
      `}</style>

      <div id="container">
        <div id="leftplace">
          <img src="/logo.svg" />
        </div>
        <div id="rightplace">
          {children}
        </div>
      </div>
    </>
  );
}