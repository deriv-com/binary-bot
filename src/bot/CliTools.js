import api from "Api";
import Observer from "Observer";
import TicksService from "Common/TicksService";
import Interpreter from "./Interpreter";


export const createScope = () => {
  const observer = new Observer();
  const ticksService = new TicksService(api);

  return { observer, api, ticksService };
};

export const createInterpreter = () => new Interpreter();
