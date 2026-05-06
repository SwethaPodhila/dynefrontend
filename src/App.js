import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ProductsTable from "./components/ProductsTable";
import UploadPage from "./components/UploadPage";

import { sampleProducts } from "./data/sampleData";

function App() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);

  const handleLoadSample = () => {
    setProducts(sampleProducts);
    setPage("dashboard");
  };

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === "dashboard" && (
        <Dashboard products={products} onUpload={() => setPage("upload")} />
      )}

      {page === "products" && (
        <ProductsTable products={products} onUpload={() => setPage("upload")} />
      )}

      {page === "upload" && (
        <UploadPage onLoadSample={handleLoadSample} />
      )}
    </Layout>
  );
}

export default App;