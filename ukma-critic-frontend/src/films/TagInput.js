import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TagInput({ label, values, onChange, placeholder }) {
    const [input, setInput] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
        }
        setInput("");
    };

    const handleRemove = (item) => {
        onChange(values.filter((v) => v !== item));
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold">{label}</label>

            <div className="d-flex flex-wrap gap-2 mb-2">
                {values.map((item, idx) => (
                    <span key={idx} className="badge bg-secondary d-flex align-items-center gap-1">
            {item}
                        <button
                            type="button"
                            className="btn-close btn-close-white btn-sm"
                            style={{ fontSize: "0.6rem" }}
                            aria-label="Видалити"
                            onClick={() => handleRemove(item)}
                        ></button>
          </span>
                ))}
            </div>

            <form onSubmit={handleAdd} className="d-flex gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder || "Add more..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit" onClick={handleAdd}>
                    +
                </button>
            </form>
        </div>
    );
}
