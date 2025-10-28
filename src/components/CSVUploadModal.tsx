'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, XCircle, Download, AlertCircle } from 'lucide-react'
import { parseCSVFile, generateCSVTemplate, CSVParseResult } from '@/lib/csv-parser'
import { cn } from '@/lib/utils'

interface CSVUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<{ success: boolean; message: string; results?: any }>
}

export function CSVUploadModal({ isOpen, onClose, onUpload }: CSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; results?: any } | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFile(file)
    setUploadResult(null)

    try {
      const result = await parseCSVFile(file)
      setParseResult(result)
    } catch (error) {
      setParseResult({
        success: false,
        errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  })

  const handleUpload = async () => {
    if (!file || !parseResult?.success) return

    setIsUploading(true)
    try {
      const result = await onUpload(file)
      setUploadResult(result)
      
      if (result.success) {
        setTimeout(() => {
          onClose()
          resetModal()
        }, 2000)
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetModal = () => {
    setFile(null)
    setParseResult(null)
    setUploadResult(null)
    setIsUploading(false)
  }

  const handleClose = () => {
    if (!isUploading) {
      onClose()
      resetModal()
    }
  }

  const downloadTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shipping-orders-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
          
          <motion.div
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Orders CSV</h2>
                <button
                  onClick={handleClose}
                  disabled={isUploading}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Upload Area */}
              {!file && (
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200',
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    or click to browse files
                  </div>
                  <div className="text-xs text-gray-500">
                    Supports .csv files up to 10MB
                  </div>
                </div>
              )}

              {/* File Selected */}
              {file && !parseResult && (
                <div className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Parse Results */}
              {parseResult && (
                <div className="space-y-4">
                  <div className={cn(
                    'border rounded-xl p-4',
                    parseResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  )}>
                    <div className="flex items-center space-x-3 mb-3">
                      {parseResult.success ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <div className={cn(
                          'font-medium',
                          parseResult.success ? 'text-green-900' : 'text-red-900'
                        )}>
                          {parseResult.success ? 'CSV Parsed Successfully' : 'CSV Parse Failed'}
                        </div>
                        <div className={cn(
                          'text-sm',
                          parseResult.success ? 'text-green-700' : 'text-red-700'
                        )}>
                          {parseResult.success 
                            ? `${parseResult.data?.length || 0} orders found`
                            : 'Please check the errors below'
                          }
                        </div>
                      </div>
                    </div>

                    {parseResult.errors && parseResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-red-800">Errors:</div>
                        <ul className="text-sm text-red-700 space-y-1">
                          {parseResult.errors.map((error, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {parseResult.warnings && parseResult.warnings.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-yellow-800">Warnings:</div>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {parseResult.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Upload Results */}
                  {uploadResult && (
                    <div className={cn(
                      'border rounded-xl p-4',
                      uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    )}>
                      <div className="flex items-center space-x-3">
                        {uploadResult.success ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <div className={cn(
                          'font-medium',
                          uploadResult.success ? 'text-green-900' : 'text-red-900'
                        )}>
                          {uploadResult.message}
                        </div>
                      </div>
                      
                      {uploadResult.results && (
                        <div className="mt-3 text-sm text-gray-700">
                          <div>Total: {uploadResult.results.total}</div>
                          <div>Successful: {uploadResult.results.successful}</div>
                          <div>Failed: {uploadResult.results.failed}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleClose}
                    disabled={isUploading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  
                  {file && parseResult?.success && !uploadResult && (
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isUploading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      )}
                      <span>{isUploading ? 'Uploading...' : 'Upload Orders'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
