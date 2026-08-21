import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { Beranda } from './pages/Beranda';
import { Masuk } from './pages/Masuk';

// Penjaga rute sementara — versi lengkap (per-peran, halaman "Tidak punya akses")
// dibangun di Task 06 sebagai <Terlindungi peran="...">.
function RuteTerlindungi({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="p-6">Memuat…</div>;
  if (!session) return <Navigate to="/masuk" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/masuk" element={<Masuk />} />
      <Route
        path="/"
        element={
          <RuteTerlindungi>
            <Beranda />
          </RuteTerlindungi>
        }
      />
    </Routes>
  );
}

export default App;
