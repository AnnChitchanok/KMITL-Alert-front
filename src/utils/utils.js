const monthTransform = (monthNumber) => {
  switch (monthNumber) {
    case 1:
      return "มกราคม";
    case 2:
      return "กุมภาพันธ์";
    case 3:
      return "มีนาคม";
    case 4:
      return "เมษายน";
    case 5:
      return "พฤษภาคม";
    case 6:
      return "มิถุนายน";
    case 7:
      return "กรกฎาคม";
    case 8:
      return "สิงหาคม";
    case 9:
      return "กันยายน";
    case 10:
      return "ตุลาคม";
    case 11:
      return "พฤศจิกายน";
    case 12:
      return "ธันวาคม";
  }
};

const dateTransform = (text) => {
  // 2022-1-20
  const t = text.split("-");
  const result =
    "วันที่ " +
    t[2] +
    " เดือน " +
    monthTransform(parseInt(t[1])) +
    " พ.ศ. " +
    t[0];
  return result;
};

export default dateTransform;
