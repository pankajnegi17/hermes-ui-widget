import {push_server_host} from './config'
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function swDev(first_name,email_id) {
  console.log("SW Started")
  let url = `${process.env.PUBLIC_URL}/sw.js`;
  const publicVapidKey =
    "BE84RnNoCCzbby8LeJ3YsbTs_enS74Dg9dg8XVfpBh1Q7DoFrSP5bM9LDaERfGSWzKsqiVLBNQrjZbUqPm_p73M";
if("serviceWorker" in navigator){
 
  navigator.serviceWorker
  .register(url)
  .then((register) => {
    console.log("SWService worker registered");
  
  })
  .catch((err) => { console.log("SWerr Occured", err)});



  navigator.serviceWorker.ready.then((register)=>{
    register.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    .then((subscription) => {
      //Send Push Noti
      console.log("Sending Push subscription object");
      fetch(push_server_host+"/subscribe?first_name="+first_name+"&email_id="+email_id, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      }).then((resp) => {
        console.log("Push  subscription object sent..");
      });
    });
  })


}

else{
  alert("SW not supported")
}




}
