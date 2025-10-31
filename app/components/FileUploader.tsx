import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the dropzone click
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {selectedFile ? (
            <div className="uploader-selected-file flex items-center justify-between p-3 bg-gray-100 rounded-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-200 transition"
                onClick={handleRemove}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;







// import React, {useCallback} from 'react'
// import {useState} from 'react';
// import {useDropzone} from 'react-dropzone'
// import { formatSize } from '~/lib/utils';

// interface FileUploaderProps {
//     onFileSelect?: (file: File | null) => void; 
// }

// const FileUploader = ({onFileSelect}:FileUploaderProps) => {
//     const onDrop = useCallback((acceptedFiles : File[]) => {
//     // Do something with the files
//     const file = acceptedFiles[0] || null;
//     onFileSelect?.(file);
//   }, [onFileSelect])

//     const maxFileSize = 20 * 1024 * 1024; // 20 MB

//   const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//         'application/pdf': ['.pdf']
//     },
//     maxSize: maxFileSize
// })

//     const file = acceptedFiles[0] || null;


//   return (
//     <div className='w-full gradient-border'>
//         <div {...getRootProps()}>
//         <input {...getInputProps()} />
//             <div className='space-y-4 cursor-pointer'>
//                 {file?(
//                     <div className='uploader-selected-file' onClick={(e)=>e.stopPropagation()}>
//                         <img src="/images/pdf.png" alt="pdf" className='size-10'/>
//                         <div className='flex items-center space-x-3'>
//                             <p className='text-sm font-medium text-gray-700  truncate max-w-xs'>
//                                 {file.name}
//                             </p>
//                             <p>
//                                 {formatSize(file.size)}
//                             </p>
//                         </div>
//                         <button className='p-2 cursor-pointer' onClick={(e) =>{
//                             onFileSelect?.(null)
//                         }}>
//                             <img src="/icons/cross.svg" alt="remove" className='w-4 h-4' />
//                         </button>
//                     </div>
//                 ):(
//                     <div>
//                         <div className='mx-auto w-16 h-16 flex items-center justify-center mb-2'>
//                         <img src="/icons/info.svg" alt="upload" className='size-20'/>
//                         </div>
//                         <p className='text-lg text-gray-500'>
//                             <span className='font-semibold'>
//                                 Click to upload 
//                             </span> or drag and drop
//                         </p>
//                         <p className='text-lg text-gray-500'>PDF (max{formatSize(maxFileSize)})</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
//   )
// }

// export default FileUploader