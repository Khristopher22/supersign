'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from "react-toastify"

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

        try {
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
                    posX: 100, // posição fixa por enquanto
                    posY: 100,
                    page: -1 // -1 indica última página
                })
            })

            const result = await res.json()
            if (result.success) {
                toast.success('Documento assinado com sucesso!')
                onSigned()
            } else {
                toast.error(result.error || 'Erro ao assinar o documento.')
            }
        } catch (error) {
            console.error('Erro ao assinar:', error)
            toast.error('Erro ao enviar assinatura.')
        } finally {
            setSending(false)
        }
    }

    const clearSignature = () => {
        sigRef.current?.clear()
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <p className="text-sm text-gray-700 text-center">
                Assine abaixo e clique em <strong>Confirmar</strong> para inserir sua assinatura na última página do PDF.
            </p>

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
                        borderRadius: '0.375rem',
                        backgroundColor: '#fff'
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
