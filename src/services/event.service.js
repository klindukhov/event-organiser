import http from "../http-common";

class EventDataService {
  getAll() {
    return http.get("");
  }

}

export default new EventDataService();
