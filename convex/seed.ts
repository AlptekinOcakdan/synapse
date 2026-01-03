import { internalMutation } from "./_generated/server";

const departmentsData = [
    // Mühendislik Fakültesi
    { label: "Bilgisayar Mühendisliği" },
    { label: "Yazılım Mühendisliği" },
    { label: "Elektrik-Elektronik Mühendisliği" },
    { label: "Endüstri Mühendisliği" },
    { label: "İnşaat Mühendisliği" },
    { label: "Makine Mühendisliği" },
    // Tıp Fakültesi
    { label: "Tıp" },
    // Hukuk Fakültesi
    { label: "Hukuk" },
    // İşletme Fakültesi
    { label: "İşletme" },
    { label: "Ekonomi" },
    // Fen-Edebiyat Fakültesi
    { label: "Psikoloji" },
    { label: "Sosyoloji" },
    { label: "Matematik" },
    // Veterinerlik Fakültesi
    { label: "Veteriner Hekimliği" },
    // Diğer
    { label: "Diğer" },
];

export const seedDepartments = internalMutation({
    handler: async (ctx) => {
        // Tablonun boş olup olmadığını kontrol et
        const anyDepartment = await ctx.db.query("departments").first();

        if (anyDepartment) {
            console.log("Departmanlar tablosu zaten dolu. Seed işlemi atlandı.");
            return;
        }

        console.log("Departmanlar tablosu dolduruluyor...");

        // Verileri ekle
        for (const dept of departmentsData) {
            await ctx.db.insert("departments", {
                label: dept.label,
            });
        }

        console.log(`${departmentsData.length} departman eklendi.`);
    },
});
