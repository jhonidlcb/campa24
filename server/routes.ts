import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { insertEventSchema } from "@shared/schema";

import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

const storageMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storageMulter });

async function seedDatabase() {
  const existingActivities = await storage.getActivities();
  if (existingActivities.length === 0) {
    await storage.createActivity({
      title: "Encuentro Republicano en Barrio Obrero",
      description: "Conversamos con los correligionarios sobre la importancia de la fiscalización municipal. ¡Unidad y compromiso!",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
    });
    await storage.createActivity({
      title: "Reunión de Seccional",
      description: "Planificando el trabajo territorial. Estamos trabajando fuertemente para llegar a cada hogar.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
    });
    await storage.createActivity({
      title: "Jornada de Salud",
      description: "Brindando atención médica gratuita a todos los vecinos del barrio.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
    });
  }

  const existingNews = await storage.getNews();
  if (existingNews.length === 0) {
    await storage.createNews({
      title: "Gran Lanzamiento de Campaña",
      content: "Hoy iniciamos un nuevo camino juntos para transformar nuestra ciudad.",
      imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"
    });
    await storage.createNews({
      title: "Propuestas de Infraestructura",
      content: "Conoce nuestro plan detallado para mejorar las calles y espacios públicos.",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=2024&auto=format&fit=crop"
    });
    await storage.createNews({
      title: "Compromiso con la Educación",
      content: "La educación es la base de nuestro progreso. Presentamos nuevas becas municipales.",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
    });
  }

  const existingProposals = await storage.getProposals();
  if (existingProposals.length === 0) {
    await storage.createProposal({
      title: "Salud para Todos",
      description: "Falta de especialistas y horarios reducidos en centros municipales. Ampliaremos la atención para que nadie se quede sin consulta.",
      category: "Salud"
    });
    await storage.createProposal({
      title: "Educación Moderna",
      description: "Nuestras escuelas necesitan dar el salto tecnológico. Implementaremos laboratorios de computación y acceso a internet.",
      category: "Educación"
    });
    await storage.createProposal({
      title: "Barrios Seguros",
      description: "La inseguridad nos preocupa a todos. Instalaremos cámaras de vigilancia y mejoraremos el alumbrado público.",
      category: "Seguridad"
    });
  }

  const existingHomeContent = await storage.getHomeContent();
  if (!existingHomeContent) {
    await storage.updateHomeContent({
      heroTitle: "El cambio empieza en nuestros barrios.",
      heroSubtitle: "Es momento de ordenar y modernizar Carlos Antonio López con una gestión transparente y llena de oportunidades.",
      heroImage: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8967?q=80&w=2070&auto=format&fit=crop",
      allianceName: "ALIANZA POR EL CAMBIO",
      allianceMovement: "ALIANZA POR EL PROGRESO 2026",
      candidateName: "Juan Perez",
      candidateRole: "Lista 1 Concejal Municipal",
      candidateImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
      candidateBio: "Vecino de toda la vida, comprometido con el desarrollo de nuestras compañías y barrios. Creo en una gestión cercana, transparente y con resultados concretos."
    });
  }

  const currentCount = await storage.getSupportersCount();
  if (currentCount === 0) {
    await storage.createSupporter({
      name: "Ramón Benítez",
      neighborhood: "Sajonia",
      phone: "0981123456",
      message: "¡Firme con la Lista!"
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Seed initial data
  await seedDatabase();

  app.post(api.supporters.create.path, async (req, res) => {
    try {
      const input = api.supporters.create.input.parse(req.body);
      const supporter = await storage.createSupporter(input);
      res.status(201).json(supporter);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path[0]?.toString(),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.supporters.count.path, async (req, res) => {
    try {
      const count = await storage.getSupportersCount();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // New endpoint for supporters list (Admin only)
  app.get("/api/supporters", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).send("Unauthorized");
    }
    try {
      const supportersList = await storage.getSupporters();
      res.json(supportersList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.activities.list.path, async (req, res) => {
    try {
      const activities = await storage.getActivities();
      // Sort by date descending
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      res.json(activities);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.activities.create.path, async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).send("Unauthorized");
    }
    try {
      // For date we need coercion if it comes as string
      const bodySchema = api.activities.create.input.extend({
        date: z.coerce.date()
      });
      const input = bodySchema.parse(req.body);
      const activity = await storage.createActivity(input);
      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path[0]?.toString(),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const newsList = await storage.getNews();
      res.json(newsList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/news", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).send("Unauthorized");
    }
    try {
      const input = api.news.create.input.parse(req.body);
      const newsItem = await storage.createNews(input);
      res.status(201).json(newsItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path[0]?.toString(),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Proposals endpoints
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposalsList = await storage.getProposals();
      res.json(proposalsList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).send("Unauthorized");
    }
    try {
      const input = api.proposals.create.input.parse(req.body);
      const proposal = await storage.createProposal(input);
      res.status(201).json(proposal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path[0]?.toString(),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(403).send("Unauthorized");
    try {
      await storage.deleteActivity(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(403).send("Unauthorized");
    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/proposals/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(403).send("Unauthorized");
    try {
      await storage.deleteProposal(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Events endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const eventsList = await storage.getEvents();
      res.json(eventsList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).send("Unauthorized");
    }
    try {
      const input = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path[0]?.toString(),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Home content endpoints
  app.get("/api/home-content", async (req, res) => {
    try {
      const content = await storage.getHomeContent();
      res.json(content || {
        heroTitle: "CONSTRUYENDO EL FUTURO JUNTOS.",
        heroSubtitle: "Unimos fuerzas por un Carlos Antonio López transparente, moderno y lleno de oportunidades para cada familia.",
        heroImage: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8967?q=80&w=2070&auto=format&fit=crop",
        candidateName: "Candidato Lista 1",
        candidateRole: "Opción a Concejal Municipal",
        allianceMovement: "ALIANZA POR EL PROGRESO 2026"
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/home-content", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(403).send("Unauthorized");
    try {
      const content = await storage.updateHomeContent(req.body);
      res.json(content);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) return res.status(403).send("Unauthorized");
    if (!req.file) return res.status(400).send("No file uploaded");
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // Serve static uploads
  app.use("/uploads", express.static("uploads"));

  return httpServer;
}
