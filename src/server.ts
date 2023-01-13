import http, { IncomingMessage, ServerResponse } from "node:http";

import { UserController } from "./controller";
import { validate } from "uuid";
import { getReqData, userResponse } from "./utils";

const usersData = new UserController();

export function server(port: number) {
  async function requestListener(req: IncomingMessage, res: ServerResponse) {
    const response = new userResponse(res);

    // USERS
    if (req.url === "/api/users") {
      // USERS GET
      if (req.method === "GET") {
        response.send(200, JSON.stringify(usersData.getUsers()));
      }
      // USER POST
      else if (req.method === "POST") {
        const reqBody = await getReqData(req);
        if (usersData.addUser(reqBody)) {
          response.send(201, "User added!");
        } else {
          response.send(400, "Body does not contain required fields!");
        }
      } else {
        response.notFound();
      }
    }
    // USER BY ID
    else if (req.url?.match(/\/api\/users\/([0-9a-fA-F])/)) {
      const userId = req.url.split("/")[3];
      if (!validate(userId)) {
        response.send(400, "Invalid user id");
        return;
      }
      switch (req.method) {
        case "GET": {
          const user = usersData.getUser(userId);
          if (user) {
            response.send(200, JSON.stringify(user));
          } else response.noUserResp();
          break;
        }
        case "PUT": {
          const reqBody = await getReqData(req);
          if (usersData.putUser(reqBody, userId)) {
            response.send(200, "User updated!");
          } else response.noUserResp();
          break;
        }
        case "DELETE": {
          if (usersData.deleteUser(userId)) {
            response.send(204);
          } else response.noUserResp();
          break;
        }
        default:
          response.notFound();
      }
    }
    // 404 not found
    else {
      response.notFound();
    }
  }

  const server = http.createServer(requestListener);
  console.log("Server started on port: " + port);
  server.listen(port);
}
