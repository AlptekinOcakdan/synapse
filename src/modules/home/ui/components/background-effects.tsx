export const BackgroundEffects = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-30"/>
    </div>
);