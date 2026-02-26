import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Facebook, Instagram, Twitter, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery } from "@tanstack/react-query";
import { type HomeContent } from "@shared/schema";

const navLinks = [
  { name: "Propuestas", href: "#propuestas" },
  { name: "Noticias", href: "#noticias" },
  { name: "Actividades", href: "#actividades" },
  { name: "Súmate", href: "#sumate" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "colorado");

  const { data: homeContent } = useQuery<HomeContent>({ 
    queryKey: ["/api/home-content"] 
  });

  useEffect(() => {
    if (homeContent?.theme) {
      setTheme(homeContent.theme);
    }
  }, [homeContent?.theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themes = [
    { id: "colorado", name: "Colorado (Rojo)", color: "bg-red-600" },
    { id: "alianza", name: "Alianza (Naranja y Navy)", color: "bg-gradient-to-r from-orange-500 to-slate-900" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="min-w-[3rem] h-12 px-3 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform uppercase whitespace-nowrap">
              {homeContent ? homeContent.candidateListNumber : (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </div>
            <div className={`flex flex-col ${isScrolled ? "text-slate-900" : "text-white"} transition-colors min-h-[2.5rem] justify-center`}>
              {homeContent ? (
                <>
                  <span className="text-xl font-black leading-none tracking-tighter uppercase">{homeContent.allianceName}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Por el Cambio</span>
                </>
              ) : (
                <div className="space-y-1">
                  <div className={`h-4 w-24 animate-pulse rounded ${isScrolled ? "bg-slate-200" : "bg-white/20"}`} />
                  <div className={`h-2 w-16 animate-pulse rounded ${isScrolled ? "bg-slate-200" : "bg-white/20"}`} />
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium hover:text-secondary transition-colors ${
                    isScrolled ? "text-slate-600" : "text-white/90"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={isScrolled ? "text-slate-900" : "text-white"}>
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themes.map((t) => (
                  <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-3 h-3 rounded-full ${t.color}`} />
                    {t.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant={isScrolled ? "default" : "secondary"}
              onClick={() => document.getElementById("sumate")?.scrollIntoView({ behavior: 'smooth' })}
            >
              Participar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-current"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-slate-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-slate-900" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t p-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-slate-800 py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button className="w-full mt-2" onClick={() => {
            setIsMobileMenuOpen(false);
            document.getElementById("sumate")?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Participar Ahora
          </Button>
          
          <div className="flex justify-center gap-6 pt-4">
            <Facebook className="w-5 h-5 text-slate-400" />
            <Instagram className="w-5 h-5 text-slate-400" />
            <Twitter className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      )}
    </nav>
  );
}
