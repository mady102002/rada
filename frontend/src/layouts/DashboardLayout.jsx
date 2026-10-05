import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function DashboardLayout({ children }) {
    return (
        <div className="dashboard-container">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <main className="content-area">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;