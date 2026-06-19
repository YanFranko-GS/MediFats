import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatNumber } from '../../../shared/utils';

// Shared KPI card for SaaS metrics used in AdminHome and AdminAnalytics
interface SaasKpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  positive?: boolean;
  trend?: number;
  prefix?: string;
  icon?: React.ReactNode;
}

export function SaasKpiCard({ title, value, sub, positive, trend, prefix, icon }: SaasKpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      </div>
      <p className="text-2xl font-bold font-data text-slate-800 dark:text-slate-100">
        {prefix}{typeof value === 'number' ? formatNumber(value) : value}
      </p>
      {(sub || trend !== undefined) && (
        <div className="flex items-center gap-1.5 mt-1.5">
          {trend !== undefined && (
            trend >= 0
              ? <ArrowUpRight className="h-3.5 w-3.5 text-green-500 shrink-0" />
              : <ArrowDownRight className="h-3.5 w-3.5 text-red-500 shrink-0" />
          )}
          <p className={cn(
            'text-xs font-medium',
            positive === undefined ? 'text-slate-500'
              : positive ? 'text-green-600 dark:text-green-400'
              : 'text-red-500 dark:text-red-400'
          )}>
            {sub}
          </p>
        </div>
      )}
    </motion.div>
  );
}
