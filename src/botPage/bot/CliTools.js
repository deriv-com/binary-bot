import Observer from "Observer";
import Interpreter from "./Interpreter";
import TicksService from "../common/TicksService";
import api from "../view/deriv/api";


export const createScope = () => {
  const observer = new Observer();
  const ticksService = new TicksService(api);

  return { observer, api, ticksService };
};

export const createInterpreter = () => new Interpreter();
