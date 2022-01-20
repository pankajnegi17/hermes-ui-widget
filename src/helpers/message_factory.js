export function generateTextMessageData(message, speaks = "bot") {
    let Defaultsayss = {
      speaks: speaks,
      msg: {
        text: {
          text: message,
        },
      },
    };
  return Defaultsayss
  }


export function generateIframeMessageData(
    video_url,
    iframeHeading = "Click here to open",
    speaks = "bot"
  ) {
    let iframeSays = {
      speaks: speaks,
      url: video_url,
      type: "iframe",
      hideMinWindow: true,
      text: iframeHeading,
    };

return iframeSays
  }

export function generateDataCardMessageData(cardData) {
    let says = {
      speaks: "bot",
      datacard: cardData,
    };
    
    return says;
  }

 export function generateListMessagesData(listData, listHeading = "Here is teh List") { 
    let tableItems = listData[0];
    let data = listData;
    let columns = [];
    let keys = Object.keys(tableItems);

    for (let i = 0; i < keys.length; i++) {
      columns.push({
        title: keys[i],
        field: keys[i],
      });
    }

    // for (let count = 0; count < response.data.MESSAGE.BODY.length; count++) {
    for (let i = 0; i < listData.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        let propName = columns[j].field;
        // data.push({
        //   propName : tableItems[i][columns[j].title]
        // })
        data[i][propName] = listData[i][columns[j].title];
      }
    }

    const tableData = {
      speak: "bot",
      type: "tableList",
      text: listHeading,
      columns,
      data,
    };

    return tableData;

  }


  export function generatePdfMessage(thumbnails, file_paths, type = 'url'){
   return {
      speaks: "bot",
      msg: {
        files: thumbnails,
        url: "",
        file_path: file_paths,
        tableItems: [],
        filetype: type
      },
      is_notification:  false, 
      from: "bot"
    }
  }

  
 

  export function generateFormMessage(formData, userQuery){
    return {
      speaks: "bot",
      type: "form", 
      formData:formData,
      userQuery: userQuery,
      formType: 'leave_request'
    }
  }


  export function generateStatusCardMessage(cardItems){
    return{statuscard:cardItems,
    speaks:"bot"}
  
  }
 

   

  export function generateDocumentCardMessage(cardData){
    
    //Display Normal PDF 
    if(cardData.BODY.length == 1){
      let base64Array = cardData.BODY.map((str) =>
      str.data.slice(2, str.data.length - 1)
    );
   return  generatePdfMessage(["Filename"], base64Array, "data");
    }
    else return {
      speaks:"bot",
      type:'DOC_SUGGESTIONS',
      suggestions:cardData.BODY.map(suggestion=>{
        return {headers:suggestion.headers,data:suggestion.data.slice(2, suggestion.data.length - 1)}
      })
    }
  }

  export function generateBotTypingData(message, speaks = "bot") {
    let Defaultsayss = {
      speaks: 'bot',
      typingBubble:true
    };
  return Defaultsayss
  }


  export function generateDetailedCardMessage(cardData){
    
    //Display Normal PDF 
  //   if(cardData.BODY.length == 1){
  //     let base64Array = cardData.BODY.map((str) =>
  //     str.data.slice(2, str.data.length - 1)
  //   );
  //  return  generatePdfMessage(["Filename"], base64Array, "data");
  //   }
    // else 
    return {
      speaks:"bot",
      type:'WEB_SUGGESTIONS',
      suggestions:cardData.map(suggestion=>{
        return {main_title:suggestion.main_title,
          url:suggestion.url,
        title:suggestion.title,
      value: suggestion.value}
      })
    }
  }


  export function generateActionMessageData(actions, speaks = "bot") {
    let Defaultsayss = {
      speaks: speaks,
      type: "actions",
      msg: {
        actions
      },
    };
  return Defaultsayss
  }