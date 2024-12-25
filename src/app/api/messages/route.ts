import { flush, getAllValues } from "node-global-storage";

export async function GET() {
    const data = getAllValues()
    const events : any = {}
    for(const key in data) {
        const notiEvents = data[key] as any
        const token = await getAccessToken(notiEvents.project_id)
        notiEvents.events.forEach((evt: {
            dialogue_id: string;
             event_type: string; 
}) => {
            const allowedEventTypes = ['dialogue_human_agent_needed', 'message_received', 'dialogue_started'];

            if (allowedEventTypes.includes(evt.event_type)) {
                events[evt.dialogue_id] = {
                    url: `${process.env.SHML_URL}/?token=${token}&project_id=${notiEvents.project_id}&dialogue_id=${evt.dialogue_id}`
                };
            }
        });
    }
    flush();
    return Response.json(events)
}


async function getAccessToken(projectId: string) : Promise<string>{
    try {
        var token = process.env.USER_NAME + ":" + process.env.USER_PASSWORD;
        const client = {
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "scope": "profile agency"
          }
        const response = await fetch(`${process.env.AUTH_URL}/oauth2/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(token)}`,
          },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify(client), 
        });
        if (response.status == 200) {
          const user_token = await response.json()
          const ex_token = {
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "project_id": projectId,
            "access_token": user_token.access_token,
            "scope": "profile project"
          }
          const response_project = await fetch(`${process.env.AUTH_URL}/oauth2/token?grant_type=token_exchange`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(4000),
            body: JSON.stringify(ex_token), // body data type must match "Content-Type" header
          });
          if (response_project.status == 200) {
            const project_token = await response_project.json()
            return project_token.access_token
          } else {
            console.log("Sending the request has failed!")
          }
        }
        else {
          console.log("Sending the request has failed!")
        }
      } catch (ex) {
        console.log("Connection Timed out!")
      }
      return '';
}