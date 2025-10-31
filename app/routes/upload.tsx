import React from 'react'
import Navbar from '~/components/Navbar'
import { useState } from 'react';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router-dom';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';

const upload = () => {
    const {auth, isLoading,fs,ai,kv} = usePuterStore();
    const navigate = useNavigate();
    const [isprocessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [ file,setFile] = useState<File | null>(null);
    
    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}:{companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        // setIsProcessing(true);
        // setStatusText('Uploading resume...');
        // const uploadedFile = await fs.upload([file]);
        // if(!uploadedFile) return setStatusText('Failed to upload file.');

        // setStatusText('converting to image...');
        // const imageFile = await convertPdfToImage(file);
        // if(!imageFile) return setStatusText('Failed to convert PDF to image.');

        // setStatusText('Uploading Image...');
        // const uploadedImage = await fs.upload([imageFile.file]);
        // if(!uploadedImage) return setStatusText('Failed to upload image.');
        if (!file) {
        setStatusText('No file selected.');
        return;}

        setIsProcessing(true);
        setStatusText('Uploading resume...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) {
            setIsProcessing(false);
            return setStatusText('Failed to upload file.');
        }

        setStatusText('converting to image...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile) {
            setIsProcessing(false);
            return setStatusText('Failed to convert PDF to image.');
        }

        setStatusText('Preparing data...');

        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumepath: uploadedFile.path,
            imagepath: uploadedFile.path,
            companyName,jobTitle,jobDescription,
            feedback: '',

        };
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing resume...');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobDescription, jobTitle})
        );
        if(!feedback) return setStatusText('Failed to analyze resume.');

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content: feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        // navigate(`/resume/${uuid}`);
    }
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    // const handleSubmit = (e.FormEvent<HTMLFormElement>) =>{}
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if(!file) return;
    
    handleAnalyze({companyName, jobTitle, jobDescription, file});
  };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>
            <section className='main-section'>
                <div className='page-heading py-16'>
                    <h1>Smart Feedback for your dream job</h1>
                    {isprocessing ? (
                        <>
                        <h2>{statusText}</h2>
                        <img src="/images/resume-scan.gif" alt="resume-scan" className='w-full' />
                        </>
                    ):(
                        <h2>Drop your resume for an ATS Score and improvemnts tips </h2>
                    )}
                    {!isprocessing && (
                        <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                            <div className='form-div'>
                                <label htmlFor="company-name">
                                Company Name
                                </label>
                                <input type="text" name='company-name' placeholder='Company Name' id='company-name' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="job-title">
                                Job title
                                </label>
                                <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="job-description">
                                Job Description
                                </label>
                                <textarea rows ={5} name='job-description' placeholder='job-description' id='job-description' />
                            </div>
                            <div className='form-div'>
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button className='primary-button' type= 'submit'>
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}

export default upload