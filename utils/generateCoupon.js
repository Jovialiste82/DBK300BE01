import Coupon from "../models/couponModel.js";

export const generateCoupon = async () => {
  let label = generateRandomString(20);

  while (await Coupon.exists({ label: label })) {
    label = generateRandomString(20);
  }

  return label;
};

const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Example usage:
generateCoupon()
  .then((couponLabel) => {
    console.log("Generated coupon label:", couponLabel);
  })
  .catch((err) => {
    console.error("Error generating coupon:", err);
  });
