export default function AdminSpotsMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            input:not([type="hidden"]):not([readonly]),
            textarea {
              border: 1px solid #999 !important;
              border-radius: 6px !important;
              background: #ffffff !important;
            }

            input:not([type="hidden"]):not([readonly]):focus,
            textarea:focus {
              border: 2px solid #111 !important;
              outline: none !important;
            }
          `,
        }}
      />
      {children}
    </>
  );
}
