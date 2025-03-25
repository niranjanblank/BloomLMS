import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva("flex items-center gap-2 rounded-md p-4 text-sm", {
  variants: {
    variant: {
      success: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      info: "bg-blue-100 text-blue-700",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}
const iconMap = {
    success: CheckCircleIcon ,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: CheckCircleIcon ,
  };
const Banner = ({ variant, label }: BannerProps) => {
  
    const Icon = iconMap[variant || "warning"]

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2"/>
        {label}
    </div>
  );
};

export default Banner;