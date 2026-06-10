export default function AdminSpotsMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{localStorage.removeItem("timewalkAdminPassword");}catch(e){}',
        }}
      />
      {children}
    </>
  );
}
