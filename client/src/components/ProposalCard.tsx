import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProposalCardProps {
  title: string;
  problem: string;
  solution: string;
  icon: React.ReactNode;
  delay?: number;
}

export function ProposalCard({ title, problem, solution, icon, delay = 0 }: ProposalCardProps) {
  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          {icon}
        </div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
          
          <div className="space-y-4">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <p className="text-xs font-bold text-primary uppercase mb-1">El Problema</p>
              <p className="text-sm text-slate-600 line-clamp-2">{problem}</p>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Nuestra Solución</p>
                <p className="text-sm text-slate-700 font-medium line-clamp-2">{solution}</p>
              </div>
            </div>
          </div>

          <DialogTrigger asChild>
            <div className="mt-6 flex items-center text-primary text-sm font-semibold cursor-pointer opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Leer propuesta completa <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </DialogTrigger>
        </div>
      </motion.div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-lg font-medium text-primary/80">
            Plan de Acción Territorial
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Contexto y Necesidad</h4>
            <p className="text-slate-700 leading-relaxed">{problem}</p>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Propuesta Legislativa</h4>
            <p className="text-slate-900 font-medium leading-relaxed text-lg">{solution}</p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <p className="text-sm text-green-800 font-medium">Esta propuesta será presentada en los primeros 100 días de gestión.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
