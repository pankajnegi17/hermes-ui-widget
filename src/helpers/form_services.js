const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() <= 8 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate()}`;
};

const parseDate = (date) => {
  return Date.parse(date);
};

export const get_initialization_leave_form_data = (formData, userQuery) => {
  let modified_data = {
    fromdate: formData.fromdate == "" ? today() : formData.fromdate,
    todate:
      formData.todate == ""
        ? formData.fromdate
          ? formData.fromdate
          : today()
        : formData.todate,
    leavetype: formData.leavetype == "" ? "casual leave" : formData.leavetype,
    leavepurpose:
      formData.leavepurpose == "" ? userQuery : formData.leavepurpose,
    noofdays: formData.noofdays == "" ? 0 : formData.noofdays,
  };

  return modified_data;
};
