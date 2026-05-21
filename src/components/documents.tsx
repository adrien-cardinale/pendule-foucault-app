import { QRCodeSVG } from "qrcode.react";
import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DOC_URL = "https://zenodo.org/records/19587499";

export function Documents() {
    const isKiosk = navigator.userAgent.includes('PenduleKiosk');
    
    return (
        <Card className="p-8 flex items-center justify-center">
            <Card className="w-fit p-8">
                <CardHeader>
                    <CardTitle>Pendule de Foucault de la HEIG‐VD 30 ans d’observation et d’analyse expérimental</CardTitle>
                    <CardDescription>
                        Mudry, Freddy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isKiosk ? (
                        <div className="bg-white p-2 inline-block">
                            <QRCodeSVG value={DOC_URL} size={256} />
                        </div>
                    ) : (
                        <a
                            href={DOC_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors group w-fit"
                        >
                            <FileText className="h-10 w-10 text-muted-foreground shrink-0" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium leading-snug">Ouvrir le document</span>
                                <span className="text-xs text-muted-foreground">zenodo.org</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    )}
                </CardContent>
            </Card>
        </Card>
    )
}