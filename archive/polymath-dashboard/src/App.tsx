import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DashboardPage } from "@/pages/DashboardPage";
import { SetupPage } from "@/pages/SetupPage";
import { EarningsPage } from "@/pages/EarningsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { TaxCenterPage } from "@/pages/TaxCenterPage";
import { ToolsPage } from "@/pages/ToolsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/setup" element={<Navigate to="/setup/content" replace />} />
          <Route path="/setup/:ecosystem" element={<SetupPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/tax" element={<TaxCenterPage />} />
          <Route path="/tools" element={<ToolsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
