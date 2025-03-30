'use client'

import { useState, useRef } from "react"
import { Container } from "@/components/container"
import DocumentList from "./DocumentList"
import { toast } from 'react-toastify'

export default function DashboardClient() {
  const [file, setFile] = useState<File | null>(null)
  const [reload, setReload] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return toast.warning("Selecione um arquivo PDF primeiro.")

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()

    if (result.success) {

      if (inputRef.current) inputRef.current.value = ""
      setFile(null)
      setReload(prev => !prev)
    } else {
      toast.error("Falha no envio do arquivo.")
    }
  }

  return (
    <Container>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Adicionar PDF</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecione um arquivo PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                ref={inputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>

            <button
              onClick={handleUpload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Enviar PDF
            </button>
          </div>
        </div>

        <DocumentList key={reload ? 'reload-1' : 'reload-0'} />
      </div>
    </Container>
  )
}
