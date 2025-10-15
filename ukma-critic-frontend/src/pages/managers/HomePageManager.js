import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Users, MessageSquare } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Manager.css"

export default function HomePageManager() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Managing films",
            description: "Add, update, or delete movies in the catalog.",
            icon: <Film size={50} color="#fe9542" />,
            path: "/films",
            border: "border-primary",
            btn: "btn-outline-primary",
        },
        {
            title: "Users",
            description: "View, edit, or delete users.",
            icon: <Users size={50} color="#fe9542" />,
            path: "/users",
            border: "border-info",
            btn: "btn-outline-info",
        },
        {
            title: "Reviews",
            description: "Review and moderate user reviews.",
            icon: <MessageSquare size={50} color="#fe9542" />,
            path: "/comments",
            border: "border-success",
            btn: "btn-outline-success",
        },
    ];

    return (
        <div className="container py-3">
            <motion.h1
                className="text-center mb-5 fw-bold display-5 text-dark"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Manager panel 🎬
            </motion.h1>

            <div className="row justify-content-center g-4">
                {sections.map((section, i) => (
                    <motion.div
                        key={i}
                        className="col-12 col-md-6 col-lg-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div
                            className={`card text-center shadow-sm h-100 btn-card card-hover`}
                            style={{borderWidth: "3px"}}
                        >
                            <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                                <div className="mb-3">{section.icon}</div>
                                <h5 className="card-title fw-bold mb-2">{section.title}</h5>
                                <p className="card-text text-muted mb-4">{section.description}</p>
                                <button
                                    className={`btn px-4 btn-card`}
                                    onClick={() => navigate(section.path)}
                                >
                                    Follow →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
