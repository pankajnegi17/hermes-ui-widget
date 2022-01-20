// export default function create_transcript_query(user_query, calid) {
//   let new_query = user_query
//     .replace(/and/gi, "")
//     .replace(/the/gi, "")
//     .replace(/or/gi, "")
//     .replace(/about/gi,"")
//     .trim()
//     .replace(/\s+/g, " ").trim()

//   let final_query = new_query.replace(/ /g, " | "); 
//   let query_string = "keyword=" + final_query + "&calid=" + calid;
//   return query_string;
// }


export default function create_transcript_query(user_query, username) {
  let role ="user"
if(username == "alvian@hermes.com"){
  role="admin"
}

  return user_query;
}

export const reg_Formats = "";
