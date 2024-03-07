// At the top of your file, import the necessary functions from express-validator
import { body } from "express-validator";
import { differenceInYears } from "date-fns";

export const registerValidationRules = [
  body("email").isEmail().withMessage("Must be a valid email address").trim(),
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("Must be at least 5 characters and no more than 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
    )
    .withMessage(
      "Must contain at least one uppercase, one lowercase, one number and one special character"
    ),
  body("dob")
    .toDate()
    .custom((value) => {
      if (differenceInYears(new Date(), value) < 18) {
        throw new Error("Must be at least 18 years old");
      }
      return true;
    }),
  body("coupon") // Updated from 'invitationCode' to 'coupon'
    .not()
    .isEmpty()
    .withMessage("Coupon is required"),
  body("confirmPassword")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

// Validation rules for authenticating a user
export const authValidationRules = [
  body("email").isEmail().withMessage("Must be a valid email address"),
  body("password").not().isEmpty().withMessage("Password is required"),
];
