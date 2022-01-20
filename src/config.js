require('dotenv').config()

//Adding commeant for eveloper
//This code is under developememt
// const public_config = require(`${process.env.PUBLIC_URL}/config.json`)

export const nlp_gateway_host ='hermesbetahr.workflo.ai'
export const nlp_gateway_port = 20000
// export const nlp_gateway_url = 'https://localhost:5010/conversation/request/v0'
export const nlp_gateway_url = 'https://hermesbetahr.workflo.ai:19002/conversation/request/v0'

export const domain = 'hr_finance'
// export const domain = 'hr_pro'
 
// export const instance_type = "frontend"
export const instance_type = "backend"

// export const chatbot_api_host = 'https://localhost:8094'
export const chatbot_api_host = 'https://hermesbetahr.workflo.ai:8094' 

// export const vefification_api = 'https://localhost:8094/varifyUser'
export const vefification_api = 'https://hermesbetahr.workflo.ai:8094/varifyUser'

// export const zoom_app_host = 'localhost'
export const zoom_app_host = 'hermesbetahr.workflo.ai'
export const zoom_app_port = 8093

// export const push_server_host = 'https://localhost:5005'
export const push_server_host = 'https://pushbeta.workflo.ai:5005'

export const form_builder_host = 'https://hermesvt.workflo.ai:8085/index/index/admin'
export const video_url  = "https://hermesvt.workflo.ai:8085/uploadexcel/uploadexcel" 

export const form_builder_url_user= "https://hermesvt.workflo.ai:8085/index/index/user"
export const form_builder_url_admin= "https://hermesvt.workflo.ai:8085/index/index/admin"
export const video_transcript_url= ""
export const excel_export_url= "https://formbuilderbeta.workflo.ai:8085/uploadexcel/uploadexcel"
