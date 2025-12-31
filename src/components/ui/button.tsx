import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    // Base stiller (Yuvarlaklık --radius ile yönetiliyor, transition eklendi)
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
    {
        variants: {
            variant: {
                // "Aramıza Katıl" Stili (Primary + Glow Effect)
                default:
                    "rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5",

                // Standart Destructive
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",

                // "Giriş Yap" Stili (Glassmorphic / Transparan Outline)
                // bg-white/5 ve border-white/10 mantığını dinamik hale getirdik:
                outline:
                    "border border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10 backdrop-blur-sm",

                // Katı renkli ikincil buton (Gerekirse diye tutuyoruz)
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",

                // Sadece hover efekti olan butonlar (Navigasyon linkleri için ideal)
                ghost:
                    "text-sm font-medium text-white bg-white/5 border border-white/10 rounded-full hover:bg-accent transition-all",

                // Link görünümlü buton
                link: "text-primary underline-offset-4 hover:underline",
                nav: "bg-secondary/50 text-muted-foreground hover:bg-primary/50 hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-foreground data-[active=true]:shadow-sm rounded-full",
            },
            size: {
                default: "h-10 px-5 py-2 has-[>svg]:px-4", // Biraz daha geniş ve dolgun
                sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-12 rounded-md px-8 has-[>svg]:px-6 text-base", // Hero section butonları için büyük boy
                icon: "size-10",
                "icon-sm": "size-8",
                "icon-lg": "size-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
                    className,
                    variant = "default",
                    size = "default",
                    asChild = false,
                    ...props
                }: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Button, buttonVariants}