'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from "react-toastify";

interface Props {
    documentId: string
    onSigned: () => void
    padWidth: number
    padHeight: number
    styleWidth: string
    styleHeight: string
}

export default function PDFSignatureModal({
    documentId,
    onSigned,
    padWidth,
    padHeight,
    styleWidth,
    styleHeight
}: Props) {
    const sigRef = useRef<SignatureCanvas | null>(null)
    const [sending, setSending] = useState(false)

    const handleSubmit = async () => {
        if (!sigRef.current || sigRef.current.isEmpty()) {
            toast.warning('Por favor, desenhe sua assinatura.')
            return
        }

        setSending(true)
        const signatureImg = sigRef.current.getTrimmedCanvas().toDataURL('image/png')

        const res = await fetch('/api/sign-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentId,
                signatureImg,
                posX: 100,
                posY: 100,
                page: -1
            })
        })

        const result = await res.json()
        setSending(false)

        if (result.success) {
            toast.success('Documento assinado com sucesso!')
            onSigned()
        } else {
            toast.error('Erro ao assinar o documento.')
        }
    }

    const clearSignature = () => {
        sigRef.current?.clear()
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            <p className="text-sm text-gray-700 text-center">Assine abaixo e clique em confirmar para assinar o PDF na última página.</p>
            <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                    width: padWidth,
                    height: padHeight,
                    style: {
                        width: styleWidth,
                        height: styleHeight,
                        border: '1px solid #ccc',
                        borderRadius: '0.375rem'
                    }
                }}
            />
            <div className="flex gap-4 mt-2">
                <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                    {sending ? 'Enviando...' : 'Confirmar Assinatura'}
                </button>
                <button
                    onClick={clearSignature}
                    disabled={sending}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded"
                >
                    Limpar
                </button>
            </div>
        </div>
    )
}
