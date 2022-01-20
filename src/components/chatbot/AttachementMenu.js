import React, { Component } from 'react'
import axios from "axios/index";

export class AttachementMenu extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      previewImgSrc:"",
      attachementType:"",
      attachementSelected:false,
      imageSrc:"",
      files: []
       
    }

    this._onImageSelect =this._onImageSelect.bind(this);
    this.setPreviewImgSrc = this.setPreviewImgSrc.bind(this);    
    this._onSendButtonClick = this._onSendButtonClick.bind(this);
    this.openUploader = this.openUploader.bind(this);
  }
  
  openUploader(uploaderType){
    this.props.setUploaderType(uploaderType);
    this.props._toggleAttachButton();
    }
  

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

  setPreviewImgSrc(data){     
    this.setState({previewImgSrc:data})
  }


    //Methos for image preview
    handleChange(files){   
        
      this.setState({
        files: files
      },()=>this._onSendButtonClick());
    }
      //Methos for sending Images to server
  _onSendButtonClick(e){
     
    let imageString = []
    let imageList =this.state.files;
    this.setState({files:[]})

    let idCardBase64 = '';


    for(let i=0;i<imageList.length;i++){       
      this.getBase64(imageList[i] , (result) => { 
        imageString[i] = result;
        if(i==imageList.length-1){
          this.props.sendMessageToDb({type:"attachement",data:imageString},"")
        }
   });
    }

    console.log(imageString); 
    this.props._toggleAttachButton(); 
  }


 async  _onImageSelect(e){
    
   let imageBase64 = '';

this.getBase64(e.target.files[0], (result) => {
  imageBase64 = result;
  this.setState({imageSrc:imageBase64})
});
 
  this.setState({attachementSelected:true});
  this.setState({attachementType:"image"})
    
  }
 

    // await axios.post("http://localhost:5000/saveFileData",{data:base64fotmat})
    
   // oFReader.readAsDataURL(this.componentWillReceiveProps.file-input.files[0]);
   // oFReader.onload = function (oFREvent) {
    // document.getElementById("uploadPreview").src = oFREvent.target.result;
//   };
//  
  
    render() {
        return ( 
      <div className={this.props.classNames}>
      <div class="row">
      <div class="col s4  at-menu-icons-wrapper" onClick={()=>this.openUploader("image")}>
      <a class="btn-floating btn-large waves-effect waves-light clr-purple"> 
      <div className="image-upload">
        <label for="file-input">
        <i class="material-icons dp48">image</i>
        </label> 
        {/* <input ref="fileInput" id="file-input" name="file-input" type="file"   onChange={this.handleChange.bind(this)} */}
       {/* /> */}
        </div> </a>
        </div>

        <div class="col s4  at-menu-icons-wrapper " onClick={()=>this.openUploader("documents")}>
      <a class="btn-floating btn-large waves-effect waves-light clr-blue"> 
      <div className="image-upload">
        <label for="file-input">
        <i class="material-icons dp48">attach_file</i>
        </label> 
        {/* <input id="file-input" type="file" onSelect={(e)=>this._onImageSelect(e)}  accept="image/png, image/jpeg"/> */}
        </div> </a>
        </div>

        <div class="col s4  at-menu-icons-wrapper ">
      <a class="btn-floating btn-large waves-effect waves-light clr-skyblue"> 
      <div className="image-upload">
        <label for="file-input">
        <i class="material-icons dp48">cloud_download</i>
        </label> 
        {/* <input id="file-input" type="file"/> */}
        </div> </a>
        </div>

   
 
      </div> 

      <img src={this.state.imageSrc} ref="previewFile" height="200" alt="Image preview..."></img>
            </div>
       
         )
    }
}

export default AttachementMenu
