import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import Script from "next/script";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Mentor Connect",
    description: "Video Calling App",
    icons:{
        icon: '/icons/logo.svg'
    }
};

const HomeLayout = ({children}: {children: ReactNode}) => {
    return (
        <main className="relative">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
                    <div className="w-full">
                        {children}
                    </div>
                </section>
            </div>

            <Script 
                src="https://cdn.botpress.cloud/webchat/v2.1/inject.js" 
                strategy="afterInteractive"
            />
            <Script 
                src="https://mediafiles.botpress.cloud/c986717e-6b29-4b81-b51a-6e0c12ab102d/webchat/v2.1/config.js" 
                strategy="afterInteractive"
            />
        </main>
    )
}

export default HomeLayout
