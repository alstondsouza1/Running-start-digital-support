const fetchCategories = async (API_BASE) => {
  try {
    const res = await fetch(`${API_BASE}/categories`);

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

export default fetchCategories;
