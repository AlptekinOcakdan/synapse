import {LayoutProps} from "@/lib/utils";
import {Inter} from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
});

const Layout = ({children}: LayoutProps) => {
    return (
        <main className={inter.className}>
            {children}
        </main>
    );
};

export default Layout;