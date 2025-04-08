"use client";
import React, {  useState } from "react";
import {  IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess :(res :IKUploadResponse)=> void
    onProgress :(progress : number) =>void
    fileType?: "image" | "video"
}

export default function FileUpload({onSuccess , onProgress , fileType} : FileUploadProps) {
const [uploading , setUploading ] = useState(false)
const [error , setError ] = useState<string | null >(null)

const onError = (err : {message: string}) => {
    console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (res :IKUploadResponse) => {
    console.log("Success", res);
    setUploading(false)
    setError(null)
    onSuccess(res)
  };
  
  const handleProgress = (evt : ProgressEvent) => {
if(evt.lengthComputable && onProgress){
const percentComplete = (evt.loaded / evt.total)*100
onProgress(Math.round(percentComplete))
}  };
  
  const handleStartUpload = () => {
    setUploading(true)
    setError(null)

  };

  const validateFile = (file : File)=>{
    if(fileType === "video"){
        if(!file.type.startsWith("video/")){
            setError("Please upload video file")
            return false
        } if(file.size > 100 *1024 *1024){
            setError("Video size should be less the 100 mb")
            return  false
        }
    }else{
       const validTypes = ["image/png" , "image/jpeg" ,"image/webp"]
       if(!validTypes.includes(file.type)){
        setError("Please upload either png , jpeg or webp")
        return false
       }if(file.size > 5 *1024 *1024){
        setError("Video size should be less the 100 mb")
        return  false
    }
    }
    return false
  }
  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video": "image"}
          useUniqueFileName={true}
          responseFields={["tags"]}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          folder={fileType ==="video" ? "/videos" :"images"}
        />
        {
            uploading && (
                <div className=" flex text-blue-500 text-sm items-center gap-2">
<Loader2 className="animate-spin w-4 h-4" />
<span>Uploading...</span>
                </div>
            )
        }
        {
            error && (
                <div className=" flex text-red-500 text-sm items-center gap-2">
                {error}
                                </div>
            )
        }
    </div>
  );
}