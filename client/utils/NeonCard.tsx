export const NeonGradientCard = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm ${className}`}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 41, 117, 0.1) 0%, 
            rgba(0, 255, 241, 0.1) 100%
          ),
          linear-gradient(135deg, 
            rgba(17, 24, 39, 0.8) 0%, 
            rgba(31, 41, 55, 0.8) 100%
          )
        `,
        boxShadow: `
          0 0 20px rgba(255, 41, 117, 0.3),
          0 0 40px rgba(0, 255, 241, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        border: "1px solid transparent",
        backgroundClip: "padding-box",
      }}
      {...props}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-75"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 41, 117, 0.6) 0%, 
              rgba(0, 255, 241, 0.6) 50%,
              rgba(255, 41, 117, 0.6) 100%
            )
          `,
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
        }}
      />
      <div className="relative z-10 h-full w-full rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
