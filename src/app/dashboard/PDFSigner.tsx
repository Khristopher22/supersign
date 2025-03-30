'use client'

import SignatureCanvas from "react-signature-canvas"
import { useRef, useState } from "react"
import { toast } from 'react-toastify'

type Props = {
    documentId: string
    onSigned?: () => void
}

export default function PDFSigner({ documentId, onSigned }: Props) {
    const sigRef = useRef<SignatureCanvas>(null)
    const [signatureImg, setSignatureImg] = useState<string | null>(null)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [sending, setSending] = useState(false)

    const handleClear = () => {
        sigRef.current?.clear()
        setSignatureImg(null)
    }

    const saveSignature = () => {
        const base64 = sigRef.current?.getTrimmedCanvas().toDataURL("image/png")
        if (base64) {
            setSignatureImg(base64)
            toast.success("Assinatura salva! Agora clique na imagem do PDF para posicioná-la.")
        }
    }

    const handleClickPDF = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (!signatureImg) {
            toast.info("Desenhe e salve a assinatura primeiro.")
            return
        }

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = rect.height - (e.clientY - rect.top)

        setPosition({ x, y })
        toast.success("Posição marcada! Enviando assinatura ao PDF...")

        sendToAPI(x, y)
    }

    const sendToAPI = async (x: number, y: number) => {
        if (!signatureImg) return

        setSending(true)

        const res = await fetch("/api/sign-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                documentId,
                signatureImg,
                posX: x,
                posY: y,
                page: 0,
            }),
        })

        const result = await res.json()

        if (result.success) {
            toast.success("Documento assinado com sucesso!")
            onSigned?.()
        } else {
            toast.error("Erro ao assinar: " + result.error)
        }

        setSending(false)
    }

    return (
        <div className="mt-6 space-y-4">
            <div>
                <h3 className="text-md font-semibold mb-1">Desenhe sua assinatura:</h3>
                <SignatureCanvas
                    ref={sigRef}
                    penColor="black"
                    canvasProps={{
                        width: 400,
                        height: 150,
                        className: "border border-gray-300 rounded",
                    }}
                />
                <div className="mt-2 flex gap-2">
                    <button onClick={handleClear} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">
                        Limpar
                    </button>
                    <button onClick={saveSignature} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">
                        Salvar Assinatura
                    </button>
                </div>
            </div>

            {signatureImg && (
                <div>
                    <h3 className="text-md font-semibold mb-1">Clique no PDF para posicionar a assinatura:</h3>
                    <img
                        src={`/api/view?id=${documentId}`}
                        onClick={handleClickPDF}
                        className="border rounded cursor-crosshair max-w-full"
                        alt="PDF Preview"
                    />
                </div>
            )}

            {sending && <p className="text-sm text-gray-600">Enviando assinatura...</p>}
        </div>
    )
}
