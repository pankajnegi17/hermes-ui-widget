import React, {Component} from 'react'
import {DropzoneArea} from 'material-ui-dropzone';
import Button from '@material-ui/core/Button'; 
import Icon from '@material-ui/core/Icon'; 
import './imageAttachement.css'

 
 
class ImageAttachement extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    };
    this._onSendButtonClick = this._onSendButtonClick.bind(this)
  }

  //Methos for image preview
  handleChange(files){     
    this.setState({
      files: files
    });
  }

  //Methos for sending Images to server
  _onSendButtonClick(e){     
    let base64array = []
    let fileList =this.state.files;
    this.setState({files:[]})
    let idCardBase64 = '';
    for(let i=0;i<fileList.length;i++){       
      this.getBase64(fileList[i] , (result) => { 
        base64array[i] = result;
        if(i==fileList.length-1){
          this.props.sendMessageToDb(
            {
            from: this.props.logInStatus.username,
            user_type:'human',
            Message_data:{type:this.props.uploaderType == "image"?"image_attachement":"file_attachement",data:base64array}
            }
            
            ,"")
        }
   });
    }

    console.log(base64array); 
    this.props._toggleUploaderMenu(); 
  }

  //Methos returns base64 for a file
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

  render(){ 
    const { classes } = this.props;
    return ( 
      <div className={this.props.classNames}>
        {this.props.isUploaderMenuOpened && <DropzoneArea 
        onChange={this.handleChange.bind(this)}
        acceptedFiles={this.props.uploaderType == "image"?['image/jpeg', 'image/jpg', 'image/png']:['application/pdf']}
        showPreviews={false}
        filesLimit = {3}
        maxFileSize = {1000000}
        dropzoneText={this.props.uploaderType == "image"?"Drag and drop an image here or click":"Drag and drop an PDF file here or click"}
  />}

<Button
  variant="contained"
  color="primary" 
  onClick={this.props._toggleUploaderMenu}
  endIcon={<Icon>close</Icon>}
  className="btn-closeFileUploader"
>
  Close
</Button>


{
  this.state.files.length > 0 && <Button
  variant="contained"
  color="primary" 
  onClick={this._onSendButtonClick}
  endIcon={<Icon>send</Icon>}
  className="btn-sendFileUploader"
>
  Send
</Button>
}

      </div>
   
    )  
  }
} 
 
export default ImageAttachement;