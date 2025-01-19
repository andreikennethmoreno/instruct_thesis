import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <main className="font-work-sans">
            <Navbar />
            <div className="flex">
                {/* Sidebar takes up 1/4th of the width */}
                <div className="w-1/8">
                    <Sidebar />
                </div>
                {/* Content area (table) takes up the remaining 3/4th of the width */}
                <div className="flex-1">
                    {children} {/* This will be the table content */}
                </div>
            </div>
        </main>
        </main>
    )
}