import { useState } from "react";
import { categorySets } from "../../data/categories.js";

const typeOptions = {
    current: categorySets.current,
    future: categorySets.prospective,
};

export default function AddFaqForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        audience: "",
        type: "",
        question: "",
        answer: {
            text: "",
            bullets: [""]
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "text") {
            setFormData({ ...formData, answer: { ...formData.answer, text: value } });
        } else if (name === "audience") {
            setFormData({ ...formData, audience: value, type: "" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleBulletChange = (index, value) => {
        const updatedBullets = [...formData.answer.bullets];
        updatedBullets[index] = value;

        setFormData({
            ...formData,
            answer: {
                ...formData.answer,
                bullets: updatedBullets
            }
        });
    };

    const addBullet = () => {
        setFormData({
            ...formData,
            answer: {
                ...formData.answer,
                bullets: [...formData.answer.bullets, ""]
            }
        });
    };

    const removeBullet = (index) => {
        const updatedBullets = formData.answer.bullets.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            answer: {
                ...formData.answer,
                bullets: updatedBullets
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // TODO: change to production API URL
            const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/addFAQ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, role: "admin" })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add FAQ");
            }

            alert("FAQ added successfully!");

            setFormData({
                audience: "",
                type: "",
                question: "",
                answer: {
                    text: "",
                    bullets: [""]
                }
            });

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add FAQ</h2>

            <select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                required
            >
                <option value="">Select Audience</option>
                <option value="future">Future</option>
                <option value="current">Current</option>
            </select>

            <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={!formData.audience}
            >
                <option value="">Select Category</option>
                {(typeOptions[formData.audience] || []).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input
                type="text"
                name="question"
                placeholder="Question"
                value={formData.question}
                onChange={handleChange}
                required
            />

            <textarea
                name="text"
                placeholder="Answer text"
                value={formData.answer.text}
                onChange={handleChange}
                required
            />

            <h4>Bullet Points</h4>
            {formData.answer.bullets.map((bullet, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={bullet}
                        placeholder={`Bullet ${index + 1}`}
                        onChange={(e) => handleBulletChange(index, e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => removeBullet(index)}>
                        Remove
                    </button>
                </div>
            ))}

            <button type="button" onClick={addBullet}>
                Add Bullet
            </button>

            <br /><br />

            <button type="submit">
                Submit FAQ
            </button>
        </form>
    );
}