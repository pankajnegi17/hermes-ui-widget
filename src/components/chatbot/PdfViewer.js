import React from 'react'
import PDFViewer from 'pdf-viewer-reactjs'
 
const PdfViewer = (props) => {
    // let pdfData = props.base64data 

    // pdfData.replace("data:application/pdf;base64, ","");
    return ( <div className="minPdfViewerWrapper">
           <PDFViewer
            document={{
                // url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
                base64:props.base64data
            }}
        />
    </div>      
     
    )
}
 
export default PdfViewer