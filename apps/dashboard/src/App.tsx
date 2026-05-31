import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DashboardPage } from "@/pages/DashboardPage";
import { SetupPage } from "@/pages/SetupPage";
import { EarningsPage } from "@/pages/EarningsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { TaxCenterPage } from "@/pages/TaxCenterPage";
import { ToolsPage } from "@/pages/ToolsPage";
import { LaunchPage } from "@/pages/LaunchPage";
import { EntityPage } from "@/pages/EntityPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/setup" element={<Navigate to="/setup/content" replace />} />
          <Route path="/setup/:ecosystem" element={<SetupPage />} />
          <Route path="/launch" element={<Navigate to="/launch/viral/tech" replace />} />
          <Route path="/launch/:ecosystem/:vertical" element={<LaunchPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/tax" element={<TaxCenterPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/entity" element={<EntityPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
