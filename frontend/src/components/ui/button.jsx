import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm uppercase tracking-wide font-mono transition-brutal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#160000] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "btn-brutal",
                secondary: "bg-white text-[#160000] hover:bg-[#160000] hover:text-white border border-white",
                destructive: "btn-brutal",
                outline: "border border-white/20 bg-transparent text-white hover:bg-white hover:text-[#160000]",
                ghost: "text-white/70 hover:text-white hover:bg-white/10",
                link: "text-white underline-offset-4 hover:underline",
                glass: "bg-[#160000]/80 backdrop-blur-md border border-white/20 text-white hover:bg-[#160000] hover:border-white",
                success: "btn-brutal",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
