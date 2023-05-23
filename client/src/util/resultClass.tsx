import { V1Result } from "common";

export default (result: V1Result) => {
  switch (result.status) {
    case "success":
      return "is-success";
      break;
    case "failure":
      return "is-danger";
      break;
    case "pending":
      return "";
      break;
    default:
      return "";
      break;
  }
};
