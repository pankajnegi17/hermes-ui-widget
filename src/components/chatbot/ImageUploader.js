const { Component } = React 
const Dropzone = reactDropzone


const handleDropRejected = (...args) => console.log('reject', args)

export class ImageUpload extends Component {
  constructor(props) {
    super(props)
    
    this.state = { preview: null }
    this.handleDrop = this.handleDrop.bind(this)
  }
  
  handleDrop([{ preview }]) {
    this.setState({ preview })
  }
  
  render() {
    const { preview } = this.state
    
    return (    
      <section>
        <Dropzone onDrop={ this.handleDrop } accept="image/jpeg,image/jpg,image/tiff,image/gif" multiple={ false } onDropRejected={ handleDropRejected }>
          Drag a file here or click to upload.
        </Dropzone>
        { preview &&
        <img src={ preview } alt="image preview" />
        }
      </section>
    )
  }
}

export default ImageUpload;