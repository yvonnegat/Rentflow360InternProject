import { useState } from "react";
import HeroSection from "../components/home/HeroSection";
import QuickSearch from "../components/home/QuickSearch";
import AdvancedSearch from "../components/home/AdvancedSearch";
import TrendingProperties from "../components/home/TrendingProperties";
import { filterProperties } from "../utils/searchUtils";
import Layout from "../components/layout/Layout";

const sampleProperties = [
  { id: 1, title: "Modern Apartment", location: "Westlands", price: 85000, type: "Apartment", bedrooms: 2, image: "https://via.placeholder.com/300" },
  { id: 2, title: "Luxury Villa", location: "Karen", price: 200000, type: "Villa", bedrooms: 4, image: "https://via.placeholder.com/300" },
  { id: 3, title: "Studio Flat", location: "Ngong Road", price: 45000, type: "Studio", bedrooms: 1, image: "https://via.placeholder.com/300" },
];


function HomePage() {
  const [filters, setFilters] = useState({});
  const [filteredResults, setFilteredResults] = useState(sampleProperties);

  const handleSearch = (query) => {
  const results = filterProperties(sampleProperties, query, {}); 
  setFilteredResults(results);
};

  return (
    <Layout>
        <div>
        <HeroSection />
        <TrendingProperties properties={filteredResults} />
        </div>
    </Layout>
  );
}

export default HomePage;
