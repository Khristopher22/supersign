'use client'

import SignatureCanvas from 'react-signature-canvas'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
    documentId: string
    onSigned?: () => void
}

export default function SignaturePad({ documentId, onSigned }: Props) {
    const sigCanvas = useRef<SignatureCanvas>(null)
    const [submitting, setSubmitting] = useState(false)

    const clear = () => {
        sigCanvas.current?.clear()
    }

    const submitSignature = async () => {
        if (sigCanvas.current?.isEmpty()) {
            toast.info("Desenhe sua assinatura antes de enviar.")
            return
        }

        setSubmitting(true)

        const signatureData = sigCanvas.current
            ?.getTrimmedCanvas()
            .toDataURL("image/png")

        const res = await fetch("/api/sign", {
            method: "POST",
            body: JSON.stringify({
                documentId,
                signatureImg: signatureData,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const result = await res.json()

        if (result.success) {
            toast.success("Documento assinado com sucesso!")
            onSigned?.()
        } else {
            toast.error("Erro ao assinar o documento.")
        }

        setSubmitting(false)
    }

    return (
        <div className="bg-white p-4 border rounded shadow-md mt-6">
            <h3 className="text-lg font-semibold mb-2">Assine abaixo:</h3>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                    width: 400,
                    height: 150,
                    className: "border border-gray-300 rounded mb-2",
                }}
            />
            <div className="flex gap-2">
                <button
                    onClick={clear}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                    Limpar
                </button>
                <button
                    onClick={submitSignature}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    disabled={submitting}
                >
                    {submitting ? "Enviando..." : "Assinar Documento"}
                </button>
            </div>
        </div>
    )
}
