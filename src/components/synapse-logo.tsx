import Link from "next/link";
import Image from "next/image";

export const SynapseLogo = () => (
    <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity" // Tıklanabilir hissi için hover efekti de ekledim
    >
        <Image
            src="/logo.png"
            width={120}
            height={120}
            alt="Synapse"
            className="w-auto h-20 object-contain"
        />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-violet-200 to-violet-400 tracking-tight">
            SYNAPSE
        </span>
    </Link>
);