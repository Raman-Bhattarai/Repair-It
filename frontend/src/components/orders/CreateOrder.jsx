import React, { useState } from "react";
import api from "../../api/api";

function CreateOrder({ onOrderCreated }) {
  const [items, setItems] = useState([
    { appliance_type: "", other_name: "", problem_description: "", quantity: 1, images: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { appliance_type: "", other_name: "", problem_description: "", quantity: 1, images: [] }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleImageChange = (index, files) => {
    const updated = [...items];
    updated[index].images = Array.from(files);
    setItems(updated);
  };

  const removeImage = (itemIndex, imageIndex) => {
    const updated = [...items];
    updated[itemIndex].images.splice(imageIndex, 1);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      items.forEach((item, idx) => {
        formData.append(`items[${idx}][order_name]`, item.other_name || item.appliance_type);
        formData.append(`items[${idx}][order_details]`, item.problem_description);
        formData.append(`items[${idx}][quantity]`, item.quantity);
        item.images.forEach((file) => {
          formData.append(`items[${idx}][images]`, file);
        });
      });

      const res = await api.post("/orders/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onOrderCreated) onOrderCreated(res.data);
      setItems([{ appliance_type: "", other_name: "", problem_description: "", quantity: 1, images: [] }]);
    } catch (err) {
      setError("अर्डर सिर्जना गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">मर्मत अर्डर सिर्जना गर्नुहोस्</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border p-4 rounded-xl shadow-sm space-y-2 text-black">
            <div>
              <label className="block text-sm font-medium">उपकरणको प्रकार</label>
              <select
                value={item.appliance_type}
                onChange={(e) => handleItemChange(index, "appliance_type", e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">-- छान्नुहोस् --</option>
                <option value="Fridge">फ्रिज</option>
                <option value="Washing Machine">वाशिङ मेसिन</option>
                <option value="AC">एयर कन्डिसनर</option>
                <option value="TV">टिभी</option>
                <option value="Other">अन्य</option>
              </select>
            </div>

            {item.appliance_type === "Other" && (
              <div>
                <label className="block text-sm font-medium">अन्य उपकरणको नाम</label>
                <input
                  type="text"
                  value={item.other_name}
                  onChange={(e) => handleItemChange(index, "other_name", e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="कृपया उपकरणको नाम लेख्नुहोस्"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">समस्या विवरण</label>
              <textarea
                value={item.problem_description}
                onChange={(e) => handleItemChange(index, "problem_description", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">मात्रा</label>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">छविहरू (एक वा धेरै)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(index, e.target.files)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {item.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${i}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, i)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Add more image button */}
                <button
                  type="button"
                  onClick={() => document.getElementById(`extra-file-${index}`).click()}
                  className="mt-5 px-3 py-1 w-30 h-15 bg-gray-200 text-blue-600 rounded-lg text-sm hover:bg-gray-300"
                >
                  + अर्को छवि थप्नुहोस्
                </button>

                {/* Hidden file input triggered by button */}
                <input
                  id={`extra-file-${index}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].images = [...updated[index].images, ...Array.from(e.target.files)];
                    setItems(updated);
                  }}
                />
              </div>
            )}

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 text-sm"
              >
                वस्तु हटाउनुहोस्
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-gray-200 rounded-lg text-cyan-500 hover:bg-gray-500"
        >
          + अर्को उपकरण थप्नुहोस्
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          {loading ? "सबमिट गर्दै..." : "अर्डर सबमिट गर्नुहोस्"}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;
