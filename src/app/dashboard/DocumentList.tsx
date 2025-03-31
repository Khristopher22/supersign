'use client'

import { useEffect, useState } from "react"
import { toast } from 'react-toastify'
import PDFSignatureModal from '@/components/PDFSignatureModal'

type Document = {
    id: string
    pathname: string
    fileKey: string
    url: string
    uploadedAt: string
    size: number
    status: string
}

export default function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/list")
            const data = await res.json()

            if (data.success) {
                setDocuments(data.blobs)
            } else {
                toast.error(data.error || "Erro ao carregar documentos.")
            }
        } catch (error) {
            console.error("Erro ao carregar documentos:", error)
            toast.error("Erro ao carregar documentos.")
        } finally {
            setLoading(false)
        }
    }

    const deleteDocument = async (id: string) => {
        try {
            const res = await fetch(`/api/delete?id=${id}`, { method: "DELETE" })

            let result: any = {}
            const contentType = res.headers.get("content-type")

            if (contentType && contentType.includes("application/json")) {
                result = await res.json()
            }

            if (!res.ok) {
                toast.error(result.error || "Erro ao excluir documento.")
                return
            }

            setDocuments(prev => prev.filter(doc => doc.id !== id))
            toast.success("Documento excluído com sucesso.")
        } catch (err) {
            console.error("Erro ao excluir:", err)
            toast.error("Erro ao excluir o documento.")
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    if (loading) return <p className="text-gray-600">Carregando documentos...</p>
    if (documents.length === 0) return <p className="text-gray-600">Nenhum documento encontrado.</p>

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Seus Documentos</h2>
            <ul className="space-y-6">
                {documents.map((doc) => {
                    const fileName = doc.pathname.split("/").pop() || doc.pathname
                    return (
                        <li key={doc.id} className="bg-white shadow rounded p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{fileName}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(doc.uploadedAt).toLocaleString()} • {(doc.size / 1024).toFixed(1)} KB •{" "}
                                        <span
                                            className={`font-semibold ${doc.status === "PENDING"
                                                    ? "text-red-600"
                                                    : doc.status === "SIGNED"
                                                        ? "text-green-600"
                                                        : "text-gray-500"
                                                }`}
                                        >
                                            {doc.status === "PENDING" ? "Pendente" : "Assinado"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            if (!doc.url) {
                                                toast.error("URL do documento inválida.")
                                                return
                                            }
                                            window.open(doc.url, '_blank', 'noopener,noreferrer')
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Baixar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                if (!doc.url) {
                                                    toast.error("URL do documento inválida.")
                                                    return
                                                }

                                                const response = await fetch(doc.url)
                                                if (!response.ok) throw new Error("Erro ao buscar o PDF.")

                                                const arrayBuffer = await response.arrayBuffer()
                                                const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
                                                const blobUrl = URL.createObjectURL(blob)

                                                window.open(blobUrl, '_blank')
                                            } catch (err) {
                                                console.error("Erro ao abrir o PDF:", err)
                                                toast.error("Não foi possível visualizar o PDF.")
                                            }
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Visualizar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!doc.id) {
                                                console.error("ID do documento ausente:", doc)
                                                return toast.error("Erro interno: ID do documento ausente")
                                            }
                                            deleteDocument(doc.id)
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Excluir
                                    </button>
                                    {doc.status === "PENDING" && (
                                        <button
                                            onClick={() => setSelectedDocument(doc)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                        >
                                            Assinar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {selectedDocument && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                        <PDFSignatureModal
                            documentId={selectedDocument.id}
                            onSigned={() => {
                                setSelectedDocument(null)
                                setTimeout(() => {
                                    fetchDocuments()
                                }, 500) // pequena espera para garantir que o blob e o banco já foram atualizados
                            }}
                            padWidth={400}
                            padHeight={150}
                            styleWidth="100%"
                            styleHeight="150px"
                        />
                        <button
                            onClick={() => setSelectedDocument(null)}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
