import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Building2, Users, Leaf, GraduationCap, ArrowRight, MapPin, Phone, MessageSquare, Heart, Quote, Facebook, Instagram, Twitter, Lightbulb } from "lucide-react";
import { insertSupporterSchema, type InsertSupporter } from "@shared/schema";
import { useCreateSupporter, useSupporterCount } from "@/hooks/use-campaign";
import { useNews, useProposals, useActivities, useHomeContent } from "@/hooks/use-content";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { ProposalCard } from "@/components/ProposalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Home() {
  const { toast } = useToast();
  const { data: countData } = useSupporterCount();
  const { data: homeContent } = useHomeContent();
  const { data: activities } = useActivities();
  const { data: news } = useNews();
  const { data: dynamicProposals } = useProposals();
  const createSupporter = useCreateSupporter();

  const form = useForm<InsertSupporter>({
    resolver: zodResolver(insertSupporterSchema),
    defaultValues: {
      name: "",
      neighborhood: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertSupporter) => {
    createSupporter.mutate(data, {
      onSuccess: () => {
        toast({
          title: "¡Gracias por sumarte!",
          description: "Tus datos fueron recibidos. Pronto nos pondremos en contacto.",
          duration: 5000,
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const scrollToProposals = () => {
    document.getElementById("propuestas")?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJoin = () => {
    document.getElementById("sumate")?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar />

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-primary/80 to-slate-900/90 z-10" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl z-0" />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center mix-blend-overlay opacity-30"
          style={{ backgroundImage: homeContent?.heroImage ? `url("${homeContent.heroImage}")` : `url("https://images.unsplash.com/photo-1540910419892-f0c74b0e8967?q=80&w=2070&auto=format&fit=crop")` }}
        />

        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-bold tracking-wider uppercase">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {homeContent ? (
                  homeContent.allianceMovement
                ) : (
                  <span className="w-24 h-4 bg-white/20 animate-pulse rounded block" />
                )}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] text-balance">
                {homeContent ? (
                  homeContent.heroTitle
                ) : (
                  <span className="block h-20 w-full bg-white/10 animate-pulse rounded-lg" />
                )}
              </h1>
              
              <div className="min-h-[3rem]">
                {homeContent ? (
                  <p className="text-xl text-white/90 max-w-lg leading-relaxed font-medium">
                    {homeContent.heroSubtitle}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-white/10 animate-pulse rounded" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" variant="secondary" onClick={scrollToJoin} className="text-base font-bold shadow-xl bg-white text-primary hover:bg-slate-100 transition-transform">
                  Sumate al equipo
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToProposals} className="text-base border-white text-white hover:bg-white/10 bg-transparent backdrop-blur-sm">
                  Conocé mi compromiso
                </Button>
              </div>

              {/* Bloque de contadores movido al Hero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg group hover:bg-white/20 transition-colors"
                >
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <div className="text-2xl font-black text-white">
                    +{countData ? countData.count.toLocaleString() : "128"}
                  </div>
                  <div className="text-white/70 font-bold uppercase tracking-wider text-[10px]">Vecinos sumados</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg group hover:bg-white/20 transition-colors"
                >
                  <MapPin className="w-8 h-8 text-accent mb-2" />
                  <div className="text-2xl font-black text-white">6</div>
                  <div className="text-white/70 font-bold uppercase tracking-wider text-[10px]">Presencia en barrios</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg group hover:bg-white/20 transition-colors"
                >
                  <Lightbulb className="w-8 h-8 text-accent mb-2" />
                  <div className="text-2xl font-black text-white">
                    {dynamicProposals ? dynamicProposals.length : "3"}
                  </div>
                  <div className="text-white/70 font-bold uppercase tracking-wider text-[10px]">Propuestas</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-slate-200 to-slate-300 flex items-end justify-center">
                {homeContent && homeContent.candidateImage ? (
                  <img 
                    src={homeContent.candidateImage} 
                    alt="Candidato" 
                    className="w-full h-full object-cover object-top"
                  />
                ) : homeContent ? (
                  <div className="w-full h-full bg-slate-200" />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white w-full pr-16">
                  {homeContent ? (
                    <>
                      <p className="text-2xl font-bold truncate">{homeContent.candidateName}</p>
                      <p className="opacity-90 truncate">{homeContent.candidateRole}</p>
                      <p className="text-sm mt-2 opacity-80 line-clamp-3 leading-snug">
                        {homeContent.candidateBio}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-white/20 animate-pulse rounded" />
                      <div className="h-4 w-48 bg-white/20 animate-pulse rounded" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-10 right-10 w-full h-full border-2 border-secondary/50 rounded-3xl -z-10 translate-x-4 translate-y-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROPOSALS SECTION */}
      <section id="propuestas" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto mb-16 bg-slate-50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
            <Quote className="w-16 h-16 text-primary/20 shrink-0" />
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                "Mi compromiso es ser tu voz en la Junta Municipal, fiscalizando y legislando para vos."
              </h3>
              <p className="text-slate-600 leading-relaxed italic">
                — {homeContent?.candidateName || "Tu Candidato"}
              </p>
            </div>
          </div>

          <SectionHeading 
            title="Ejes de Gestión" 
            subtitle="Propuestas para transformar nuestra ciudad"
            className="max-w-2xl mx-auto mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicProposals && dynamicProposals.length > 0 ? (
              dynamicProposals.map((p, idx) => (
                <ProposalCard 
                  key={p.id}
                  title={p.title}
                  problem={p.category}
                  solution={p.description}
                  icon={<Lightbulb className="w-full h-full" />}
                  delay={idx * 0.1}
                />
              ))
            ) : (
              <>
                <ProposalCard 
                  title="Iluminación por Barrios"
                  problem="Salud y Seguridad"
                  solution="Ordenanza para el mantenimiento preventivo y ampliación de la red lumínica LED en zonas críticas."
                  icon={<Building2 className="w-full h-full" />}
                  delay={0}
                />
                <ProposalCard 
                  title="Caminos de Todo Tiempo"
                  problem="Infraestructura"
                  solution="Gestión para el empedrado y mantenimiento de caminos vecinales en las compañías."
                  icon={<MapPin className="w-full h-full" />}
                  delay={0.1}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* TRANSPARENCIA SECTION */}
      <section id="transparencia" className="py-24 bg-white text-slate-900 overflow-hidden relative border-y border-slate-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-widest mb-6 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Rendición de Cuentas
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Transparencia y <span className="text-primary">Rendición</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Publicamos nuestras actividades y propuestas en tiempo real. 
                Creemos que la transparencia es la base de la modernidad y la confianza en la gestión pública.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: <Building2 className="w-5 h-5" />, text: "Gestión abierta y cercana al vecino" },
                  { icon: <Users className="w-5 h-5" />, text: "Participación ciudadana real" },
                  { icon: <GraduationCap className="w-5 h-5" />, text: "Información pública al alcance de todos" },
                  { icon: <MessageSquare className="w-5 h-5" />, text: "Informes trimestrales de gestión accesibles" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <span className="font-medium text-slate-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:pl-12">
              <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl opacity-50" />
              <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-10 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-slate-900">Gestión Abierta</div>
                    <div className="text-xs text-primary font-bold uppercase tracking-widest">Compromiso Real</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-slate-600 leading-relaxed">
                    Nuestra labor en la Junta Municipal no termina en la oficina. Recorremos cada compañía para escuchar tus necesidades y convertirlas en proyectos reales.
                  </p>
                  <div className="pt-4 border-t border-slate-200">
                    <Button 
                      className="w-full group" 
                      variant="outline"
                      onClick={() => document.getElementById("actividades")?.scrollIntoView({behavior: 'smooth'})}
                    >
                      Ver actividades en barrios
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section id="noticias" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="Novedades" 
            subtitle="Campaña en Marcha"
            alignment="left"
          />

          {news && news.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-4 relative">
                    <img 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 line-clamp-3">{item.content}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">Pronto cargaremos las noticias más recientes.</p>
            </div>
          )}
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section id="actividades" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="En los Barrios" 
            subtitle="Trabajo Territorial"
            alignment="left"
          />

          {activities && activities.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {activities.map((activity: any, idx: number) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-4 relative">
                    <img 
                      src={activity.imageUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"} 
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-2">
                    {activity.description}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">Pronto cargaremos las próximas actividades territoriales.</p>
            </div>
          )}
        </div>
      </section>

      {/* JOIN US SECTION */}
      <section id="sumate" className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-6">
              <SectionHeading 
                title="Formá parte del equipo" 
                subtitle="Sumate al Movimiento"
                alignment="left"
                className="text-white mb-6"
              />
              <p className="text-lg text-white/90 mb-8">
                Tu apoyo es la fuerza que necesitamos para representar con lealtad a nuestro partido 
                y a nuestra ciudad. Dejanos tus datos para coordinar el trabajo en tu barrio.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">Unidos</div>
                  <div className="text-sm text-white/80">Por el Pueblo</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-1">
                    {countData ? countData.count.toLocaleString() : "..."}
                  </div>
                  <div className="text-sm text-white/80">Colorados Sumados</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Quiero ser parte</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono / WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 0981 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barrio</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu barrio o compañía" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="¿Cómo te gustaría ayudar?" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg h-12 mt-4 font-bold" 
                    variant="secondary"
                    disabled={createSupporter.isPending}
                  >
                    {createSupporter.isPending ? "Enviando..." : "Enviar mis datos"}
                  </Button>

                  <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
                    🔒 Tus datos están protegidos y solo serán utilizados por el equipo {homeContent?.allianceName || "de campaña"}.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                  {homeContent?.candidateName ? homeContent.candidateName.substring(0, 2).toUpperCase() : "AL"}
                </div>
                <span className="text-white text-xl font-bold">
                  {homeContent ? (
                    homeContent.allianceName
                  ) : (
                    <span className="inline-block h-5 w-32 bg-white/10 animate-pulse rounded" />
                  )}
                </span>
              </div>
              <p className="mb-6">
                Trabajando por un futuro mejor para Carlos Antonio López.
                Honestidad, transparencia y compromiso real con el pueblo.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>Carlos Antonio López<br/>Itapúa, Paraguay</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>+595 9xx xxx xxx</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#propuestas" className="hover:text-white transition-colors">Propuestas</a></li>
                <li><a href="#actividades" className="hover:text-white transition-colors">Actividades</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors">Admin</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2026 Plataforma Electoral. Carlos Antonio López, Itapúa.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a 
        href="https://wa.me/" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </a>
    </div>
  );
}
