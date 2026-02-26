import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B3FE4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "gradient-primary text-white shadow-[0_4px_16px_rgba(123,63,228,0.25)] hover:shadow-[0_4px_24px_rgba(123,63,228,0.4)]",
                secondary: "bg-transparent border border-white/10 text-white hover:bg-white/[0.04] hover:border-white/20",
                destructive: "bg-[#FF4D6D] text-white hover:bg-[#FF4D6D]/80",
                outline: "border border-white/10 bg-transparent text-white hover:bg-white/[0.04]",
                ghost: "text-[#A8B0C3] hover:text-white hover:bg-white/[0.04]",
                link: "text-[#9B6DFF] underline-offset-4 hover:underline",
                glass: "bg-[#1C1F2E]/80 backdrop-blur-md border border-white/[0.06] text-white hover:bg-[#1C1F2E] hover:border-[#7B3FE4]/20",
                success: "gradient-success text-white shadow-[0_4px_16px_rgba(0,224,164,0.2)]",
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
