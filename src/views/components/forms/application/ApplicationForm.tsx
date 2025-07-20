"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const necesidadesOptions = [
    { id: "ventas_b2b", label: "Ventas B2B" },
    { id: "ventas_b2c", label: "Ventas B2C" },
    { id: "talento", label: "Búsqueda de Talento" },
    { id: "capital", label: "Levantar Capital" },
    { id: "posicionamiento", label: "Posicionamiento" },
    { id: "marketing", label: "Marketing Digital" },
    { id: "ux_ui", label: "UX y UI" },
    { id: "otros", label: "Otros" }
];

const applicationSchema = z.object({
    startupId: z.string().min(1, "Por favor selecciona una startup"),
    solucion: z.string().min(10, "Por favor describe tu solución con más detalle"),
    razonIngreso: z.string().min(10, "Por favor proporciona una razón válida"),
    necesidades: z.array(z.string()).nonempty({
        message: "Por favor selecciona al menos una necesidad"
    }),
    participacionPrevia: z.boolean().default(false),
    programaPrevio: z.string().optional(),
    aprendizajes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface Startup {
    id: string;
    nombre: string;
    descripcion: string;
    etapa: string;
    categoria: string;
    rol: string;
}

interface ApplicationFormProps {
    applicationId: string; // ID de la convocatoria a la que se postula
    initialData?: Partial<ApplicationFormValues>;
    onSubmit: (data: ApplicationFormValues) => void;
    onCancel: () => void;
}

export default function ApplicationForm({
    applicationId,
    initialData,
    onSubmit,
    onCancel
}: ApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoadingStartups, setIsLoadingStartups] = useState(true);

    console.log("🔍 ApplicationForm - Props recibidas:");
    console.log("  - applicationId:", applicationId);

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: initialData || {
            startupId: "",
            solucion: "",
            razonIngreso: "",
            necesidades: [],
            participacionPrevia: false,
            programaPrevio: "",
            aprendizajes: ""
        },
    });

    // Observar el valor del radio button para mostrar campos condicionales
    const participacionPrevia = form.watch("participacionPrevia");

    // Cargar startups del usuario
    useEffect(() => {
        const fetchStartups = async () => {
            console.log("🔄 ApplicationForm - Cargando startups del usuario");
            setIsLoadingStartups(true);

            try {
                const response = await fetch('/api/users/startups');
                const data = await response.json();

                console.log("📨 ApplicationForm - Respuesta startups:", data);

                if (response.ok) {
                    console.log("✅ ApplicationForm - Startups cargadas:", data.startups.length);
                    setStartups(data.startups || []);
                } else {
                    console.error("❌ ApplicationForm - Error al cargar startups:", data.error);
                    toast.error(data.error || "Error al cargar las startups");
                    setStartups([]);
                }
            } catch (error) {
                console.error("💥 ApplicationForm - Error en petición startups:", error);
                toast.error("Error al cargar las startups");
                setStartups([]);
            } finally {
                setIsLoadingStartups(false);
            }
        };

        fetchStartups();
    }, []);

    const handleSubmit = async (data: ApplicationFormValues) => {
        console.log("📝 ApplicationForm - handleSubmit - Datos:", data);
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/applications/${applicationId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("📨 ApplicationForm - Respuesta del servidor:", result);

            if (response.ok) {
                console.log("✅ ApplicationForm - Postulación enviada exitosamente");
                toast.success(result.message || "Postulación enviada exitosamente");
                onSubmit(data);
            } else {
                console.error("❌ ApplicationForm - Error del servidor:", result.error);
                toast.error(result.error || "Error al enviar la postulación");
            }
        } catch (error) {
            console.error("💥 ApplicationForm - Error en petición:", error);
            toast.error("Error al enviar la postulación");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                {/* ✅ NUEVO: Selector de startup */}
                <FormField
                    control={form.control}
                    name="startupId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Elegir startup <span className="text-destructive">*</span></FormLabel>
                            <FormDescription>
                                Selecciona la startup con la que quieres postular a esta convocatoria
                            </FormDescription>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                disabled={isLoadingStartups}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue 
                                            placeholder={
                                                isLoadingStartups 
                                                    ? "Cargando startups..." 
                                                    : startups.length === 0 
                                                        ? "No tienes startups disponibles"
                                                        : "Selecciona una startup"
                                            } 
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {startups.map((startup) => (
                                        <SelectItem key={startup.id} value={startup.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{startup.nombre}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {startup.etapa} • {startup.categoria} • Tu rol: {startup.rol}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="solucion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>¿Cuál es la solución que ofrecen y qué la hace especial o innovadora? <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe brevemente la solución que ofrece tu startup y qué la hace especial"
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="razonIngreso"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Razón para ingresar a programa <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Explica por qué quieres que tu startup forme parte de este programa"
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="necesidades"
                    render={() => (
                        <FormItem>
                            <FormLabel>¿Cuáles son las principales necesidades o áreas de mejora que tiene actualmente tu startup? <span className="text-destructive">*</span></FormLabel>
                            <FormDescription>
                                Selecciona todas las opciones que apliquen
                            </FormDescription>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {necesidadesOptions.map((option) => (
                                    <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="necesidades"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={option.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(option.id)}
                                                            onCheckedChange={(checked) => {
                                                                const value = field.value || [];
                                                                return checked
                                                                    ? field.onChange([...value, option.id])
                                                                    : field.onChange(
                                                                        value.filter((val) => val !== option.id)
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal">
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage className={cn(
                                form.formState.errors.necesidades ? "block" : "hidden",
                                "mt-2"
                            )} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="participacionPrevia"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>¿Han sido parte de algún programa aceleración?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => field.onChange(value === "true")}
                                    defaultValue={field.value ? "true" : "false"}
                                    className="flex flex-row space-x-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="participacion-yes" />
                                        <Label htmlFor="participacion-yes">Sí</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="participacion-no" />
                                        <Label htmlFor="participacion-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {participacionPrevia && (
                    <div className="space-y-5 pl-4 border-l-2 border-muted">
                        <FormField
                            control={form.control}
                            name="programaPrevio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿En qué programa(s) participaron?</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Indica los programas de aceleración o incubación en los que has participado"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="aprendizajes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿Qué aprendieron de dicho programa y cómo lo aplicaron a la startup?</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe los principales aprendizajes y cómo los aplicaste"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || startups.length === 0}
                    >
                        {isSubmitting ? "Enviando..." : "Enviar postulación"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}