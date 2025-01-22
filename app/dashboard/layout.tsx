import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="min-h-screen flex flex-col">
            {/* Navbar at the top */}
            <Navbar />
            
            {/* Flex container for Sidebar and Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar takes up 1/8th of the width */}
                <div className="w-1/8 overflow-hidden">
                    <Sidebar />
                </div>
                
                {/* Content area (children) takes up the remaining space */}
                <div className="flex-1 overflow-y-auto">
                    {children} {/* This will be the table content */}
                </div>
            </div>
        </main>
    );
}