<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentUpload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display teacher's documents.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $teacher = Auth::user();
        
        // Get ID documents
        $idFront = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', DocumentUpload::TYPE_ID_FRONT)
            ->latest()
            ->first();
            
        $idBack = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', DocumentUpload::TYPE_ID_BACK)
            ->latest()
            ->first();
            
        // Get certificates
        $certificates = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', DocumentUpload::TYPE_CERTIFICATE)
            ->latest()
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'name' => $cert->certificate_name ?? 'Certificate',
                    'image' => $cert->file_path,
                    'institution' => $cert->certificate_institution,
                    'issue_date' => $cert->issue_date,
                    'verification_status' => $cert->verification_status,
                    'uploaded' => true
                ];
            });
            
        // Get resume
        $resume = DocumentUpload::where('teacher_id', $teacher->id)
            ->where('document_type', DocumentUpload::TYPE_RESUME)
            ->latest()
            ->first();
            
        // Format data for frontend
        $documents = [
            'idVerification' => [
                'uploaded' => ($idFront || $idBack) ? true : false,
                'idType' => $idFront ? $idFront->id_type : null,
                'frontImage' => $idFront ? $idFront->file_path : null,
                'frontVerificationStatus' => $idFront ? $idFront->verification_status : null,
                'backImage' => $idBack ? $idBack->file_path : null,
                'backVerificationStatus' => $idBack ? $idBack->verification_status : null
            ],
            'certificates' => $certificates->count() ? $certificates : [],
            'resume' => [
                'uploaded' => $resume ? true : false,
                'file' => $resume ? $resume->file_path : null,
                'verification_status' => $resume ? $resume->verification_status : null
            ]
        ];
        
        return Inertia::render('teacher/documents', [
            'documents' => $documents
        ]);
    }
    
    /**
     * Upload a document.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function upload(Request $request)
    {
        $teacher = Auth::user();
        
        // Validate request
        $validated = $request->validate([
            'document_type' => 'required|in:id_front,id_back,certificate,resume',
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf,doc,docx|max:5120', // 5MB max
            'id_type' => 'nullable|string|required_if:document_type,id_front,id_back',
            'certificate_name' => 'nullable|string|required_if:document_type,certificate',
            'certificate_institution' => 'nullable|string',
            'issue_date' => 'nullable|date',
        ]);
        
        // Handle file upload
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        
        // Create path based on document type
        $path = 'teacher_documents/' . $teacher->id . '/' . $validated['document_type'];
        $filePath = $file->storeAs($path, $filename, 'public');
        
        // Create document record
        $document = new DocumentUpload();
        $document->teacher_id = $teacher->id;
        $document->document_type = $validated['document_type'];
        $document->file_path = $filePath;
        $document->file_name = $filename;
        $document->file_type = $file->getMimeType();
        $document->file_size = $file->getSize();
        $document->verification_status = 'pending';
        
        // Set additional fields based on document type
        if (in_array($validated['document_type'], ['id_front', 'id_back'])) {
            $document->id_type = $validated['id_type'] ?? null;
        } elseif ($validated['document_type'] === 'certificate') {
            $document->certificate_name = $validated['certificate_name'] ?? null;
            $document->certificate_institution = $validated['certificate_institution'] ?? null;
        }
        
        // Set issue date if provided
        if (isset($validated['issue_date'])) {
            $document->issue_date = $validated['issue_date'];
        }
        
        $document->save();
        
        return redirect()->route('teacher.documents.index')
            ->with('success', 'Document uploaded successfully.');
    }
    
    /**
     * Delete a document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete($id)
    {
        $teacher = Auth::user();
        
        // Find document
        $document = DocumentUpload::where('id', $id)
            ->where('teacher_id', $teacher->id)
            ->firstOrFail();
        
        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        // Delete document record
        $document->delete();
        
        return redirect()->route('teacher.documents.index')
            ->with('success', 'Document deleted successfully.');
    }
} 