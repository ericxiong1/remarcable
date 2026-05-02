import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagMatch, setTagMatch] = useState("any");

  async function fetchProducts() {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("q", searchQuery);
    }

    if (selectedCategory) {
      params.append("category", selectedCategory);
    }

    // Only send tag_match when tags are selected because AND/OR logic
    // does not matter when there are no tag filters.
    if (selectedTags.length > 0) {
      params.append("tag_match", tagMatch);
    }

    selectedTags.forEach((tagId) => {
      params.append("tags", tagId);
    });

    const response = await fetch(`${API_URL}/api/products/?${params.toString()}`);
    const data = await response.json();

    setProducts(data.products);
    setCategories(data.categories);
    setTags(data.tags);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleTagChange(tagId) {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tagId)) {
        return currentTags.filter((id) => id !== tagId);
      }

      return [...currentTags, tagId];
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchProducts();
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
    setTagMatch("any");

    setTimeout(() => {
      fetchProducts();
    }, 0);
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Product Search</h1>

      <form
        onSubmit={handleSubmit}
        style={{ border: "1px solid #ddd", padding: "20px" }}
      >
        <div>
          <label>
            Search by description:
            <br />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Example: wireless, durable, beginner"
              style={{ padding: "8px", width: "300px" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>
            Filter by category:
            <br />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              style={{ padding: "8px", width: "320px" }}
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <label>
            Tag match:
            <select
              value={tagMatch}
              onChange={(event) => setTagMatch(event.target.value)}
              style={{ marginLeft: "8px", padding: "6px" }}
            >
              <option value="any">Any selected tag</option>
              <option value="all">All selected tags</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: "15px" }}>
          <p style={{ textAlign: "center" }}>Filter by tags:</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 180px)",
              gap: "8px 20px",
              justifyContent: "center",
            }}
          >
            {tags.map((tag) => (
              <label
                key={tag.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  alignItems: "center",
                  columnGap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(String(tag.id))}
                  onChange={() => handleTagChange(String(tag.id))}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{ marginTop: "20px", padding: "8px 14px" }}
        >
          Apply Search / Filters
        </button>

        <button
          type="button"
          onClick={clearFilters}
          style={{ marginLeft: "10px", padding: "8px 14px" }}
        >
          Clear
        </button>
      </form>

      <h2>Results</h2>

      <p>{products.length} product(s) found.</p>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{product.name}</h3>

          <p>
            <strong>Category:</strong> {product.category.name}
          </p>

          <p>
            <strong>Description:</strong> {product.description}
          </p>

          <p>
            <strong>Tags:</strong>{" "}
            {product.tags.length > 0
              ? product.tags.map((tag) => tag.name).join(", ")
              : "No tags"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProductSearch;