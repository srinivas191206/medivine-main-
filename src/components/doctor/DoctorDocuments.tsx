
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const documentTypes = [
  { value: 'aadhaar', label: 'Aadhaar Card', required: true },
  { value: 'pan', label: 'PAN Card', required: true },
  { value: 'medical_license', label: 'Medical License', required: true },
  { value: 'certificate', label: 'Medical Certificate', required: true },
  { value: 'degree', label: 'Medical Degree', required: false },
  { value: 'experience', label: 'Experience Certificate', required: false }
];

const DoctorDocuments = () => {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    try {
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (doctorData) {
        setDoctorId(doctorData.id);
        fetchDocuments(doctorData.id);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  const fetchDocuments = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from('doctor_documents')
        .select('*')
        .eq('doctor_id', docId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    if (!doctorId) return;

    setUploading(documentType);
    try {
      // For demo purposes, we'll create a mock URL
      // In production, you would upload to Supabase Storage
      const mockUrl = `https://example.com/documents/${user?.id}/${documentType}_${Date.now()}.pdf`;

      const { error } = await supabase
        .from('doctor_documents')
        .insert({
          doctor_id: doctorId,
          document_type: documentType,
          document_url: mockUrl
        });

      if (error) throw error;

      toast.success('Document uploaded successfully');
      fetchDocuments(doctorId);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    if (!doc) return null;

    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending Review', icon: Clock },
      approved: { color: 'bg-green-500', text: 'Approved', icon: CheckCircle },
      rejected: { color: 'bg-red-500', text: 'Rejected', icon: AlertCircle },
      under_review: { color: 'bg-blue-500', text: 'Under Review', icon: Clock }
    };

    const config = statusConfig[doc.verification_status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('doctor_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Document deleted successfully');
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading documents...</p>
        </div>
      </div>
    );
  }

  const requiredDocs = documentTypes.filter(doc => doc.required);
  const optionalDocs = documentTypes.filter(doc => !doc.required);
  const uploadedRequiredDocs = requiredDocs.filter(doc => 
    documents.some(d => d.document_type === doc.value)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
            Documents & Verification
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300 mt-1">
            Upload and manage your professional documents for KYC verification
          </p>
        </div>
        
        {/* Progress */}
        <div className="text-right">
          <div className="text-sm text-health-navy-600 dark:text-health-navy-300">
            Required Documents
          </div>
          <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
            {uploadedRequiredDocs.length}/{requiredDocs.length}
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredDocs.map((docType) => {
            const existingDoc = documents.find(d => d.document_type === docType.value);
            const isUploading = uploading === docType.value;

            return (
              <div
                key={docType.value}
                className="flex items-center justify-between p-4 border border-health-navy-200 dark:border-health-navy-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-health-navy-800 dark:text-white">
                    {docType.label}
                  </h3>
                  {existingDoc && (
                    <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                      Uploaded on {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {getDocumentStatus(docType.value)}
                  
                  {existingDoc ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(existingDoc.document_url, '_blank')}
                      >
                        View
                      </Button>
                      {existingDoc.verification_status !== 'approved' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDocument(existingDoc.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id={`file-${docType.value}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, docType.value);
                          }
                        }}
                        disabled={isUploading}
                      />
                      <Label htmlFor={`file-${docType.value}`}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                        >
                          <span className="cursor-pointer">
                            {isUploading ? (
                              <>Uploading...</>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optional Documents */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Documents (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optionalDocs.map((docType) => {
            const existingDoc = documents.find(d => d.document_type === docType.value);
            const isUploading = uploading === docType.value;

            return (
              <div
                key={docType.value}
                className="flex items-center justify-between p-4 border border-health-navy-200 dark:border-health-navy-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-health-navy-800 dark:text-white">
                    {docType.label}
                  </h3>
                  {existingDoc && (
                    <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                      Uploaded on {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {getDocumentStatus(docType.value)}
                  
                  {existingDoc ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(existingDoc.document_url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDocument(existingDoc.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id={`file-${docType.value}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, docType.value);
                          }
                        }}
                        disabled={isUploading}
                      />
                      <Label htmlFor={`file-${docType.value}`}>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                        >
                          <span className="cursor-pointer">
                            {isUploading ? (
                              <>Uploading...</>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="glass-card bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Document Requirements
          </h3>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• Upload clear, high-resolution images or PDFs</li>
            <li>• All documents must be valid and not expired</li>
            <li>• Medical license should be current and verified</li>
            <li>• Allow 2-3 business days for verification</li>
            <li>• You'll be notified once verification is complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDocuments;
