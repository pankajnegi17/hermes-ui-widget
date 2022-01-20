const styles = {
    dropzoneActive: {
      borderColor: 'green',
    },
  }
  
  export const FileUploader = () => {
    const getUploadParams = ({ meta }) => {
      const url = 'https://httpbin.org/post'
      const fileUrl = `${url}/${encodeURIComponent(meta.name)}`
      return { url, meta: { fileUrl } }
    }
  
    const handleChangeStatus = ({ meta, file }, status) => {
      console.log(status, meta, file)
    }
  
    const handleSubmit = (files, allFiles) => {
      console.log(files.map(f => f.meta))
      allFiles.forEach(f => f.remove())
    }
  
    return (
      <ReactDropzoneUploader.default
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        styles={styles}
        height={200}
      />
    )
  }
  
export default FileUploader;
  