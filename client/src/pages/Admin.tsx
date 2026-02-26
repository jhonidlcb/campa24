import { useQuery, useMutation } from "@tanstack/react-query";
import { type Supporter, type Activity, type News, type Proposal, type HomeContent } from "@shared/schema";
import { Trash2, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LogOut, Download, Users, Calendar, Newspaper, Lightbulb, Plus, Palette, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertActivitySchema, insertNewsSchema, insertProposalSchema, insertHomeContentSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function Admin() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "colorado");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const { data: homeContent } = useQuery<HomeContent>({
    queryKey: ["/api/home-content"],
  });

  const { data: supporters, isLoading: loadingSupporters } = useQuery<Supporter[]>({
    queryKey: ["/api/supporters"],
  });

  const { data: activities, isLoading: loadingActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: news, isLoading: loadingNews } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: proposals, isLoading: loadingProposals } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  const updateHomeContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/home-content", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-content"] });
      toast({ title: "Éxito", description: "Contenido actualizado" });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/activities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Éxito", description: "Actividad creada correctamente" });
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/news", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Éxito", description: "Noticia publicada correctamente" });
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/proposals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({ title: "Éxito", description: "Propuesta añadida correctamente" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({ title: "Éxito", description: "Actividad eliminada" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Éxito", description: "Noticia eliminada" });
    },
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/proposals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      toast({ title: "Éxito", description: "Propuesta eliminada" });
    },
  });

  const homeForm = useForm({
    resolver: zodResolver(insertHomeContentSchema),
    values: homeContent ? {
      heroTitle: homeContent.heroTitle,
      heroSubtitle: homeContent.heroSubtitle,
      heroImage: homeContent.heroImage || "",
      allianceName: homeContent.allianceName || "ALIANZA POR EL CAMBIO",
      allianceMovement: homeContent.allianceMovement || "ALIANZA POR EL PROGRESO 2026",
      candidateName: homeContent.candidateName || "Candidato Lista 1",
      candidateRole: homeContent.candidateRole || "Opción a Concejal Municipal",
      candidateImage: homeContent.candidateImage || "",
      candidateListNumber: homeContent.candidateListNumber || "AL",
      theme: homeContent.theme || "colorado",
    } : { 
      heroTitle: "", 
      heroSubtitle: "", 
      heroImage: "",
      allianceName: "",
      allianceMovement: "",
      candidateName: "",
      candidateRole: "",
      candidateImage: "",
      candidateListNumber: "AL",
      theme: "colorado",
    },
  });

  const activityForm = useForm({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: { title: "", description: "", date: new Date().toISOString().split("T")[0], imageUrl: "" },
  });

  const newsForm = useForm({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: { title: "", content: "", imageUrl: "" },
  });

  const proposalForm = useForm({
    resolver: zodResolver(insertProposalSchema),
    defaultValues: { title: "", description: "", category: "Salud" },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      callback(url);
      toast({ title: "Éxito", description: "Imagen subida correctamente" });
    } catch (err) {
      toast({ title: "Error", description: "Error al subir imagen", variant: "destructive" });
    }
  };

  const exportToExcel = () => {
    if (!supporters) return;
    const headers = "Nombre,Barrio,Teléfono,Mensaje,Fecha\n";
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers + 
      supporters.map(s => `${s.name},${s.neighborhood},${s.phone},${s.message || ""},${s.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "simpatizantes.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loadingSupporters || loadingActivities || loadingNews || loadingProposals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Control Electoral</h1>
          <div className="flex items-center gap-4">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px] bg-primary/90 border-white/20 text-white">
                <Palette className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Cambiar Estilo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="colorado">Colorado (Rojo)</SelectItem>
                <SelectItem value="alianza">Alianza (Naranja)</SelectItem>
              </SelectContent>
            </Select>
            <span>Bienvenido, {user?.username}</span>
            <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" /> Salir
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="supporters">Simpatizantes</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="settings">Ajustes Web</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Simpatizantes</CardTitle><Users className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{supporters?.length || 0}</div></CardContent></Card>
              <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Actividades</CardTitle><Calendar className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{activities?.length || 0}</div></CardContent></Card>
              <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Noticias</CardTitle><Newspaper className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{news?.length || 0}</div></CardContent></Card>
              <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Propuestas</CardTitle><Lightbulb className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{proposals?.length || 0}</div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="supporters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Lista de Simpatizantes</CardTitle><CardDescription>Personas registradas en la plataforma.</CardDescription></div>
                <Button onClick={exportToExcel} variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Exportar CSV</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Barrio</TableHead><TableHead>Teléfono</TableHead><TableHead>Mensaje</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {supporters?.map((s) => (<TableRow key={s.id}><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s.neighborhood}</TableCell><TableCell>{s.phone}</TableCell><TableCell className="max-w-xs truncate">{s.message}</TableCell></TableRow>))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>En los Barrios (Actividades)</CardTitle><CardDescription>Gestiona las actividades territoriales.</CardDescription></div>
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2"/> Nueva Actividad</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Crear Actividad</DialogTitle></DialogHeader>
                      <Form {...activityForm}><form onSubmit={activityForm.handleSubmit(data => createActivityMutation.mutate(data))} className="space-y-4">
                        <FormField control={activityForm.control} name="title" render={({field}) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                        <FormField control={activityForm.control} name="description" render={({field}) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field}/></FormControl></FormItem>)}/>
                        <FormField control={activityForm.control} name="date" render={({field}) => (<FormItem><FormLabel>Fecha</FormLabel><FormControl><Input type="date" {...field}/></FormControl></FormItem>)}/>
                        <FormField control={activityForm.control} name="imageUrl" render={({field}) => (<FormItem><FormLabel>Imagen URL</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                        <div className="flex gap-2">
                          <Input type="file" onChange={(e) => handleFileUpload(e, (url) => activityForm.setValue("imageUrl", url))} />
                        </div>
                        <Button type="submit" className="w-full" disabled={createActivityMutation.isPending}>Crear</Button>
                      </form></Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities?.map(a => (
                      <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteActivityMutation.mutate(a.id)} disabled={deleteActivityMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Noticias y Blog</CardTitle><CardDescription>Gestiona las publicaciones de la campaña.</CardDescription></div>
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2"/> Nueva Noticia</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Publicar Noticia</DialogTitle></DialogHeader>
                      <Form {...newsForm}><form onSubmit={newsForm.handleSubmit(data => createNewsMutation.mutate(data))} className="space-y-4">
                        <FormField control={newsForm.control} name="title" render={({field}) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                        <FormField control={newsForm.control} name="content" render={({field}) => (<FormItem><FormLabel>Contenido</FormLabel><FormControl><Textarea {...field}/></FormControl></FormItem>)}/>
                        <FormField control={newsForm.control} name="imageUrl" render={({field}) => (<FormItem><FormLabel>Imagen URL</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                        <div className="flex gap-2">
                          <Input type="file" onChange={(e) => handleFileUpload(e, (url) => newsForm.setValue("imageUrl", url))} />
                        </div>
                        <Button type="submit" className="w-full" disabled={createNewsMutation.isPending}>Publicar</Button>
                      </form></Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news?.map(n => (
                      <div key={n.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteNewsMutation.mutate(n.id)} disabled={deleteNewsMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle>Propuestas</CardTitle><CardDescription>Plan de gobierno segmentado.</CardDescription></div>
                  <Dialog>
                    <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2"/> Nueva Propuesta</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Añadir Propuesta</DialogTitle></DialogHeader>
                      <Form {...proposalForm}><form onSubmit={proposalForm.handleSubmit(data => createProposalMutation.mutate(data))} className="space-y-4">
                        <FormField control={proposalForm.control} name="title" render={({field}) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                        <FormField control={proposalForm.control} name="description" render={({field}) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field}/></FormControl></FormItem>)}/>
                        <FormField control={proposalForm.control} name="category" render={({field}) => (
                          <FormItem><FormLabel>Categoría</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una categoría"/></SelectTrigger></FormControl>
                              <SelectContent><SelectItem value="Salud">Salud</SelectItem><SelectItem value="Educación">Educación</SelectItem><SelectItem value="Infraestructura">Infraestructura</SelectItem><SelectItem value="Seguridad">Seguridad</SelectItem></SelectContent>
                            </Select>
                          </FormItem>
                        )}/>
                        <Button type="submit" className="w-full" disabled={createProposalMutation.isPending}>Añadir</Button>
                      </form></Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proposals?.map(p => (
                      <div key={p.id} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">{p.category}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteProposalMutation.mutate(p.id)} disabled={deleteProposalMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ajustes de la Página de Inicio</CardTitle>
                <CardDescription>Edita el contenido visual de la sección Hero.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...homeForm}>
                  <form onSubmit={homeForm.handleSubmit(data => updateHomeContentMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={homeForm.control}
                      name="heroTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título Hero</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={homeForm.control}
                      name="heroSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtítulo Hero</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={homeForm.control}
                      name="heroImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagen Hero (Fondo de toda la sección)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input {...field} placeholder="URL de la imagen" />
                              <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => homeForm.setValue("heroImage", url))} />
                                <Upload className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={homeForm.control}
                        name="allianceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Partido</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={homeForm.control}
                        name="allianceMovement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Movimiento Político</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={homeForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color de la Web</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="colorado">Colorado (Rojo)</SelectItem>
                                <SelectItem value="alianza">Alianza (Naranja)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={homeForm.control}
                        name="candidateName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Candidato</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={homeForm.control}
                        name="candidateRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo del Candidato</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={homeForm.control}
                        name="candidateListNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Lista (Eje: LISTA 1)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="AL" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={homeForm.control}
                      name="candidateImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagen del Candidato (Foto en primer plano)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input {...field} placeholder="URL de la imagen" />
                              <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => homeForm.setValue("candidateImage", url))} />
                                <Upload className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-red-700" disabled={updateHomeContentMutation.isPending}>
                      {updateHomeContentMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
