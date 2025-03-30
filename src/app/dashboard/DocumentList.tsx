'use client'

import { useEffect, useState } from "react"
import PDFSignatureModal from "@/components/PDFSignatureModal"
import { toast } from 'react-toastify'

type Document = {
    id: string
    name: string
    createdAt: string
    status: string
}

export default function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [signingDocId, setSigningDocId] = useState<string | null>(null)

    const fetchDocuments = async () => {
        setLoading(true)
        const res = await fetch("/api/documents")
        const data = await res.json()
        if (data.success) {
            setDocuments(data.documents)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const deleteDocument = async (id: string) => {
        try {
            const res = await fetch(`/api/delete?id=${id}`, { method: "DELETE" })
            const result = await res.json()

            if (result.success) {
                setDocuments(prev => prev.filter(doc => doc.id !== id))
                toast.success("Documento excluído com sucesso.")
            } else {
                toast.error("Erro ao excluir documento.")
            }
        } catch (err) {
            console.error("Erro ao excluir:", err)
            toast.error("Erro ao excluir o documento.")
        }
    }

    if (loading) return <p className="text-gray-600">Carregando documentos...</p>
    if (documents.length === 0) return <p className="text-gray-600">Nenhum documento encontrado.</p>

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Seus Documentos</h2>
            <ul className="space-y-6">
                {documents.map((doc) => (
                    <li
                        key={doc.id}
                        className="bg-white shadow rounded p-4"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    {new Date(doc.createdAt).toLocaleString()} •
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
                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                <a
                                    href={`/api/view?id=${doc.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Visualizar
                                </a>
                                <button
                                    onClick={() => deleteDocument(doc.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Excluir
                                </button>
                                {doc.status === "PENDING" && (
                                    <button
                                        onClick={() => setSigningDocId(doc.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                    >
                                        Assinar
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {signingDocId && (
                <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative max-w-full w-[90%] sm:w-auto">
                        <button
                            onClick={() => setSigningDocId(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                        >
                            ×
                        </button>
                        <PDFSignatureModal
                            documentId={signingDocId}
                            onSigned={() => {
                                setSigningDocId(null)
                                fetchDocuments()
                            }}
                            padWidth={400}
                            padHeight={150}
                            styleWidth="400"
                            styleHeight="150"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
