import moment from "moment";

export var commonDateFormate = (date) => {
  const today = moment(date).format("DD MMM, YYYY hh:mm A");
  return today;
};