import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger' | 'success';
  icon?: LucideIcon;
  className?: string;
}

export function NeonButton({ 
  children, 
  onClick, 
  variant = 'primary',
  icon: Icon,
  className = '' 
}: NeonButtonProps) {
  const variants = {
    primary: 'border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0A0A0A] hover:shadow-[0_0_15px_rgba(0,255,136,0.6)]',
    danger: 'border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-[#0A0A0A] hover:shadow-[0_0_15px_rgba(255,51,51,0.6)]',
    success: 'border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88] hover:text-[#0A0A0A] hover:shadow-[0_0_15px_rgba(0,255,136,0.6)]',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 border-2 transition-all duration-200 flex items-center gap-2 font-mono uppercase tracking-wider text-sm ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: '0 0 5px rgba(0, 255, 136, 0.3)',
      }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </motion.button>
  );
}
