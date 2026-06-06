export default function SkipLink() {
  const links = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#faq-search", label: "Skip to FAQ search" },
    { href: "#faq-results-heading", label: "Skip to FAQ results" },
    { href: "#need-more-help-heading", label: "Skip to contact help" },
  ];

  const baseStyle = {
    position: "absolute",
    left: "-9999px",
    top: "auto",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    zIndex: 3000,
    background: "#ffffff",
    color: "#000000",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #006225",
    fontWeight: 700,
    textDecoration: "none",
  };

  function showLink(e, index) {
    e.currentTarget.style.left = "16px";
    e.currentTarget.style.top = `${16 + index * 52}px`;
    e.currentTarget.style.width = "auto";
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.overflow = "visible";
  }

  function hideLink(e) {
    e.currentTarget.style.left = "-9999px";
    e.currentTarget.style.top = "auto";
    e.currentTarget.style.width = "1px";
    e.currentTarget.style.height = "1px";
    e.currentTarget.style.overflow = "hidden";
  }

  return (
    <>
      {links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          style={baseStyle}
          onFocus={(e) => showLink(e, index)}
          onBlur={hideLink}
        >
          {link.label}
        </a>
      ))}
    </>
  );
}
